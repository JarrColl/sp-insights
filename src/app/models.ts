import { Task } from '@super-productivity/plugin-api';

// type ComputedTaskFields = {
// 	isOverdue: boolean;
// 	isLate: boolean;
// };
//
// export type DashboardTask = Task & ComputedTaskFields;

export interface TaskWithDueDay extends Task {
  dueDay: string;
}

interface TableEntry {
  date: string;
  projectName: string;
  projectColor: string;
  taskTitle: string;
  timeSpent: number;
  isDone: boolean;
  overdue: boolean;
  late: boolean;
}

interface DailyBreakdownEntry {
  dateStr: string;
  projectId: string | null;
  projectName: string;
  projectColor: string;
  totalMs: number;
}

interface PerDayData {
  labels: string[];
  data: number[];
}

interface Metrics {
  totalTimeSpent: number;
  totalCompleted: number;
  totalTasks: number;
  overdueTasks: number;
  lateCompleted: number;
  unplannedCount: number;
  weeklyData: PerDayData;
  completedPerDay: PerDayData;
  overduePerDay: PerDayData;
  latePerDay: PerDayData;
  projectData: Record<string, number>;
  projectCompletedData: Record<string, number>;
  projectOverdueData: Record<string, number>;
  projectLateData: Record<string, number>;
  tableEntries: TableEntry[];
  dailyBreakdownEntries: DailyBreakdownEntry[];
}
