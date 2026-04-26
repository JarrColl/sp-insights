import { Task } from '@super-productivity/plugin-api';
import { For, Show } from 'solid-js';
import { formatDateShort, formatTime, toDateString } from '../../utils/date';

// export const projectCell = (task: Task) => {
//   const dot = task.projectColor
//     ? `<span class="project-dot" style="background: ${task.projectColor}"></span>`
//     : "";
//   return `${dot}<span>${task.projectName}</span>`;
// };

// export const getStatusBadge = (task: Task) => {
//   // if (task.late) return { cls: "badge-yellow", label: "Late" };
//   // if (task.overdue) return { cls: "badge-red", label: "Overdue" };
//   if (task.isDone) return { cls: "badge-done", label: "Done" };
//   return { cls: "badge-progress", label: "In Progress" };
// };

function DetailedList(props: { tasks: Task[] }) {
  return (
    <div id="view-details" class="view-content no-padding">
      <table class="details-table">
        <thead>
          <tr>
            <th data-sort="date">Date</th>
            <th data-sort="projectName">Project</th>
            <th data-sort="taskTitle">Task</th>
            <th data-sort="timeSpent">Time Spent</th>
            <th data-sort="status">Status</th>
          </tr>
        </thead>
        <tbody id="details-table-body">
          <Show when={props.tasks.length > 0} fallback={
            <tr>
              <td colspan="5" style="text-align: center;">No tracked time found.</td>
            </tr>
          }>
            <For each={props.tasks}>
              {(task) => {
                {/* const badge = getStatusBadge(task); */ }
                return (
                  <tr>
                    <td style="white-space: nowrap;">{formatDateShort(toDateString(task.created))}</td>
                    {/* <td class="project-cell" style="color: var(--text-color-muted, #9e9e9e); font-size: 0.875rem;">${projectCell(entry)}</td> */}
                    <td class="project-cell" style="color: var(--text-color-muted, #9e9e9e); font-size: 0.875rem;">{task.projectId}</td>
                    <td style="font-weight: 500;">{task.title}</td>
                    <td class="time-cell">{formatTime(task.timeSpent)}</td>
                    {/* <td><span class="badge ${badge.cls}">${badge.label}</span></td> */}
                    <td><span class="badge">placeholder</span></td>
                  </tr>
                );
              }}
            </For>
          </Show>
        </tbody>
      </table>
    </div>
  );
}

export default DetailedList;
