import dayjs from 'dayjs';
import { BrowserWindow, ipcMain } from 'electron';

import { services } from '../database';
import { sendAssistant } from './zhipu';
import { IEvent, IResponse, RecordModel } from '@t/interface';
import { ObjectId, ResType } from '@t/types';

enum RecordStatus {
    INIT,
    WAITING,
    FINISH
}

/**
 * 根据 ai 处理结果自动创建数据
 * @param out
 * @returns
 */
const handleAutoInsert = async (out: string) => {
    const match = out.replaceAll(/\n/g, '').match(/\{(.+)\}/);
    const obj = (match && match[0] ? JSON.parse(match[0]) : {}) as IResponse;

    const record: Omit<RecordModel, 'in' | 'out' | 'status'> = {};
    const messages: string[] = [];

    if (obj.status === 1) {
        // TODO 支出类型的活动增加支出方式
        // TODO 根据配置自动添加 tag
        if (obj.data.events) {
            const events = obj.data.events.map(({ start, end, ...item }) => ({
                ...item,
                start: dayjs(start).valueOf(),
                end: dayjs(end).valueOf()
            })) as IEvent[];
            const [msg, ids] = (await services.event.create(events)) as ResType<ObjectId[]>;
            if (msg) messages.push(`event 自动创建失败：${msg}`);
            if (ids && ids.length) record.event = ids;
        }
        if (obj.data.tags) {
            const [msg, ids] = (await services.tag.create(obj.data.tags)) as ResType<ObjectId[]>;
            if (msg) messages.push(`tag 自动创建失败：${msg}`);
            if (ids && ids.length) record.tag = ids;
        }
        if (obj.data.topics) {
            const [msg, ids] = (await services.topic.create(obj.data.topics)) as ResType<ObjectId[]>;
            if (msg) messages.push(`topic 自动创建失败：${msg}`);
            if (ids && ids.length) record.topic = ids;
        }
    }

    return { record, messages };
};

/**
 * 暂存输入的文本
 * @param text 输入的文本
 * @param callback 清空输入框
 * @returns
 */
const handleCache = async (text: string, window: BrowserWindow) => {
    // 1.添加记录
    const [, id] = (await services.record.create({
        in: text,
        out: 'waiting...',
        status: RecordStatus.INIT
    })) as ResType<ObjectId>;
    id && window.webContents.send('insert-record-success');
    if (!id) return false;
    // 2.获取 ai 处理结果，等待下一步操作
    const result = await sendAssistant(text);
    await services.record.updateById(id.toString(), { out: result, status: RecordStatus.WAITING });

    return true;
};

/**
 * 3.接受 ai 处理结果
 * @param id
 * @returns
 */
const handleAccept = async (id: string) => {
    const [, { status, out }] = await services.record.findById(id);
    if (status !== RecordStatus.WAITING) return false;

    // 添加处理后的数据
    const { record } = await handleAutoInsert(out);
    // 更新记录
    await services.record.updateById(id, { ...record, status: RecordStatus.FINISH });

    return true;
};

/**
 * 4.忽略 ai 处理结果
 * @param str
 * @returns
 */
const handleIgnore = async (id: string) => {
    const [, { status }] = await services.record.findById(id);
    if (status !== RecordStatus.WAITING) return false;
    // 更新记录
    await services.record.updateById(id, { status: RecordStatus.FINISH });
    return true;
};

export const handleTransformer = (window: BrowserWindow) => {
    ipcMain.handle(`handleInput`, (_, data) => handleCache(data, window));
    ipcMain.handle(`handleAccept`, (_, data) => handleAccept(data));
    ipcMain.handle(`handleIgnore`, (_, data) => handleIgnore(data));
};
