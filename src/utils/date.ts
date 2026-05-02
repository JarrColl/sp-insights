import { MS_PER_MINUTE, MS_PER_HOUR, ROUNDING_MINUTES } from '../app/constants';

export const toDateString = (dateOrMs: number | Date) =>
  new Date(dateOrMs).toISOString().split('T')[0];

export const formatDateShort = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDateWithWeekday = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getDatesInRange = (startDate: string, endDate: string) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);
  while (currentDate <= end) {
    dates.push(toDateString(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

export const formatTime = (milliseconds: number) => {
  if (!milliseconds) return '0h 0m';
  const totalMinutes = Math.floor(milliseconds / MS_PER_MINUTE);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

export const formatDecimalHours = (milliseconds: number) => {
  return (milliseconds / MS_PER_HOUR).toFixed(2) + 'h';
};

// TODO: UPDATE all these and the constants to typescript, enums etc.
export const applyRounding = (milliseconds: number, mode: string) => {
  const minutes = ROUNDING_MINUTES[mode] || 0;
  if (minutes === 0) return milliseconds;
  const incrementMs = minutes * 60 * 1000;
  return Math.round(milliseconds / incrementMs) * incrementMs;
};
