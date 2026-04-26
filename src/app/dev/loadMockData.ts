import { Setter } from 'solid-js';
import { MS_PER_DAY } from '../constants';
import { toDateString } from '../utils/date';
import { log } from '../utils/log';
// import { setCachedTasks, setCachedProjects } from "../state.js";
// import { processData } from "../processing/processData.js";
import { Task, Project } from '@super-productivity/plugin-api';

export const loadMockData = (setTasks: Setter<Task[]>, setProjects: Setter<Project[]>) => {
  log('No PluginAPI detected. Loading mock data...');

  const now = Date.now();
  const daysAgo = (n: number) => toDateString(now - n * MS_PER_DAY);
  const timeAt = (n: number, hour: number) =>
    new Date(daysAgo(n) + `T${String(hour).padStart(2, '0')}:00:00Z`).getTime();

  const dates = [daysAgo(0), daysAgo(1), daysAgo(2), daysAgo(3)];

  const mockProjects: Project[] = [
    {
      id: 'p1',
      title: 'Website Redesign',
      theme: { primary: '#60a5fa' },
      taskIds: ['t1', 't4'],
      backlogTaskIds: [],
      noteIds: [],
      advancedCfg: undefined,
    },
    {
      id: 'p2',
      title: 'Marketing Campaign',
      theme: { primary: '#f472b6' },
      taskIds: ['t2'],
      backlogTaskIds: [],
      noteIds: [],
      advancedCfg: undefined,
    },
  ];

  const mockTasks: Task[] = [
    {
      id: 't1',
      parentId: null,
      title: 'Create Figma Mockups',
      isDone: true,
      doneOn: timeAt(0, 10),
      projectId: 'p1',
      timeSpentOnDay: { [dates[0]]: 14400000, [dates[1]]: 7200000 },
      timeEstimate: 0,
      timeSpent: 0,
      tagIds: [],
      created: 0,
      subTaskIds: [],
    },
    {
      id: 't2',
      parentId: null,
      title: 'General Admin',
      isDone: false,
      projectId: null,
      timeSpentOnDay: { [dates[0]]: 3600000 },
      timeEstimate: 0,
      timeSpent: 0,
      tagIds: [],
      created: 0,
      subTaskIds: [],
    },
    {
      id: 't3',
      parentId: null,
      title: 'Draft Email Copy',
      isDone: true,
      doneOn: timeAt(2, 10),
      projectId: 'p2',
      timeSpentOnDay: { [dates[2]]: 18000000 },
      timeEstimate: 0,
      timeSpent: 0,
      tagIds: [],
      created: 0,
      subTaskIds: [],
    },
    {
      id: 't4',
      parentId: null,
      title: 'Setup Database',
      isDone: false,
      projectId: 'p1',
      timeSpentOnDay: { [dates[3]]: 10800000 },
      timeEstimate: 0,
      timeSpent: 0,
      tagIds: [],
      created: 0,
      subTaskIds: [],
    },
    {
      id: 't5',
      parentId: null,
      title: 'Write Documentation',
      isDone: false,
      projectId: 'p1',
      timeSpentOnDay: {},
      timeEstimate: 0,
      timeSpent: 0,
      tagIds: [],
      created: 0,
      subTaskIds: [],
    },
    {
      id: 't6',
      parentId: null,
      title: 'API Integration',
      isDone: false,
      projectId: 'p1',
      subTaskIds: ['t6-1'],
      timeSpentOnDay: { [dates[0]]: 5400000, [dates[1]]: 7200000 },
      timeEstimate: 0,
      timeSpent: 0,
      tagIds: [],
      created: 0,
    },
    {
      id: 't6-1',
      parentId: 't6',
      title: 'Fix authentication endpoint',
      isDone: true,
      doneOn: timeAt(1, 14),
      projectId: 'p1',
      timeSpentOnDay: { [dates[1]]: 7200000 },
      timeEstimate: 0,
      timeSpent: 0,
      tagIds: [],
      created: 0,
      subTaskIds: [],
    },
    {
      id: 't7',
      parentId: null,
      title: 'Review Code',
      isDone: true,
      doneOn: timeAt(1, 15),
      projectId: 'p1',
      timeSpentOnDay: { [dates[1]]: 3600000 },
      timeEstimate: 0,
      timeSpent: 0,
      tagIds: [],
      created: 0,
      subTaskIds: [],
    },
  ];

  setTasks(mockTasks);
  setProjects(mockProjects);
  // processData(mockTasks, mockProjects);
};
