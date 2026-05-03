import { ValueOf } from './types'

export const MS_PER_MINUTE = 60 * 1000;
export const MS_PER_HOUR = 60 * MS_PER_MINUTE;
export const MS_PER_DAY = 24 * MS_PER_HOUR;

export const UNCATEGORIZED_PROJECT_NAME = 'Uncategorized';

export const DATE_PRESETS = {
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
  CUSTOM: 'custom',
} as const;
export type DatePreset = ValueOf<typeof DATE_PRESETS>;

export const MODES = {
  CHART: {
    TIME: 'time',
    COMPLETED: 'completed',
    OVERDUE: 'overdue',
    LATE: 'late',
  },
} as const;

export const PIE_COLORS = [
  '#03a9f4',
  '#b388ff',
  '#4ade80',
  '#f472b6',
  '#fbbf24',
  '#f87171',
  '#34d399',
  '#818cf8',
  '#a78bfa',
] as const;

export const TAB_IDS = ['dashboard', 'daily-breakdown', 'details'] as const;
