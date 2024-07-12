import { ipcMain } from 'electron';
import { services } from '../database';
import { sendAssistant } from './zhipu';
import { IEvent, IResponse } from '@t/interface';
import dayjs from 'dayjs';

const handleAutoInsert = async (text: string) => {
    const match = text.replaceAll(/\n/g, '').match(/\{(.+)\}/);
    const obj = (match && match[0] ? JSON.parse(match[0]) : {}) as IResponse;
    if (obj.status === 1) {
        // TODO 支出类型的活动增加支出方式
        // TODO 根据配置自动添加 tag
        if (obj.data.events) {
            const events = obj.data.events.map(item => {
                const start = dayjs(item.start).valueOf();
                const end = dayjs(item.end).valueOf();
                return { ...item, start, end };
            }) as IEvent[];
            // TODO 批量插入
            // await services.event.create(events);
            console.log(events);
        }
        if (obj.data.tags) {
            await services.tag.create(obj.data.tags);
        }
        if (obj.data.topics) {
            await services.topic.create(obj.data.topics);
        }
    }
    return {};
};

const handleInput = async (str: string) => {
    const text = await sendAssistant(str);
    // TODO 用户确认数据正确再插入
    const ids = await handleAutoInsert(text);
    return services.record.create({ in: str, out: text, ...ids });
};

export const handleTransformer = () => {
    ipcMain.handle(`handleInput`, (_, data) => handleInput(data));
};
