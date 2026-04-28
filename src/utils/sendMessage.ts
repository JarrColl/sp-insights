// Communication with plugin.js via the PluginAPI.onMessage system
export const sendMessage = async (type: string, payload?: any): Promise<any> => {
  return new Promise((resolve) => {
    const messageId = Math.random().toString(36).substring(2, 9);

    const handler = (event: MessageEvent) => {
      // Listen for MESSAGE_RESPONSE from parent
      if (event.data.type === 'PLUGIN_MESSAGE_RESPONSE' && event.data.messageId === messageId) {
        window.removeEventListener('message', handler);
        resolve(event.data.result);
      }
    };

    window.addEventListener('message', handler);
    const message = { type, payload };
    // Use the proper PLUGIN_MESSAGE type for the plugin message system
    window.parent.postMessage({ type: 'PLUGIN_MESSAGE', message, messageId }, '*');
  });
};
