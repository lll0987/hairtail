import { ISetting } from '@t/interface';

const ipcRenderer = window.electron.ipcRenderer;
const service = 'db:setting:';

export const list = () => ipcRenderer.invoke(`${service}list`);
export const create = (data: ISetting | ISetting[]) => ipcRenderer.invoke(`${service}create`, data);
