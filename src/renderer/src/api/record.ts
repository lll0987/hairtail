import { IRecord } from '@t/interface';

const ipcRenderer = window.electron.ipcRenderer;
const service = 'db:record:';

export const list = () => ipcRenderer.invoke(`${service}list`);
export const create = (record: IRecord) => ipcRenderer.invoke(`${service}create`, record);
