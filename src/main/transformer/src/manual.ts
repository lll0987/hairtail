import dayjs from 'dayjs';
import { BrowserWindow } from 'electron';
import { IResponse, IRecordModel } from '@contracts/interface';
import { TRecordStatus } from '@contracts/type';
import { services } from '../../database';
import { getFormattedText } from './zhipu';

const RECORD_STATUS: TRecordStatus = {
    SEND: 0,
    WAITING: 1,
    ACCEPT: 2,
    IGNORE: 3,
    NONE: 4,
    ERROR: 5
} as const;

/**
 * 获取 ai 处理结果对象
 * @param out
 * @returns
 */
const getResponseObject = (out: string) => {
    // PERF 优化提取 json 对象的方法，增加健壮性
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

    const record: Omit<IRecordModel, 'in' | 'out' | 'status'> = {};
    const messages: string[] = [];

    if (obj.status === 1) {
        if (obj.data.events) {
            const events = obj.data.events.map(({ start, end, grain, ...item }) => ({
                ...item,
                grain: Number(grain),
                start: dayjs(start).valueOf(),
                end: dayjs(end).valueOf()
            }));
            const [msg, ids] = await services.event.create(events);
            if (msg) messages.push(`event 自动创建失败：${msg}`);
            if (ids && ids.length) record.event = ids;
        }
        if (obj.data.tags) {
            const [msg, ids] = await services.tag.create(obj.data.tags);
            if (msg) messages.push(`tag 自动创建失败：${msg}`);
            if (ids && ids.length) record.tag = ids;
        }
        if (obj.data.topics) {
            const [msg, ids] = await services.topic.create(obj.data.topics);
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
export const handleCache = async (text: string, window: BrowserWindow): Promise<string | null> => {
    // 添加记录
    const [msg, id] = await services.record.create({
        in: text,
        out: 'waiting...',
        status: RECORD_STATUS.SEND
    });
    id && window.webContents.send('insert-record-success');
    if (!id) return msg;

    // 获取 ai 处理结果，等待下一步操作
    const [message, result] = await getFormattedText(text);
    if (message) {
        const [m] = await services.record.updateById(id.toString(), {
            out: '转换出错了',
            status: RECORD_STATUS.ERROR
        });
        return message + (m ? `，${m}` : '');
    }

    // 记录处理结果，更新状态
    const obj = getResponseObject(result!);
    const out = obj.status === 1 ? result! : '无法转化为某种数据';
    const status = obj.status === 1 ? RECORD_STATUS.WAITING : RECORD_STATUS.NONE;
    const [m] = await services.record.updateById(id.toString(), { out, status });
    if (m) return m;

    return null;
};

/**
 * 接受 ai 处理结果
 * @param id
 * @returns
 */
export const handleAccept = async (id: string): Promise<string | null> => {
    const [m, d] = await services.record.findById(id);
    if (m) return m;
    const { out, status } = d!;
    if (status !== RECORD_STATUS.WAITING) return '当前结果不可执行接受操作';

    // 添加处理后的数据
    const { record, messages } = await handleAutoInsert(out);
    if (messages.length) return messages.join('，');

    // 记录自动创建的数据 id，更新状态
    const [msg] = await services.record.updateById(id, { ...record, status: RECORD_STATUS.ACCEPT });
    if (msg) return msg;

    return null;
};

/**
 * 忽略 ai 处理结果
 * @param str
 * @returns
 */
export const handleIgnore = async (id: string): Promise<string | null> => {
    const [m, d] = await services.record.findById(id);
    if (m) return m;
    const { status } = d!;
    if (status !== RECORD_STATUS.WAITING) return '当前结果不可执行忽略操作';

    // 更新状态
    const [msg] = await services.record.updateById(id, { status: RECORD_STATUS.IGNORE });
    if (msg) return msg;

    return null;
};
