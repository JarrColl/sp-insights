import { Task, Project } from '@super-productivity/plugin-api';

function DailyBreakdown(props: { tasks: Task[], projects: Project[] }) {
  return (
    <div id="view-daily-breakdown" class="view-content no-padding">
      <div class="daily-breakdown-toolbar">
        <label for="daily-breakdown-sort">Sort:</label>
        <select id="daily-breakdown-sort" class="chart-select">
          <option value="date-project" selected>Date &rarr; Project</option>
          <option value="project-date">Project &rarr; Date</option>
        </select>
        <label
          for="daily-breakdown-rounding"
          style="margin-left: var(--s2, 1rem)"
        >Round:</label
        >
        <select id="daily-breakdown-rounding" class="chart-select">
          <option value="none" selected>None</option>
          <option value="6min">6 min (0.1h)</option>
          <option value="15min">15 min (0.25h)</option>
          <option value="30min">30 min (0.5h)</option>
        </select>
        <label
          for="daily-breakdown-format"
          style="margin-left: var(--s2, 1rem)"
        >Format:</label
        >
        <select id="daily-breakdown-format" class="chart-select">
          <option value="formatted" selected>Formatted</option>
          <option value="decimal">Decimal</option>
        </select>
      </div>
      <table class="details-table daily-breakdown-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Project</th>
            <th>Hours</th>
          </tr>
        </thead>
        <tbody id="daily-breakdown-body">
        </tbody>
      </table>
    </div>
  );
}

export default DailyBreakdown;
