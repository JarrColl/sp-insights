import { DailyBreakdownEntry, TableEntry } from "./models";

export const projectCell = (task: TableEntry | DailyBreakdownEntry) => {
  return (
    <>
      {task.projectColor && (
        <span
          class="project-dot"
          style={{ background: task.projectColor }}
        />
      )}
      <span>{task.projectName}</span>
    </>
  );
};
