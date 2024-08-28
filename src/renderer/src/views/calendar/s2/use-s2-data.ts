import dayjs from 'dayjs';
import type { IEventRawData } from '@contracts/interface';
import { EVENT_GRAIN, EventGrain } from '@contracts/component';
import { useCalendarState } from '../use-calendar-state';

// 日历数据结构
export interface IShapeData extends Omit<IEventRawData, 'start' | 'end'> {
    date_start: string;
    date_end?: string;
    date_length?: number;

    time_start?: number;
    time_end?: number;
    time_length?: number;

    key: string;
}

/**
 * 将【活动】数据按日期转换为日历数据
 * @param events EventRawData数组
 * @returns IShapeData数组
 */
const useEventToShape = (events: IEventRawData[]) => {
    const { state } = useCalendarState();
    const { format } = state.date;
    const { start: hstart } = state.hour;
    return events.reduce((result, { start, end, ...item }) => {
        // *全天活动
        if (item.grain === EVENT_GRAIN.DATE || item.grain === EVENT_GRAIN.DATE_RANGE) {
            result.push({
                ...item,
                key: item.grain,
                time_length: 0,
                date_start: dayjs(start).format(format),
                date_end: dayjs(end).format(format),
                date_length: dayjs(end).diff(start, 'day')
            });
            return result;
        }

        // *时间范围活动
        const end_value = dayjs(end).valueOf();
        let start_value = dayjs(start).valueOf();
        do {
            const s = dayjs(start_value).hour(hstart).minute(0).second(0).valueOf();
            const e = dayjs(start_value).add(1, 'day').hour(hstart).minute(0).second(0).valueOf();
            // 获取比开始时间晚的最早的时间
            let min = end_value;
            if (min > s && s > start_value) min = s;
            if (min > e && e > start_value) min = e;
            // 添加数据
            const hour = dayjs(start_value).hour();
            result.push({
                ...item,
                key: hour + '',
                date_start: dayjs(start_value).format(format),
                time_start: start_value,
                time_end: min,
                time_length: min - start_value
            });
            // 重新生成开始时间
            start_value = e;
        } while (start_value < end_value);
        return result;
    }, [] as IShapeData[]);
};

/**
 * 获取最小限度填充数据
 */
const getFillData = (date_start: string, key?: string, grain?: EventGrain): IShapeData => {
    key = key || '0';
    grain = grain || EVENT_GRAIN.TIME_RANGE;
    return { date_start, key, grain, time_length: 0, topic: '', color: 'transparent' };
};

/**
 * 填充数据，确保每一个小时单元格都可以显示
 * @param data IShapeData数组
 * @returns IShapeData数组
 */
const useCompleteData = (data: IShapeData[]) => {
    const { state } = useCalendarState();
    const { format, start: dstart, end: dend } = state.date;
    const { length: hlength } = state.hour;
    // 总天数
    const length = dayjs(dend).diff(dstart, 'day');
    // 结果数组
    const result = [...data];

    // *填充设置范围内的数据
    for (let d = 0; d < length; d++) {
        // 日期
        const day = dayjs(dstart).add(d, 'day');
        const date_start = day.format(format);
        // 是否有今天的数据
        const has_day = data.some(i => i.date_start === date_start);
        // #如果有这一天的数据，不进行填充
        if (d && has_day) continue;
        // 填充最小限度的数据
        if (!has_day) result.push(getFillData(date_start));
        // #只在第一天填充时间数据
        if (d) continue;
        // *按时间填充数据
        for (let h = 0; h < hlength; h++) {
            const key = h + '';
            const has_hour = data.some(i => i.date_start === date_start && i.key === key);
            // #如果这一天有这个小时的数据，不进行填充
            if (has_hour || (!h && !has_day)) continue;
            // 填充最小限度的数据
            result.push(getFillData(date_start, key));
        }
        // *填充全天数据为0点留出渲染空间
        result.push(getFillData(date_start, EVENT_GRAIN.DATE_RANGE, EVENT_GRAIN.DATE_RANGE));
    }

    return result;
};

/**
 * 将存储的活动数据转换为日历数据
 * @param events 【活动】数据
 * @returns 日历数据
 */
export const useS2Data = (events: IEventRawData[]) => {
    return useCompleteData(useEventToShape(events));
};
