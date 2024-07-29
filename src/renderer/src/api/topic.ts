const ipcRenderer = window.electron.ipcRenderer;
const service = 'db:topic:';

export const list = () => ipcRenderer.invoke(service + 'list');
