import { IEvent } from '@t/interface';

const ipcRenderer = window.electron.ipcRenderer;
const service = 'db:event:';

export const list = () => ipcRenderer.invoke(`${service}list`);
export const create = (data: IEvent | IEvent[]) => ipcRenderer.invoke(`${service}create`, data);

export const listWithColor = () => ipcRenderer.invoke(`${service}listWithColor`);
