import { PivotSheet } from '@antv/s2';

import dayjs from 'dayjs';

import { FORMAT_DATE } from './useCol';

export enum SHORTCUT {
    TODAY
}

const getColId = (date: SHORTCUT | string) => {
    let col = date;
    if (date === SHORTCUT.TODAY) col = dayjs().format(FORMAT_DATE);
    return `root[&]${col}[&]time_length`;
};

export const useScroll = (s2: PivotSheet, date: SHORTCUT | string) => {
    const colNode = s2.facet.getColNodeById(getColId(date));
    if (!colNode) return;
    s2.updateScrollOffset({ offsetX: { value: colNode.x, animate: true } });
};
