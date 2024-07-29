const ipcRenderer = window.electron.ipcRenderer;
const service = 'db:tag:';

export const list = () => ipcRenderer.invoke(service + 'list');
