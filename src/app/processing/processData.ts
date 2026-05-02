import { MODES, MS_PER_DAY, UNCATEGORIZED_PROJECT_NAME } from '../constants';
import { log } from '../../utils/log';
import { toDateString, getDatesInRange } from '../../utils/date';
import { Project, Task } from '@super-productivity/plugin-api';
import { Metrics } from '../models';

export const getDueBounds = (task: Task): { dueStart: number | null; dueEnd: number | null } => {
  let dueStart: number | null = null;
  if (task.dueDay) {
    const parsed = Date.parse(task.dueDay);
    if (!isNaN(parsed)) {
      dueStart = parsed;
    }
  }
  const dueEnd = dueStart !== null ? dueStart + MS_PER_DAY - 1 : null;
  return { dueStart, dueEnd };
};

export const processData = (
  tasks: Task[],
  projects: Project[],
  preset: string,
  dateFrom: string,
  dateTo: string,
): Metrics => {
  let dateFromStr: string;
  let dateToStr: string;

  if (preset === MODES.PRESET.CUSTOM) {
    dateFromStr = dateFrom;
    dateToStr = dateTo;
  } else {
    const endObj = new Date();
    const startObj = new Date();
    if (preset === MODES.PRESET.WEEK) {
      startObj.setDate(endObj.getDate() - 6);
    } else if (preset === MODES.PRESET.MONTH) {
      startObj.setMonth(endObj.getMonth() - 1);
    } else if (preset === MODES.PRESET.YEAR) {
      startObj.setFullYear(endObj.getFullYear() - 1);
    }
    dateFromStr = toDateString(startObj);
    dateToStr = toDateString(endObj);
  }

  const dateRange = getDatesInRange(dateFromStr, dateToStr);
  log('computed date range', dateFromStr, dateToStr, dateRange);

  const projectMap = Object.fromEntries(
    projects.map((p) => [p.id, { title: p.title, color: p.theme?.primary ?? null }]),
  );

  const UNCATEGORIZED_INFO = { title: UNCATEGORIZED_PROJECT_NAME, color: null };
  const getProjectInfo = (projectId: string | null) => {
    if (!projectId) return UNCATEGORIZED_INFO;
    return projectMap[projectId] ?? UNCATEGORIZED_INFO;
  };

  const getProjectName = (projectId: string | null) => getProjectInfo(projectId).title;

  const metrics: Metrics = {
    totalTimeSpent: 0,
    totalCompleted: 0,
    totalTasks: 0,
    overdueTasks: 0,
    lateCompleted: 0,
    unplannedCount: 0,
    weeklyData: { labels: dateRange, data: new Array(dateRange.length).fill(0) },
    completedPerDay: { labels: dateRange, data: new Array(dateRange.length).fill(0) },
    overduePerDay: { labels: dateRange, data: new Array(dateRange.length).fill(0) },
    latePerDay: { labels: dateRange, data: new Array(dateRange.length).fill(0) },
    projectData: {},
    projectCompletedData: {},
    projectOverdueData: {},
    projectLateData: {},
    tableEntries: [],
    dailyBreakdownEntries: [],
  };

  const dailyBreakdownMap = new Map<
    string,
    {
      dateStr: string;
      projectId: string | null;
      projectName: string;
      projectColor: string | null;
      totalMs: number;
    }
  >();

  const now = Date.now();
  const rangeEndTime = new Date(dateToStr + 'T23:59:59').getTime();

  const dayBoundsByDate = new Map<string, { dayStart: number; dayEnd: number }>();
  dateRange.forEach((dateStr) => {
    const dayStart = new Date(dateStr + 'T00:00:00').getTime();
    dayBoundsByDate.set(dateStr, { dayStart, dayEnd: dayStart + MS_PER_DAY - 1 });
  });

  const dueBoundsCache = new Map<string, { dueStart: number | null; dueEnd: number | null }>();
  const cachedDueBounds = (task: Task) => {
    if (!dueBoundsCache.has(task.id)) {
      dueBoundsCache.set(task.id, getDueBounds(task));
    }
    return dueBoundsCache.get(task.id)!;
  };

  const countedOverdue = new Set<string>();

  tasks.forEach((task: Task) => {
    if (Array.isArray(task.subTaskIds) && task.subTaskIds.length > 0) return;

    const keys = Object.keys(task.timeSpentOnDay || {});
    const overlap = keys.filter((k) => dateRange.includes(k));
    const { dueStart, dueEnd } = cachedDueBounds(task);

    if (!dueStart && !task.isDone) {
      log('task missing dueDay and not done, full object:', task);
    }
    log(
      'processing task',
      task.id,
      task.title,
      'dueDay',
      task.dueDay,
      'dueStartUTC',
      dueStart !== null ? new Date(dueStart).toISOString() : null,
      'dueEndUTC',
      dueEnd !== null ? new Date(dueEnd).toISOString() : null,
      'nowUTC',
      new Date(now).toISOString(),
      'isDone',
      task.isDone,
      'doneOnUTC',
      task.doneOn ? new Date(task.doneOn).toISOString() : null,
      'timeSpentOnDay keys',
      keys,
      'inRange',
      overlap,
    );

    let taskTimeInRange = 0;
    const pInfo = getProjectInfo(task.projectId);
    const pName = pInfo.title;
    const pColor = pInfo.color;

    const isOverdue =
      dueStart !== null &&
      ((!task.isDone && now > dueEnd!) ||
        (task.isDone && task.doneOn != null && task.doneOn > dueEnd!));
    const isLate = isOverdue && task.isDone && task.doneOn != null && task.doneOn > dueEnd!;

    if (isOverdue) {
      metrics.overdueTasks++;
      metrics.projectOverdueData[pName] = (metrics.projectOverdueData[pName] ?? 0) + 1;
      countedOverdue.add(task.id);
      if (isLate) {
        metrics.lateCompleted++;
        metrics.projectLateData[pName] = (metrics.projectLateData[pName] ?? 0) + 1;
      }
    }

    dateRange.forEach((dateStr, index) => {
      const { dayStart, dayEnd } = dayBoundsByDate.get(dateStr)!;
      const spentOnDate = task.timeSpentOnDay?.[dateStr];

      if (spentOnDate) {
        metrics.weeklyData.data[index] += spentOnDate;
        taskTimeInRange += spentOnDate;

        metrics.tableEntries.push({
          date: dateStr,
          projectName: pName,
          projectColor: pColor,
          taskTitle: task.title || 'Untitled Task',
          timeSpent: spentOnDate,
          isDone: task.isDone,
          overdue: isOverdue,
          late: isLate,
        });

        const projectKey = task.projectId ?? '__no_project__';
        const dbKey = `${dateStr}|${projectKey}`;
        const existing = dailyBreakdownMap.get(dbKey);
        if (existing) {
          existing.totalMs += spentOnDate;
        } else {
          dailyBreakdownMap.set(dbKey, {
            dateStr,
            projectId: task.projectId ?? null,
            projectName: pName,
            projectColor: pColor,
            totalMs: spentOnDate,
          });
        }
      }

      if (task.isDone && task.doneOn != null && task.doneOn >= dayStart && task.doneOn <= dayEnd) {
        metrics.completedPerDay.data[index]++;
        metrics.projectCompletedData[pName] = (metrics.projectCompletedData[pName] ?? 0) + 1;
        if (isLate) metrics.latePerDay.data[index]++;
      }

      if (dueStart !== null && dueEnd! < dayEnd) {
        const doneAfter = task.doneOn != null && task.doneOn > dayEnd;
        if (!task.isDone || doneAfter) {
          metrics.overduePerDay.data[index]++;
        }
      }
    });

    if (taskTimeInRange === 0 && task.isDone && task.doneOn != null) {
      const doneDate = toDateString(task.doneOn);
      if (dateRange.includes(doneDate) && !isOverdue && !isLate) {
        metrics.tableEntries.push({
          date: doneDate,
          projectName: pName,
          projectColor: pColor,
          taskTitle: task.title || 'Untitled Task',
          timeSpent: 0,
          isDone: task.isDone,
          overdue: isOverdue,
          late: isLate,
        });
      }
    }

    if (taskTimeInRange === 0 && (isOverdue || isLate)) {
      const badge = isLate ? 'Late' : 'Overdue';
      const overdueDate = dueStart ? toDateString(dueStart) : '';
      metrics.tableEntries.push({
        date: overdueDate,
        projectName: pName,
        projectColor: pColor,
        taskTitle: `${task.title || 'Untitled Task'} (${badge})`,
        timeSpent: 0,
        isDone: task.isDone,
        overdue: isOverdue,
        late: isLate,
      });
    }

    if (taskTimeInRange > 0) {
      metrics.totalTimeSpent += taskTimeInRange;
      metrics.projectData[pName] = (metrics.projectData[pName] ?? 0) + taskTimeInRange;
    }

    const taskCompletedInRange =
      task.isDone && task.doneOn != null && dateRange.includes(toDateString(task.doneOn));
    const taskDueInRange = task.dueDay != null && dateRange.includes(task.dueDay);

    if (taskTimeInRange > 0 || taskCompletedInRange || taskDueInRange) {
      metrics.totalTasks++;
      if (taskCompletedInRange) {
        metrics.totalCompleted++;
        log(
          'incrementing totalCompleted for',
          task.id,
          task.title,
          '- now at',
          metrics.totalCompleted,
        );
      }
    }
  });

  // Second pass: catch overdue tasks outside the date range with no time entries
  tasks.forEach((task: Task) => {
    if (Array.isArray(task.subTaskIds) && task.subTaskIds.length > 0) return;
    if (countedOverdue.has(task.id)) return;

    const { dueStart, dueEnd } = cachedDueBounds(task);
    if (!task.isDone && dueStart !== null && now > dueEnd!) {
      metrics.overdueTasks++;
      const pName = getProjectName(task.projectId);
      metrics.projectOverdueData[pName] = (metrics.projectOverdueData[pName] ?? 0) + 1;
      countedOverdue.add(task.id);
    }
  });

  metrics.unplannedCount = tasks.reduce((cnt, t) => {
    const { dueStart } = cachedDueBounds(t);
    return cnt + (!t.isDone && !dueStart ? 1 : 0);
  }, 0);

  const doneTasks = tasks.filter((t) => t.isDone);
  const doneWithoutTimestamp = doneTasks.filter((t) => !t.doneOn);
  log('FINAL METRICS: totalCompleted=', metrics.totalCompleted, 'totalTasks=', metrics.totalTasks);
  log(
    `Done tasks in array (count=${doneTasks.length}):`,
    doneTasks.map((t) => ({ id: t.id, title: t.title, doneOn: t.doneOn })),
  );
  if (doneWithoutTimestamp.length > 0) {
    console.warn(
      '[sp-dashboard] WARNING: done tasks missing doneOn timestamp:',
      doneWithoutTimestamp.map((t) => ({ id: t.id, title: t.title })),
    );
  }

  metrics.tableEntries.sort((a, b) => b.date.localeCompare(a.date));
  metrics.dailyBreakdownEntries = Array.from(dailyBreakdownMap.values());

  const overdueNoTime = tasks
    .filter((t) => {
      const keys = Object.keys(t.timeSpentOnDay || {});
      const { dueStart, dueEnd } = cachedDueBounds(t);
      return !t.isDone && dueStart !== null && dueEnd! < rangeEndTime && keys.length === 0;
    })
    .map((t) => t.id);
  if (overdueNoTime.length) {
    log('overdue tasks with no time entries', overdueNoTime);
  }

  return metrics;
};
