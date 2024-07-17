import { ipcMain } from 'electron';

import { RecordService } from './record.service';
import { EventService } from './event.service';
import { TagService } from './tag.service';
import { TopicService } from './topic.service';

export const services = {
    [RecordService.name]: new RecordService(),
    [EventService.name]: new EventService(),
    [TagService.name]: new TagService(),
    [TopicService.name]: new TopicService()
};

export const serviceNames = Object.keys(services);

export const handleService = () => {
    serviceNames.forEach(serviceName => {
        const service = services[serviceName];

        ipcMain.handle(`db:${serviceName}:list`, () => service.list());
        ipcMain.handle(`db:${serviceName}:create`, (_, data) => service.create(data));
        ipcMain.handle(`db:${serviceName}:update`, (_, id, data) => service.updateById(id, data));
        ipcMain.handle(`db:${serviceName}:delete`, (_, id) => service.deleteById(id));
    });

    const eventService = services[EventService.name] as EventService;
    ipcMain.handle(`db:${EventService.name}:listWithColor`, () => eventService.listWithColor());
};
