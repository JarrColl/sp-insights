import {
  PluginAPI,
  PluginHooks
} from '@super-productivity/plugin-api';

declare const plugin: PluginAPI;

// Example: Register a menu entry
plugin.registerMenuEntry({
  label: 'Boilerplate Plugin',
  icon: 'rocket',
  onClick: () => {
    plugin.showIndexHtmlAsView();
  },
});

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
  plugin.onMessage(async (message: any) => {
    switch (message?.type) {
      case 'getStats':
        const tasks = await plugin.getTasks();
        const completedToday = tasks.filter(
          (t) => t.isDone && new Date(t.doneOn!).toDateString() === new Date().toDateString(),
        );

        return {
          totalTasks: tasks.length,
          completedToday: completedToday.length,
          pendingTasks: tasks.filter((t) => !t.isDone).length,
        };
      case 'createTask': {
        const newTask = await plugin.addTask({
          title: message.payload.title,
          projectId: message.payload.projectId,
        });

        plugin.showSnack({
          msg: `Task "${message.payload.title}" created!`,
          type: 'SUCCESS',
        });

        return newTask;
      }
      case 'getTasks':
        return await plugin.getTasks();
      case 'getAllProjects':
        return await plugin.getAllProjects();
      // Example: Persist plugin data
      case 'saveSettings':
        await plugin.persistDataSynced(JSON.stringify(message.payload));
        return { success: true };
      // Example: Load plugin data
      case 'loadSettings': {
        const settings = await plugin.loadSyncedData();
        return settings ? JSON.parse(settings) : {};
      }
      // i18n support
      case 'translate':
        return await plugin.translate(message.payload.key, message.payload.params);
      case 'getCurrentLanguage':
        return await plugin.getCurrentLanguage();
      default:
        return { error: 'Unknown message type' };
    }
  });
}

// Listen for language changes and notify iframe
plugin.registerHook(PluginHooks.ACTION, (action) => {

  console.log("[sp-dashboard plugin] ACTION hook triggered", action.type);
  // Super Productivity renders UI plugins inside sandboxed iframes.
  // We locate our specific iframe and send it a lightweight trigger to refresh its data.
  const iframes = document.querySelectorAll("iframe");

  iframes.forEach((iframe) => {
    if (iframe.src && iframe.src.includes("index.html")) {
      console.log(
        "[sp-dashboard plugin] sending SP_STATE_CHANGED to",
        iframe.src,
      );
      (iframe as HTMLIFrameElement).contentWindow!.postMessage(
        {
          type: "SP_STATE_CHANGED",
        },
        "*",
      );
    }
  });
});

// Listen for language changes and notify iframe
plugin.registerHook(PluginHooks.LANGUAGE_CHANGE, (language: string) => {
  // Notify the iframe about language change
  const iframe = document.querySelector('iframe[data-plugin-iframe]');
  if (iframe && (iframe as HTMLIFrameElement).contentWindow) {
    (iframe as HTMLIFrameElement).contentWindow!.postMessage(
      { type: 'languageChanged', language },
      '*',
    );
  }
});
