import dayjs from 'dayjs';

import { DateTimeGrain } from '@t/enum';
import { IEvent } from '@t/interface';

import { HOUR_LENGTH, START_HOUR } from './useRow';
import { END_DATE, FORMAT_DATE, START_DATE } from './useCol';

// 日历数据结构
export interface IShapeData extends Omit<IEvent, 'start' | 'end' | 'topic'> {
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
 * @param events IEvent数组
 * @returns IShapeData数组
 */
const useEventToShape = (events: IEvent[]) => {
    return events.reduce((result, { start, end, ...item }) => {
        // *全天活动
        if ([DateTimeGrain.DATE, DateTimeGrain.DATE_RANGE].includes(item.grain)) {
            result.push({
                ...item,
                key: item.grain,
                time_length: 0,
                date_start: dayjs(start).format(FORMAT_DATE),
                date_end: dayjs(end).format(FORMAT_DATE),
                date_length: dayjs(end).diff(start, 'day')
            });
            return result;
        }

        // *时间范围活动
        const end_value = dayjs(end).valueOf();
        let start_value = dayjs(start).valueOf();
        do {
            const s = dayjs(start_value).hour(START_HOUR).minute(0).second(0).valueOf();
            const e = dayjs(start_value).add(1, 'day').hour(START_HOUR).minute(0).second(0).valueOf();
            // 获取比开始时间晚的最早的时间
            let min = end_value;
            if (min > s && s > start_value) min = s;
            if (min > e && e > start_value) min = e;
            // 添加数据
            const hour = dayjs(start_value).hour();
            result.push({
                ...item,
                key: hour + '',
                date_start: dayjs(start_value).format(FORMAT_DATE),
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
 * 填充数据，确保每一个小时单元格都可以显示
 * @param data IShapeData数组
 * @returns IShapeData数组
 */
const useCompleteData = (data: IShapeData[]) => {
    // 总天数
    const length = dayjs(END_DATE).diff(START_DATE, 'day');
    // 结果数组
    const result = [...data];

    // *填充设置范围内的数据
    for (let d = 0; d < length; d++) {
        // 日期
        const day = dayjs(START_DATE).add(d, 'day');
        const date_start = day.format(FORMAT_DATE);
        // 是否有今天的数据
        const has_day = data.some(i => i.date_start === date_start);
        // #如果有这一天的数据，不进行填充
        if (d && has_day) continue;
        // 填充最小限度的数据
        if (!has_day) result.push({ key: '0', date_start, time_length: 0, grain: DateTimeGrain.TIME_RANGE });
        // #只在第一天填充时间数据
        if (d) continue;
        // *按时间填充数据
        for (let h = 0; h < HOUR_LENGTH; h++) {
            const key = h + '';
            const has_hour = data.some(i => i.date_start === date_start && i.key === key);
            // #如果这一天有这个小时的数据，不进行填充
            if (has_hour || (!h && !has_day)) continue;
            // 填充最小限度的数据
            result.push({ key, date_start, time_length: 0, grain: DateTimeGrain.TIME_RANGE });
        }
    }

    return result;
};

/**
 * 将存储的活动数据转换为日历数据
 * @param events 【活动】数据
 * @returns 日历数据
 */
export const useData = (events: IEvent[]) => {
    return useCompleteData(useEventToShape(events));
};
