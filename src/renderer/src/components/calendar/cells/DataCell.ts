/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/ban-types */

import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';

import { DataCell, QueryDataType } from '@antv/s2';
import { Circle, Line, Rect } from '@antv/g';

import type { IShapeData } from '../hooks/useData';
import { isLastHour } from '../hooks/useRow';
import { LIME, SKY, YELLOW } from '../theme/colors';

import { DateTimeGrain } from '@t/enum';

export class ShapeDataCell extends DataCell {
    // 获取当前单元格的数据
    private getCellData() {
        const data = this.meta.data as unknown as { raw: IShapeData } | undefined;
        return data?.raw;
    }

    // 获取当前列的数据
    private getCollData() {
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
    private getValueRange() {
        const coefficient = 5;

        const data = this.getCellData()!;
        const values = this.spreadsheet.dataSet.originData.reduce((r, i) => {
            if (i.grain === data.grain) {
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
    private getValueSize(maxSize: number, minSize?: number, value?: number) {
        // 默认使用本单元格数据
        if (value === undefined) value = this.getCellData()?.value ?? 0;
        // 尺寸
        minSize = minSize || 0;
        const size = maxSize - minSize;
        // 数据范围
        const { max, min } = this.getValueRange();

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

    // TODO 获取颜色
    private getShapeColor() {
        const data = this.getCellData();
        if (!data) return this.getTextStyle().fill;
        const colorMap: Record<DateTimeGrain, string> = {
            [DateTimeGrain.DATE]: YELLOW,
            [DateTimeGrain.DATE_RANGE]: SKY,
            [DateTimeGrain.TIME]: SKY,
            [DateTimeGrain.TIME_RANGE]: LIME
        };
        return colorMap[data.grain];
    }

    // *重写单元格绘制方法
    protected initCell(): void {
        const data = this.getCellData();
        if (data) {
            const drawShapeMap: Record<DateTimeGrain, Function> = {
                [DateTimeGrain.DATE]: this.drawDateShape,
                [DateTimeGrain.DATE_RANGE]: this.drawDateRangeShape,
                [DateTimeGrain.TIME]: this.drawTimeShape,
                [DateTimeGrain.TIME_RANGE]: this.drawTimeRangeShape
            };
            drawShapeMap[data.grain].call(this);
        }
        this.drawBorders();
        this.update();
    }

    // 获取时间散点图的样式
    private getTimeShapeStyle() {
        const lineWidth = 2;
        const maxR = this.meta.height / 2;
        const minR = lineWidth * 2;

        return {
            fill: this.getShapeColor(),
            stroke: this.getTextStyle().fill,
            r: this.getValueSize(maxR, minR),
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

        this.appendChild(new Rect({ style: { ...style, x, y, width, height } }));
    }

    // 根据数值获取高度
    private getValueHeight(value?: number) {
        const { height } = this.meta;
        const { r, lineWidth } = this.getDateShapePointStyle();

        const size = this.getValueSize(height - r * 2 - lineWidth, 0, value);
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

        this.appendChild(new Rect({ style: { x, y, width, height, ...style } }));
    }

    // 是否为全天单元格
    private isAllDayCell() {
        const { key } = this.meta.rowQuery!;
        return [DateTimeGrain.DATE_RANGE, DateTimeGrain.DATE].includes(key);
    }

    // 是否为空闲时间
    private isFreeTime() {
        // 1.全天数据 -> 空闲
        if (this.isAllDayCell()) return true;
        // 2.当前小时有数据 -> 忙碌
        const cellData = this.getCellData();
        if (cellData && cellData.time_end) return false;
        // 当前列全部数据
        const data = this.getCollData();
        // 3.当前列没有时间范围数据 -> 空闲
        if (data.every(item => !item.time_end)) return true;
        // 4.有在当前小时或以后结束的数据 -> 忙碌
        const hour = Number(this.meta.rowQuery?.key);
        return !data.some(
            item => item.time_end && Number(item.key) <= hour && dayjs(item.time_end).hour() >= hour
        );
    }

    // 是否不能占满当前单元格
    private isShorterShape() {
        if (this.isAllDayCell()) return true;
        const hour = Number(this.meta.rowQuery?.key);
        return this.getCollData().some(
            item => item.time_end && dayjs(item.time_end).hour() === hour
        );
    }

    // 是否为最后的节点
    private isLastNode() {
        if (this.isAllDayCell()) return true;
        return isLastHour(Number(this.meta.rowQuery?.key));
    }

    // *重写边框绘制方法
    drawBorders(): void {
        if (
            this.meta.rowQuery?.key === DateTimeGrain.DATE_RANGE ||
            !this.isLastNode() ||
            (!this.isFreeTime() && !this.isShorterShape())
        )
            return;

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
}
