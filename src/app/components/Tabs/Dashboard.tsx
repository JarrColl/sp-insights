import { Task, Project } from '@super-productivity/plugin-api';

function Dashboard(props: { tasks: Task[]; projects: Project[] }) {
  return (
    <div id="view-dashboard" class="view-content">
      <div class="grid-3">
        <div class="stat-card">
          <div class="stat-header">
            <h3 class="stat-title">Total Time Tracked</h3>
            <div class="stat-icon" style="background: rgba(96, 165, 250, 0.1); color: #60a5fa">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
          </div>
          <div class="stat-value-container">
            <span class="stat-value" id="stat-time">
              0h 0m
            </span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <h3 class="stat-title">Tasks Completed</h3>
            <div class="stat-icon" style="background: rgba(74, 222, 128, 0.1); color: #4ade80">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
          </div>
          <div class="stat-value-container">
            <span class="stat-value" id="stat-tasks">
              0
            </span>
            <span class="stat-suffix" id="stat-tasks-total">
              / 0 total
            </span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" id="stat-tasks-progress" style="width: 0%"></div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <h3 class="stat-title">Overdue Tasks</h3>
            <div class="stat-icon badge-red">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
          </div>
          <div class="stat-value-container" style="align-items: center">
            <div>
              <span class="stat-value" id="stat-overdue">
                0
              </span>
              <span class="stat-suffix">tasks</span>
            </div>
            <span class="badge badge-red hidden" id="stat-overdue-label">
              Needs Attention
            </span>
            <div
              id="overdue-note"
              class="text-red"
              style="font-size: 0.75rem; margin-top: 4px; display: none"
            ></div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <h3 class="stat-title">Completed Late</h3>
            <div class="stat-icon" style="background: rgba(251, 191, 36, 0.1); color: #fbbf24">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
          </div>
          <div class="stat-value-container">
            <span class="stat-value" id="stat-late">
              0
            </span>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <div class="chart-card">
          <div class="card-header">
            <h3 class="card-title">Daily Trends</h3>
            <select id="bar-chart-select" class="chart-select">
              <option value="time">Time Tracked</option>
              <option value="completed" selected>
                Tasks Completed
              </option>
              <option value="overdue">Tasks Overdue</option>
              <option value="late">Completed Late</option>
            </select>
          </div>
          <div class="chart-container">
            <div class="bar-chart" id="bar-chart-container"></div>
          </div>
        </div>

        <div class="chart-card">
          <div class="card-header">
            <h3 class="card-title">Project Breakdown</h3>
            <select id="pie-chart-select" class="chart-select">
              <option value="time">Time Tracked</option>
              <option value="completed" selected>
                Tasks Completed
              </option>
              <option value="overdue">Tasks Overdue</option>
              <option value="late">Completed Late</option>
            </select>
          </div>
          <div class="chart-container">
            <div class="pie-wrapper">
              <div class="pie-chart" id="pie-chart-element"></div>
              <div class="pie-legend" id="pie-legend-container"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
