import { ipcMain } from 'electron';

import { TModuleName } from '@contracts/type';

import { RecordService } from './record.service';
import { EventService } from './event.service';
import { TagService } from './tag.service';
import { TopicService } from './topic.service';
import { SettingService } from './setting.service';
import { CronService } from './cron.service';

export const services: Partial<Record<TModuleName, unknown>> = {
    record: new RecordService(),
    event: new EventService(),
    tag: new TagService(),
    topic: new TopicService(),
    setting: new SettingService(),
    cron: new CronService()
};

export const serviceNames = Object.keys(services);

// NEXT 前后端统一 api 类型
export const handleService = () => {
    serviceNames.forEach(serviceName => {
        const service = services[serviceName];

        ipcMain.handle(`db:${serviceName}:list`, () => service.list());
        ipcMain.handle(`db:${serviceName}:add`, (_, data) => service.create(data));
        ipcMain.handle(`db:${serviceName}:update`, (_, id, data) => service.updateById(id, data));
        ipcMain.handle(`db:${serviceName}:remove`, (_, id) => service.deleteById(id));
    });

    const cronService = services.cron as CronService;
    ipcMain.handle('db:cron:list:today', () => cronService.list_today());

    const eventService = services.event as EventService;
    ipcMain.handle('db:event:list:color', () => eventService.list_color());

    const recordService = services.record as RecordService;
    ipcMain.handle('db:record:list:today', () => recordService.list_today());
};
