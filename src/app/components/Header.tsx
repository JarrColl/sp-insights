import { createSignal, Show } from 'solid-js';
import { DATE_PRESETS, DatePreset } from '../constants';
import { DateSelection } from '../types';

type HeaderProps = {
  onDatePresetChange: (dateSelection: DateSelection) => void;
};

function Header(props: HeaderProps) {
  const [datePreset, setDatePreset] = createSignal<DatePreset>(DATE_PRESETS.TODAY);
  const [customDateStart, setCustomDateStart] = createSignal<string>('');
  const [customDateEnd, setCustomDateEnd] = createSignal<string>('');

  const handleDatePresetChange = (datePreset: DatePreset) => {
    setDatePreset(datePreset);
    if (datePreset === DATE_PRESETS.CUSTOM) {
      props.onDatePresetChange({ datePreset: 'custom', start: customDateStart(), end: customDateEnd() });
    } else {
      props.onDatePresetChange({ datePreset: datePreset });
    }
  };

  return (
    <header class="header">
      <div class="title-area">
        <h1 class="title">Dashboard</h1>
        <p class="subtitle">Select a time period to view metrics</p>
      </div>

      <div class="controls">
        <Show when={datePreset() === DATE_PRESETS.CUSTOM}>
          <div
            class="control-box"
            style={{ 'flex-direction': 'row', gap: 'var(--s2, 1rem)' }}
          >
            <div style={{ display: 'flex', 'flex-direction': 'column' }}>
              <label for="date-start">From</label>
              <input
                type="date"
                id="date-start"
                value={customDateStart()}
                onChange={(e) => setCustomDateStart(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', 'flex-direction': 'column' }}>
              <label for="date-end">To</label>
              <input
                type="date"
                id="date-end"
                value={customDateEnd()}
                onChange={(e) => setCustomDateEnd(e.target.value)}
              />
            </div>
          </div>
        </Show>

        <div class="control-box">
          <label for="date-preset">Period</label>
          <select
            id="date-preset"
            value={datePreset()}
            onChange={(e) => handleDatePresetChange(e.target.value as DatePreset)}
          >
            <option value={DATE_PRESETS.TODAY}>Today</option>
            <option value={DATE_PRESETS.WEEK}>Past Week</option>
            <option value={DATE_PRESETS.MONTH}>Past Month</option>
            <option value={DATE_PRESETS.YEAR}>Past Year</option>
            <option value={DATE_PRESETS.CUSTOM}>Custom Range...</option>
          </select>
        </div>
      </div>
    </header>
  );
}

export default Header;
