/* eslint-disable @typescript-eslint/no-empty-function */

import { RowCell } from '@antv/s2';
import dayjs from 'dayjs';
import { EVENT_GRAIN } from '@contracts/component';
import { useCalendarState } from '../../use-calendar-state';

/**
 * 时间行头
 */
export class TimeRowCell extends RowCell {
    // *重写获取单元格展示数值的方法，返回格式化时间
    getFieldValue(): string {
        const hour = Number(this.meta.value);
        if (isNaN(hour)) return '';
        const { state } = useCalendarState();
        const { format } = state.hour;
        return dayjs().hour(hour).minute(0).second(0).format(format);
    }

    // *重写文字绘制方法，修改文字位置
    drawTextShape(): void {
        const { key } = this.meta.query!;
        const { isFirstHour } = useCalendarState();

        // #不是时间行或者不是分段时间的不绘制文字
        if ([EVENT_GRAIN.DATE, EVENT_GRAIN.DATE_RANGE].includes(key) || !isFirstHour(Number(key))) return;

        super.drawTextShape();

        // #修改文字位置，使文字和边框对齐
        const { x } = this.getTextPosition();
        const { y } = this.meta;
        this.updateTextPosition({ x, y });
    }

    // *重写边框绘制方法，不再绘制边框
    drawBorders(): void {}
}
