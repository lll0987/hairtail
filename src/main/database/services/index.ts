import { ipcMain } from 'electron';

import { TApiRequest, TDbApiName } from '@contracts/type';

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

const funcs = { add: 'create', list: 'list', remove: 'deleteById', update: 'updateById' };
export type TBaseApiName = keyof typeof funcs;

export const handleService = () => {
    Object.keys(services).forEach(key => {
        const module = key as TModuleName;
        const service = services[module];
        Object.keys(funcs).forEach(k => {
            const api = k as TBaseApiName;
            const name: TDbApiName<typeof module> = `db:${module}:${api}`;
            const func = funcs[api];
            const handler = (_, ...args: TApiRequest<typeof module, typeof api>) => service[func](...args);
            ipcMain.handle(name, handler);
        });
    });

    ipcMain.handle('db:cron:list:today', () => services.cron.list_today());
    ipcMain.handle('db:event:list:color', () => services.event.list_color());
    ipcMain.handle('db:record:list:today', () => services.record.list_today());
};
