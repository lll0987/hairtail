import { ipcMain } from 'electron';

import { RecordService } from './record.service';
import { EventService } from './event.service';
import { TagService } from './tag.service';
import { TopicService } from './topic.service';
import { SettingService } from './setting.service';
import { CronService } from './cron.service';
import { InfoService } from './info.service';

type TServices = {
    cron: CronService;
    event: EventService;
    info: InfoService;
    record: RecordService;
    setting: SettingService;
    tag: TagService;
    topic: TopicService;
};
export type TModuleName = keyof TServices;

export const services: TServices = {
    cron: new CronService(),
    event: new EventService(),
    info: new InfoService(),
    record: new RecordService(),
    setting: new SettingService(),
    tag: new TagService(),
    topic: new TopicService()
};
const serviceNames = Object.keys(services);

export const handleService = () => {
    serviceNames.forEach(serviceName => {
        const module = serviceName as TModuleName;
        const service = services[module];

        ipcMain.handle(`db:${module}:list`, () => service.list());
        ipcMain.handle(`db:${module}:add`, (_, data) => service.create(data));
        ipcMain.handle(`db:${module}:update`, (_, id, data) => service.updateById(id, data));
        ipcMain.handle(`db:${module}:remove`, (_, id) => service.deleteById(id));
    });

    ipcMain.handle('db:cron:list:today', () => services.cron.list_today());
    ipcMain.handle('db:event:list:color', () => services.event.list_color());
    ipcMain.handle('db:record:list:today', () => services.record.list_today());
};
