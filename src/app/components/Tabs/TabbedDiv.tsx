import { createSignal, For, JSX } from "solid-js";
import { Task, Project } from '@super-productivity/plugin-api';
import Dashboard from "./Dashboard";
import DailyBreakdown from "./DailyBreakdown";
import DetailedList from "./DetailedList";

type Tab = {
  label: string;
  content: () => JSX.Element; // ← function, not JSX.Element
};

function TabbedDiv(props: { tasks: Task[], projects: Project[] }) {
  const [activeTab, setActiveTab] = createSignal(0);

  const tabs = (): Tab[] => [
    { label: "Dashboard", content: () => <Dashboard tasks={props.tasks} projects={props.projects} /> },
    { label: "Daily Breakdown", content: () => <DailyBreakdown tasks={props.tasks} projects={props.projects} /> },
    { label: "Detailed List", content: () => <DetailedList tasks={props.tasks} /> },
  ];


  return (
    <div>
      <div class="tabs">
        <For each={tabs()}>
          {(tab, index) => (
            <button
              onClick={() => setActiveTab(index)}
              class="tab-btn"
              classList={{ active: activeTab() === index() }}
            >
              {tab.label}
            </button>
          )}
        </For>
      </div>
      {tabs()[activeTab()].content()}
    </div>
  );
}

export default TabbedDiv;
