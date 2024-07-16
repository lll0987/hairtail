import dayjs from 'dayjs';
import { BrowserWindow, ipcMain } from 'electron';

import { services } from '../database';
import { getFormattedText } from './zhipu';
import { IEvent, IResponse, RecordModel } from '@t/interface';
import { MsgType, ObjectId, ResType } from '@t/types';

// NEXT 渲染进程和主进程统一设置字典的方式
enum RecordStatus {
    SEND,
    WAITING,
    ACCEPT,
    IGNORE,
    NONE
}

/**
 * 获取 ai 处理结果对象
 * @param out
 * @returns
 */
const getResponseObject = (out: string) => {
    // NEXT 提取 json 对象的方法的健壮性检验
    const match = out.replaceAll(/\n/g, '').match(/\{(.+)\}/);
    const obj = (match && match[0] ? JSON.parse(match[0]) : {}) as IResponse;
    return obj;
};

/**
 * 根据 ai 处理结果自动创建数据
 * @param out
 * @returns
 */
const handleAutoInsert = async (out: string) => {
    const obj = getResponseObject(out);

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
const handleCache = async (text: string, window: BrowserWindow): Promise<MsgType | null> => {
    // 添加记录
    const [msg, id] = (await services.record.create({
        in: text,
        out: 'waiting...',
        status: RecordStatus.SEND
    })) as ResType<ObjectId>;
    id && window.webContents.send('insert-record-success');
    if (!id) return msg;

    // 获取 ai 处理结果，等待下一步操作
    const [message, result] = await getFormattedText(text);
    if (message) return message;

    // 记录处理结果，更新状态
    const obj = getResponseObject(result!);
    const out = obj.status === 1 ? result : '无法转化为某种数据结构';
    const status = obj.status === 1 ? RecordStatus.WAITING : RecordStatus.NONE;
    const [m] = await services.record.updateById(id.toString(), { out, status });
    if (m) return m;

    return null;
};

/**
 * 接受 ai 处理结果
 * @param id
 * @returns
 */
const handleAccept = async (id: string): Promise<MsgType | null> => {
    const [m, { status, out }] = await services.record.findById(id);
    if (m) return m;
    if (status !== RecordStatus.WAITING) return '当前结果不可执行接受操作';

    // 添加处理后的数据
    const { record, messages } = await handleAutoInsert(out);
    if (messages.length) return messages.join('，');

    // 记录自动创建的数据 id，更新状态
    const [msg] = await services.record.updateById(id, { ...record, status: RecordStatus.ACCEPT });
    if (msg) return msg;

    return null;
};

/**
 * 忽略 ai 处理结果
 * @param str
 * @returns
 */
const handleIgnore = async (id: string): Promise<MsgType | null> => {
    const [m, { status }] = await services.record.findById(id);
    if (m) return m;
    if (status !== RecordStatus.WAITING) return '当前结果不可执行忽略操作';

    // 更新状态
    const [msg] = await services.record.updateById(id, { status: RecordStatus.IGNORE });
    if (msg) return msg;

    return null;
};

/**
 * 向渲染进程暴露方法
 * @param window
 */
export const handleTransformer = (window: BrowserWindow) => {
    ipcMain.handle(`handleInput`, (_, data) => handleCache(data, window));
    ipcMain.handle(`handleAccept`, (_, data) => handleAccept(data));
    ipcMain.handle(`handleIgnore`, (_, data) => handleIgnore(data));
};
