// import { createSignal, createEffect, For, Show, onMount } from 'solid-js';

function Header() {
  return (
    <header class="header">
      <div class="title-area">
        <h1 class="title">Dashboard</h1>
        <p class="subtitle">Select a time period to view metrics</p>
      </div>

      <div class="controls">
        <div
          id="custom-date-container"
          class="control-box hidden"
          style="flex-direction: row; gap: var(--s2, 1rem)"
        >
          <div style="display: flex; flex-direction: column">
            <label for="date-from">From</label>
            <input type="date" id="date-from" />
          </div>
          <div style="display: flex; flex-direction: column">
            <label for="date-to">To</label>
            <input type="date" id="date-to" />
          </div>
        </div>

        <div class="control-box">
          <label for="date-preset">Period</label>
          <select id="date-preset">
            <option value="today" selected>
              Today
            </option>
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="year">Past Year</option>
            <option value="custom">Custom Range...</option>
          </select>
        </div>
      </div>
    </header>
  );
}

export default Header;
