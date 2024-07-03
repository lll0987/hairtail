import { ipcMain } from 'electron';

import { RecordService } from './services/record.service';

const services = {
    [RecordService.name]: new RecordService()
};

export const serviceNames = Object.keys(services);

export const handleService = () =>
    serviceNames.forEach(serviceName => {
        const service = services[serviceName];

        ipcMain.handle(`db:${serviceName}:list`, () => service.list());
        ipcMain.handle(`db:${serviceName}:create`, (_, data) => service.create(data));
        ipcMain.handle(`db:${serviceName}:update`, (_, id, data) => service.updateById(id, data));
        ipcMain.handle(`db:${serviceName}:delete`, (_, id) => service.deleteById(id));
    });
