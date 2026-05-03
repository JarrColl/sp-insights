import { createSignal, For, JSX, Show } from 'solid-js';
import { ValueOf } from '../../types';
import { formatDateWithWeekday, formatDecimalHours, formatTime } from '../../../utils/date';
import { DailyBreakdownEntry, Metrics, TableEntry } from '../../models';
import { projectCell } from '../../render';

const HOUR_FORMAT = { FORMATTED: 'formatted', DECIMAL: 'decimal' } as const;
type HourFormat = ValueOf<typeof HOUR_FORMAT>;
const ROUNDING_MODES = { NONE: "none", MIN_6: "6min", MIN_15: "15min", MIN_30: "30min" } as const;
type RoundingMode = ValueOf<typeof ROUNDING_MODES>;
const SORT_DIRECTION = { DATE_PROJECT: 'date-project', PROJECT_DATE: 'project-date' } as const;
type SortDirection = ValueOf<typeof SORT_DIRECTION>;

export const ROUNDING_MINUTES = {
  [ROUNDING_MODES.NONE]: 0,
  [ROUNDING_MODES.MIN_6]: 6,
  [ROUNDING_MODES.MIN_15]: 15,
  [ROUNDING_MODES.MIN_30]: 30,
} as const;

function DailyBreakdown(props: { metrics: Metrics }) {

  const [hourFormat, setHourFormat] = createSignal<HourFormat>(HOUR_FORMAT.FORMATTED);
  const [roundingMode, setRoundingMode] = createSignal<RoundingMode>(ROUNDING_MODES.NONE);
  const [sortDirection, setSortDirection] = createSignal<SortDirection>(SORT_DIRECTION.DATE_PROJECT);

  const applyRounding = (milliseconds: number) => {
    const minutes = ROUNDING_MINUTES[roundingMode()];
    if (minutes === 0) return milliseconds;
    const incrementMs = minutes * 60 * 1000;
    return Math.round(milliseconds / incrementMs) * incrementMs;
  };

  const hoursCellContent = (ms: number) => {
    if (hourFormat() === HOUR_FORMAT.DECIMAL) {
      return { text: formatDecimalHours(ms), title: formatTime(ms) };
    }
    return { text: formatTime(ms), title: formatDecimalHours(ms) };
  };

  // const htmlRows = [];
  const dataRow = (entry: DailyBreakdownEntry) => {
    const ms = applyRounding(entry.totalMs);
    const { text, title } = hoursCellContent(ms);
    return (
      <tr>
        <td style="white-space: nowrap;">{formatDateWithWeekday(entry.dateStr)}</td>
        <td class="project-cell" style="color: var(--text-color-muted, #9e9e9e); font-size: 0.875rem;">
          {projectCell(entry)}
        </td>
        <td class="time-cell" title={title}>{text}</td>
      </tr>
    );
  };

  const subtotalRow = (labelHtml: string, rawTotalMs: number) => {
    const ms = applyRounding(rawTotalMs);
    const { text, title } = hoursCellContent(ms);
    return (
      <tr class="subtotal-row">
        <td></td>
        <td>{labelHtml}</td>
        <td class="time-cell" title={title}>{text}</td>
      </tr>
    );
  };

  const renderRows = () => {
    let htmlRows: JSX.Element[] = []
    if (sortDirection() === SORT_DIRECTION.PROJECT_DATE) {

      const projectGroups = new Map();
      props.metrics.dailyBreakdownEntries.forEach((e) => {
        const key = e.projectId || "__no_project__";
        if (!projectGroups.has(key)) {
          projectGroups.set(key, {
            projectName: e.projectName,
            entries: [],
            totalMs: 0,
          });
        }
        const g = projectGroups.get(key);
        g.entries.push(e);
        g.totalMs += e.totalMs;
      });

      const sortedGroups = Array.from(projectGroups.values()).sort(
        (a, b) => b.totalMs - a.totalMs,
      );
      sortedGroups.forEach((group) => {
        const sortedEntries = [...group.entries].sort((a, b) =>
          b.dateStr.localeCompare(a.dateStr),
        );

        sortedEntries.forEach((e) => htmlRows.push(dataRow(e)));

        htmlRows.push(
          subtotalRow(
            `Project total — ${group.projectName}`,
            group.totalMs,
          ),
        );
      });
    } else {

      const dateGroups = new Map();
      props.metrics.dailyBreakdownEntries.forEach((e) => {
        if (!dateGroups.has(e.dateStr)) {
          dateGroups.set(e.dateStr, { entries: [], totalMs: 0 });
        }
        const g = dateGroups.get(e.dateStr);
        g.entries.push(e);
        g.totalMs += e.totalMs;
      });

      const sortedDates = Array.from(dateGroups.keys()).sort((a, b) =>
        b.localeCompare(a),
      );
      sortedDates.forEach((dateStr) => {
        const g = dateGroups.get(dateStr);
        const sortedEntries = [...g.entries].sort(
          (a, b) => b.totalMs - a.totalMs,
        );

        sortedEntries.forEach((e) => htmlRows.push(dataRow(e)));

        htmlRows.push(
          subtotalRow(
            `Day total — ${formatDateWithWeekday(dateStr)}`,
            g.totalMs,
          ),
        );
      });

    }

    return htmlRows;
  };

  return (
    <div class="view-content no-padding">
      <div class="daily-breakdown-toolbar">
        <label for="daily-breakdown-sort">Sort:</label>
        <select
          id="daily-breakdown-sort"
          class="chart-select"
          value={sortDirection()}
          onChange={(e) => setSortDirection(e.target.value as SortDirection)}
        >
          <option value={SORT_DIRECTION.DATE_PROJECT} selected>
            Date &rarr; Project
          </option>
          <option value={SORT_DIRECTION.PROJECT_DATE}>Project &rarr; Date</option>
        </select>
        <label for="daily-breakdown-rounding" style="margin-left: var(--s2, 1rem)">
          Round:
        </label>
        <select
          id="daily-breakdown-rounding"
          class="chart-select"
          value={roundingMode()}
          onChange={(e) => setRoundingMode(e.target.value as RoundingMode)}
        >
          <option value={ROUNDING_MODES.NONE}>0</option>
          <option value={ROUNDING_MODES.MIN_6}>6</option>
          <option value={ROUNDING_MODES.MIN_15}>15</option>
          <option value={ROUNDING_MODES.MIN_30}>30</option>
        </select>
        <label for="daily-breakdown-format" style="margin-left: var(--s2, 1rem)">Format:</label>
        <select
          id="daily-breakdown-format"
          class="chart-select"
          value={hourFormat()}
          onChange={(e) => setHourFormat(e.target.value as HourFormat)}
        >
          <option value={HOUR_FORMAT.FORMATTED}>
            Formatted
          </option>
          <option value={HOUR_FORMAT.DECIMAL}>Decimal</option>
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
        <tbody>
          <Show
            when={props.metrics.dailyBreakdownEntries.length > 0}
            fallback={
              <tr>
                <td colspan="3" style="text-align: center; color: var(--text-color-muted, #9e9e9e); padding: 3rem;">
                  No tracked time found for this date range.
                </td>
              </tr>
            }
          >
            {renderRows()}
          </Show>
        </tbody>
      </table>
    </div>
  );
}

export default DailyBreakdown;
