import { createSignal, createEffect, For, Show, onMount } from 'solid-js';
import { Task, Project } from '@super-productivity/plugin-api';
import { useTranslate } from '../utils/useTranslate';

import './styles/base.css';
import './styles/layout.css';
import './styles/tabs.css';
import './styles/views.css';
import './styles/stats.css';
import './styles/charts.css';
import './styles/table.css';
import './styles/breakdown.css';
import Header from './components/Header';
import TabbedDiv from './components/Tabs/TabbedDiv';
import { log } from './utils/log';

// Communication with plugin.js
const sendMessage = async (type: string, payload?: any) => {
  return new Promise((resolve) => {
    const messageId = Math.random().toString(36).substr(2, 9);

    const handler = (event: MessageEvent) => {
      if (event.data.messageId === messageId) {
        window.removeEventListener('message', handler);
        resolve(event.data.response);
      }
    };

    window.addEventListener('message', handler);
    window.parent.postMessage({ type, payload, messageId }, '*');
  });
};

function App() {
  const t = useTranslate();
  const [tasks, setTasks] = createSignal<Task[]>([]);
  const [projects, setProjects] = createSignal<Project[]>([]);
  const [stats, setStats] = createSignal({
    totalTasks: 0,
    completedToday: 0,
    pendingTasks: 0,
  });
  const [selectedProjectId, setSelectedProjectId] = createSignal<string>('');
  const [settings, setSettings] = createSignal({ theme: 'light', showCompleted: true });
  const [isLoading, setIsLoading] = createSignal(true);

  // Translation signals for reactive i18n
  const [appTitle, setAppTitle] = createSignal('');
  const [refreshButton, setRefreshButton] = createSignal('');
  const [totalTasksLabel, setTotalTasksLabel] = createSignal('');
  const [completedTodayLabel, setCompletedTodayLabel] = createSignal('');
  const [pendingLabel, setPendingLabel] = createSignal('');
  const [createNewLabel, setCreateNewLabel] = createSignal('');
  const [taskPlaceholder, setTaskPlaceholder] = createSignal('');
  const [noProjectLabel, setNoProjectLabel] = createSignal('');
  const [createButtonLabel, setCreateButtonLabel] = createSignal('');
  const [loadingLabel, setLoadingLabel] = createSignal('');

  // Load translations
  createEffect(async () => {
    setAppTitle(await t('APP.TITLE'));
    setRefreshButton(await t('BUTTONS.REFRESH'));
    setTotalTasksLabel(await t('STATS.TOTAL_TASKS'));
    setCompletedTodayLabel(await t('STATS.COMPLETED_TODAY'));
    setPendingLabel(await t('STATS.PENDING'));
    setCreateNewLabel(await t('TASK.CREATE_NEW'));
    setTaskPlaceholder(await t('TASK.ENTER_TITLE'));
    setNoProjectLabel(await t('TASK.NO_PROJECT'));
    setCreateButtonLabel(await t('TASK.CREATE_BUTTON'));
    setLoadingLabel(await t('LOADING'));
  });

  // Load initial data
  // TODO: REFRESH WHEN task change not just on mount.
  onMount(async () => {
    try {
      setIsLoading(true);

      // Load settings
      const savedSettings = (await sendMessage('loadSettings')) as any;
      if (savedSettings && Object.keys(savedSettings).length > 0) {
        setSettings(savedSettings);
      }

      // Load stats
      const statsData = (await sendMessage('getStats')) as any;
      setStats(statsData);

      // Load tasks and projects
      await refreshData();
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setIsLoading(false);
    }
  });

  // Refresh data from Super Productivity
  const refreshData = async () => {
    if (import.meta.env.DEV) {
      const { loadMockData } = await import('./dev/loadMockData');
      loadMockData(setTasks, setProjects);
      log('Loaded mock data: ', tasks());
      return;
    }

    try {
      const [tasksData, projectsData] = await Promise.all([
        sendMessage('getTasks'),
        sendMessage('getAllProjects'),
      ]);

      setTasks(tasksData as Task[]);
      setProjects(projectsData as Project[]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  // Save settings
  createEffect(() => {
    const currentSettings = settings();
    sendMessage('saveSettings', currentSettings);
  });

  // Apply theme
  createEffect(() => {
    document.body.setAttribute('data-theme', settings().theme);
  });

  return (
    <div class="app">
      <Header />

      <div class="main-card">
        <TabbedDiv tasks={tasks()} projects={projects()} />
      </div>
    </div>
  );
}

export default App;
