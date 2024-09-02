import { TApiName, TApiRequest, TApiResponse, TDbApiName, TModuleName } from '@contracts/type';

const ipcRenderer = window.electron.ipcRenderer;
const invoke = <R>(
    module: TModuleName,
    api: TApiName<typeof module>,
    ...args: TApiRequest<typeof module>
): Promise<TApiResponse<typeof module, typeof api, R>> => {
    const name: TDbApiName<typeof module> = `db:${module}:${api}`;
    return ipcRenderer.invoke(name, ...args);
};

export const useApi = <R, M extends TModuleName, N extends TApiName<M>>(module: M, api: N) => {
    return (...args: TApiRequest<M, N>) => invoke<R>(module, api, ...args);
};

export const useBaseApi = <M extends TModuleName>(module: M) => {
    // const list = (...args: TApiRequest<typeof module, 'list'>) => useApi(module, 'list')(...args);
    const list = (...args: TApiRequest<typeof module, 'list'>) =>
        invoke(module, 'list', ...args) as Promise<TApiResponse<typeof module, 'list'>>;
    const add = (...args: TApiRequest<typeof module, 'add'>) =>
        invoke(module, 'add', ...args) as Promise<TApiResponse<typeof module, 'add'>>;
    const update = (...args: TApiRequest<typeof module, 'update'>) =>
        invoke(module, 'update', ...args) as Promise<TApiResponse<typeof module, 'update'>>;
    const remove = (...args: TApiRequest<typeof module, 'remove'>) =>
        invoke(module, 'remove', ...args) as Promise<TApiResponse<typeof module, 'remove'>>;
    return { list, add, update, remove };
};
