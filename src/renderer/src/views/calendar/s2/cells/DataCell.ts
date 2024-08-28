/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/ban-types */

import { DataCell, QueryDataType } from '@antv/s2';
import { Circle, Line, Rect } from '@antv/g';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import { EVENT_GRAIN, EventGrain } from '@contracts/component';
import type { IShapeData } from '../use-s2-data';
import { useCalendarState } from '../../use-calendar-state';

export class ShapeDataCell extends DataCell {
    // 获取当前单元格的数据
    private getCellData() {
        const data = this.meta.data as unknown as { raw: IShapeData } | undefined;
        return data?.raw;
    }

    // 获取当前列的数据
    private getColData() {
        const data = this.spreadsheet.dataSet.getCellMultiData({
            query: this.meta.colQuery,
            queryType: QueryDataType.DetailOnly
        }) as unknown as { raw: IShapeData }[];
        return data.map(i => i.raw);
    }

    // 获取当前行的数据
    private getRowData() {
        const data = this.spreadsheet.dataSet.getCellMultiData({
            query: this.meta.rowQuery,
            queryType: QueryDataType.DetailOnly
        }) as unknown as { raw: IShapeData }[];
        return data.map(i => i.raw);
    }

    // 获取当前行前一个单元格的数据
    private getRowLastCellData() {
        // 获取全部数据
        const data = this.getRowData();
        // 今天以前的数据
        const { date_start } = this.getCellData()!;
        const last = data.reduce(
            (prev, item) => {
                const length = dayjs(date_start).diff(item.date_start, 'day');
                if (length > 0 && (!prev.length || length < prev.length)) {
                    prev.length = length;
                    prev.value = item.value || 0;
                }
                return prev;
            },
            { length: 0, value: 0 }
        );
        return last;
    }

    // 获取数值范围
    private getRangeFromValue() {
        const coefficient = 5;

        const data = this.getCellData()!;
        const values = this.spreadsheet.dataSet.originData.reduce((r, i) => {
            if (i.topic === data.topic) {
                const value = (i.value as number | undefined) || 0;
                r.add(value);
            }
            return r;
        }, new Set<number>());

        return {
            max: Math.ceil(Math.max(...values) / coefficient) * coefficient,
            min: Math.floor(Math.min(...values) / coefficient) * coefficient
        };
    }

    // 根据数值获取尺寸
    private getSizeFromValue(maxSize: number, minSize?: number, value?: number) {
        // 默认使用本单元格数据
        if (value === undefined) value = this.getCellData()?.value ?? 0;
        // 尺寸
        minSize = minSize || 0;
        const size = maxSize - minSize;
        // 数据范围
        const { max, min } = this.getRangeFromValue();

        return new BigNumber(size)
            .times(value - min)
            .div(max - min)
            .plus(minSize)
            .toNumber();
    }

    // 根据时间长度获取高度
    private getTimeRangeHeight(value: number, unit?: 'm' | 's' | 'ms') {
        unit = unit || 'ms';
        let v = new BigNumber(value).div(60);
        if (unit !== 'm') v = v.div(60);
        if (unit === 'ms') v = v.div(1000);
        const { height } = this.meta;
        return v.times(height).toNumber();
    }

    // 获取当前单元格中心坐标
    private getCellCenterPosition() {
        const { width, height, x, y } = this.meta;
        const cx = new BigNumber(width).div(2).toNumber();
        const cy = new BigNumber(height).div(2).toNumber();
        return { x: x + cx, y: y + cy };
    }

    // 获取颜色
    private getShapeColor() {
        const data = this.getCellData();
        if (!data) return this.getTextStyle().fill;
        return data.color;
    }

    // *重写单元格绘制方法
    protected initCell(): void {
        const data = this.getCellData();
        if (data) {
            const handlers: Record<EventGrain, Function> = {
                [EVENT_GRAIN.DATE]: this.drawDateShape,
                [EVENT_GRAIN.DATE_RANGE]: this.drawDateRangeShape,
                [EVENT_GRAIN.TIME]: this.drawTimeShape,
                [EVENT_GRAIN.TIME_RANGE]: this.drawTimeRangeShape
            };
            handlers[data.grain].call(this);
        }
        this.drawBorders();
        this.update();
    }

    // 获取时间散点图的样式
    private getTimeShapeStyle() {
        const lineWidth = 2;
        const size = Math.min(this.meta.width, this.meta.height);
        // NEXT 日历散点图最大最小值设置
        const { state } = useCalendarState();
        const maxR = (size / 2) * state.hour.span;
        const minR = lineWidth * 2;

        return {
            fill: this.getShapeColor(),
            stroke: this.getTextStyle().fill,
            r: this.getSizeFromValue(maxR, minR),
            lineWidth,
            zIndex: 40
        };
    }

    // *绘制时间散点图
    drawTimeShape() {
        const { time_start } = this.getCellData()!;
        const { y } = this.meta;
        const cy = this.getTimeRangeHeight(dayjs(time_start).minute(), 'm') + y;

        const { x: cx } = this.getCellCenterPosition();

        const style = this.getTimeShapeStyle();

        this.appendChild(new Circle({ style: { ...style, cx, cy } }));
    }

    // 获取时间范围柱状图的样式
    private getTimeRangeShapeStyle() {
        return {
            fill: this.getShapeColor(),
            stroke: this.getTextStyle().fill,
            lineWidth: 2,
            radius: 4,
            zIndex: 30
        };
    }

    // *绘制时间范围柱状图
    drawTimeRangeShape() {
        const { time_start, time_length } = this.getCellData()!;
        if (!time_length) return;

        const style = this.getTimeRangeShapeStyle();

        const h0 = this.getTimeRangeHeight(time_length);
        if (h0 < style.lineWidth * 4) return;

        const { width: w, x: x0, y: y0 } = this.meta;
        const half = style.lineWidth / 2;

        const px = 4;
        const pt = this.getTimeRangeHeight(dayjs(time_start).minute(), 'm');

        const x = x0 + px + half;
        const y = y0 + pt + half;

        const width = w - px * 2 - style.lineWidth;
        const height = h0 - style.lineWidth;

        // NEXT 日历时间范围重叠时缩小宽度
        this.appendChild(new Rect({ style: { ...style, x, y, width, height } }));
    }

    // 根据数值获取高度
    private getValueHeight(value?: number) {
        const { height } = this.meta;
        const { r, lineWidth } = this.getDateShapePointStyle();

        const size = this.getSizeFromValue(height - r * 2 - lineWidth, 0, value);
        return height - size - r - lineWidth / 2;
    }

    // 获取日期折线图顶点的样式
    private getDateShapePointStyle() {
        const { fill } = this.getTextStyle();
        return { fill, stroke: this.getShapeColor(), lineWidth: 2, zIndex: 20, r: 5 };
    }

    // 获取日期折线图连接线的样式
    private getDateShapeLineStyle() {
        return { stroke: this.getShapeColor(), lineWidth: 4, zIndex: 10 };
    }

    // *绘制日期折线图
    drawDateShape() {
        const pointStyle = this.getDateShapePointStyle();
        const { y } = this.meta;

        const { x: cx } = this.getCellCenterPosition();
        const cy = this.getValueHeight() + y;

        // 绘制顶点
        this.appendChild(new Circle({ style: { cx, cy, ...pointStyle } }));

        // 绘制连接线
        const last = this.getRowLastCellData();
        if (!last.length || last.length > 10) return;

        const lineStyle = this.getDateShapeLineStyle();
        const { width } = this.meta;

        const x1 = cx - width * last.length;
        const y1 = this.getValueHeight(last.value) + y;

        this.append(
            new Line({
                style: { x1, y1, x2: cx, y2: cy, ...lineStyle, lineDash: last.length > 1 ? 5 : '' }
            }),
            new Circle({ style: { cx: x1, cy: y1, ...pointStyle } })
        );
    }

    // 获取日期范围柱状图的样式
    private getDateRangeShapeStyle() {
        return {
            fill: this.getShapeColor(),
            stroke: this.getTextStyle().fill,
            lineWidth: 2,
            radius: 2,
            zIndex: 10
        };
    }

    // *绘制日期范围柱状图
    drawDateRangeShape() {
        const { date_length } = this.getCellData()!;
        if (date_length === undefined) return;

        const style = this.getDateRangeShapeStyle();
        const { width: w, height: h, x: x0, y: y0 } = this.meta;

        const half = style.lineWidth / 2;

        const py = 6;

        const x = x0 + half;
        const y = y0 + py + half;
        const width = w * date_length - style.lineWidth;
        const height = h - py * 2 - style.lineWidth;

        // NEXT 按可显示的列数拆分渲染
        this.appendChild(new Rect({ style: { x, y, width, height, ...style } }));
    }

    // 是否需要绘制边框
    private isBorder() {
        const { key } = this.meta.rowQuery!;

        // 1.全天数据 -> 不绘制边框
        if ([EVENT_GRAIN.DATE_RANGE, EVENT_GRAIN.DATE].includes(key)) return false;

        const hour = Number(key);
        // 2.不是最后的节点 -> 不绘制边框
        const { isLastHour } = useCalendarState();
        if (!isLastHour(hour)) return false;

        // 3.当前小时有数据 & 能占满当前单元格 -> 不绘制边框
        const cellData = this.getCellData();
        if (cellData && cellData.time_end && dayjs(cellData.time_end).hour() > hour) return false;

        const colData = this.getColData().filter(item => item.time_end);
        // 4.当前列没有时间范围数据 -> 绘制边框
        if (colData.length < 1) return true;
        // 5.有在当前小时以后结束的数据 -> 不绘制边框
        if (
            colData.some(item => {
                const k = Number(item.key);
                let h = dayjs(item.time_end).hour();
                if (k > 0 && h === 0) h = 24;
                return k <= hour && h > hour;
            })
        )
            return false;

        return true;
    }

    // *重写边框绘制方法
    drawBorders(): void {
        const { x, y, width, height } = this.meta;
        const {
            horizontalBorderWidth = 0,
            horizontalBorderColorOpacity,
            horizontalBorderColor,
            borderDash
        } = this.theme?.rowCell?.cell! || {};

        const x1 = x;
        const x2 = x1 + width;
        const y1 = y + height - horizontalBorderWidth / 2;

        if (this.isBorder()) {
            this.appendChild(
                new Line({
                    style: {
                        x1,
                        y1,
                        x2,
                        y2: y1,
                        lineWidth: horizontalBorderWidth,
                        stroke: horizontalBorderColor,
                        strokeOpacity: horizontalBorderColorOpacity,
                        lineDash: borderDash,
                        zIndex: 0
                    }
                })
            );
        }

        const { state } = useCalendarState();
        if (state.hour.start === Number(this.meta.rowQuery?.key)) {
            const _y = y1 - height;
            this.appendChild(
                new Line({
                    style: {
                        x1,
                        y1: _y,
                        x2,
                        y2: _y,
                        lineWidth: horizontalBorderWidth,
                        stroke: horizontalBorderColor,
                        strokeOpacity: horizontalBorderColorOpacity,
                        lineDash: borderDash,
                        zIndex: 0
                    }
                })
            );
        }
    }
}
