import { Types } from 'mongoose';
import { TApiName, TApiRequest, TApiResponse, TDbApiName, TModuleName } from '@contracts/type';
import { IModel } from '@contracts/interface';

const ipcRenderer = window.electron.ipcRenderer;
const invoke = <T extends IModel, R>(
    module: TModuleName,
    api: TApiName<typeof module>,
    ...args: TApiRequest<T>
): Promise<TApiResponse<R | Array<R>>> => {
    const name: TDbApiName<typeof module> = `db:${module}:${api}`;
    return ipcRenderer.invoke(name, ...args);
};

export const useBaseApi = <T extends IModel>(module: TModuleName) => {
    const list = () => invoke<T, T>(module, 'list') as Promise<TApiResponse<T[]>>;
    const add = (data: T | T[]) => invoke<T, Types.ObjectId>(module, 'add', data);
    const update = (id: string, data: T) => invoke<T, Types.ObjectId>(module, 'update', id, data);
    const remove = (id: string) => invoke<T, Types.ObjectId>(module, 'remove', id);
    return { list, add, update, remove };
};

export const useApi = <T extends IModel, R>(module: TModuleName, api: TApiName<typeof module>) => {
    return (...args: TApiRequest<T>) => invoke<T, R>(module, api, ...args);
};
