import { PluginAPI, PluginHooks } from '@super-productivity/plugin-api';

// Local extensions to PluginAPI: these methods exist at runtime in
// Super Productivity but are not declared in the upstream types.
// Keep them here (not in the vendored types) so the vendored copy
// stays a clean diff against upstream.
interface PluginAPIExt extends PluginAPI {
  translate(key: string, params?: Record<string, unknown>): Promise<string>;
  getCurrentLanguage(): Promise<string>;
}

declare const plugin: PluginAPIExt;

interface IncomingMessage {
  type: string;
  payload?: {
    title?: string;
    projectId?: string | null;
    key?: string;
    params?: Record<string, unknown>;
    [k: string]: unknown;
  };
}

// Example: Register a menu entry
// plugin.registerMenuEntry({
//   label: 'Dashboard 123',
//   icon: 'rocket',
//   onClick: () => {
//     plugin.showIndexHtmlAsView();
//   },
// });

// Example: Register keyboard shortcut
plugin.registerShortcut({
  id: 'open-boilerplate-plugin',
  label: 'Open Boilerplate Plugin',
  onExec: () => {
    plugin.showIndexHtmlAsView();
  },
});

// Example: Custom command handler
if (plugin.onMessage) {
  plugin.onMessage(async (raw: unknown) => {
    const message = raw as IncomingMessage;
    switch (message?.type) {
      case 'getStats': {
        const tasks = await plugin.getTasks();
        const completedToday = tasks.filter(
          (t) =>
            t.isDone &&
            t.doneOn != null &&
            new Date(t.doneOn).toDateString() === new Date().toDateString(),
        );
        return {
          totalTasks: tasks.length,
          completedToday: completedToday.length,
          pendingTasks: tasks.filter((t) => !t.isDone).length,
        };
      }
      case 'getTasks':
        console.log('GET tasks was called!');
        return await plugin.getTasks();
      case 'getAllProjects':
        return await plugin.getAllProjects();
      case 'saveSettings':
        await plugin.persistDataSynced(JSON.stringify(message.payload));
        return { success: true };
      case 'loadSettings': {
        const settings = await plugin.loadSyncedData();
        return settings ? JSON.parse(settings) : {};
      }
      case 'translate':
        return await plugin.translate(message.payload?.key ?? '', message.payload?.params);
      case 'getCurrentLanguage':
        return await plugin.getCurrentLanguage();
      default:
        return { error: 'Unknown message type' };
    }
  });
}

plugin.registerHook(PluginHooks.ACTION, (payload) => {
  console.log('[sp-dashboard plugin] ACTION hook triggered', payload.action);
  // Super Productivity renders UI plugins inside sandboxed iframes.
  // Locate our iframe and send it a lightweight trigger to refresh its data.
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach((iframe) => {
    if (iframe.src && iframe.src.includes('index.html')) {
      iframe.contentWindow?.postMessage({ type: 'SP_STATE_CHANGED' }, '*');
    }
  });
});
