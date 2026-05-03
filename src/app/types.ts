import { DatePreset } from "./constants";

export type ValueOf<T> = T[keyof T];

export type DateSelection =
  | { datePreset: Exclude<DatePreset, 'custom'> }
  | { datePreset: 'custom'; start: string; end: string };
