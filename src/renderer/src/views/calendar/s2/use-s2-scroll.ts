import { PivotSheet } from '@antv/s2';
import dayjs from 'dayjs';
import { useCalendarState } from '../use-calendar-state';

const dateHandler = {
    today: () => {
        const { state } = useCalendarState();
        return dayjs().day(6).subtract(state.date.count, 'day').format(state.date.format);
    }
} as const;
export type DateShortcut = keyof typeof dateHandler;

const getColId = (date: DateShortcut | string): string => {
    const handler = dateHandler[date] as (typeof dateHandler)[DateShortcut] | undefined;
    const col = handler ? handler() : date;
    return `root[&]${col}[&]time_length`;
};

export const useS2Scroll = (s2: PivotSheet, date: DateShortcut | string): void => {
    const colNode = s2.facet.getColNodeById(getColId(date));
    if (!colNode) return;
    s2.facet.updateScrollOffset({ offsetX: { value: colNode.x, animate: true } });
};
