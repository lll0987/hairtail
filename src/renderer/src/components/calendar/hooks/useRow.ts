/**
 * 时间格式化设置
 */
export const FORMAT_TIME = 'HH:mm';

/**
 * 一天总小时数
 */
export const HOUR_LENGTH = 24;

/**
 * 每天从几点开始
 */
export const START_HOUR = 0;

/**
 * 每天到几点结束
 */
export const LATEST_HOUR = (START_HOUR || HOUR_LENGTH) - 1;

// 时间分段设置
const hour_count_arr = [24, 12, 6, 3];
// 时间段数量
let hour_count = hour_count_arr[0];

// 滚动条尺寸
const ScrollBarSize = 16;
// 列宽
const ColHeight = 80;
// 日期范围行行高
const DateRangeRowHeight = 30;
// 日期行行高
const DateRowHeight = 100;
// 每段时间最小高度
const MinRowHeight = 30;

/**
 * 计算行高列宽
 * @param height 总高度
 * @returns
 * - `ColHeight` 列宽
 * - `RowHeight` 行高
 * - `DateRowHeight` 日期行行高
 * - `DateRangeRowHeight` 日期范围行行高
 */
export const useHeight = (height: number) => {
    const DataHeight = height - ColHeight - DateRangeRowHeight - DateRowHeight - ScrollBarSize;
    const RowHeight = Math.floor(DataHeight / HOUR_LENGTH);

    hour_count = hour_count_arr.find(item => DataHeight > item * MinRowHeight) || hour_count_arr[0];

    return { ColHeight, RowHeight, DateRowHeight, DateRangeRowHeight };
};

/**
 * 是否为每段时间中的第一个小时
 * @param hour 小时
 * @returns
 */
export const isFirstHour = (hour: number) => !((hour * hour_count) % HOUR_LENGTH);

/**
 * 是否为每段时间中最后的小时
 * @param hour 小时
 * @returns
 */
export const isLastHour = (hour: number) => hour_count === HOUR_LENGTH || !isFirstHour(hour);
