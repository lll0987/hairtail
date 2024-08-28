import { ColCell, SpreadSheet } from '@antv/s2';
import { Text } from '@antv/g';
import dayjs from 'dayjs';
import { getSubTextStyle, getTextHeightBounds } from '../use-s2-col';
import type { HeaderCellUtil, TextHeightBoundsProps } from '../use-s2-col';

/**
 * 日期列头
 */
export class DateColCell extends ColCell implements HeaderCellUtil {
    // 实现工具接口
    getSpreadsheet(): SpreadSheet {
        return this.spreadsheet;
    }
    // 获取文字高度边界
    private getTextHeightBounds(props?: Partial<TextHeightBoundsProps>) {
        return getTextHeightBounds.call(this, {
            text: props?.text === undefined ? this.getFieldValue() : props.text,
            baseLine: props?.baseLine === undefined ? this.getTextPosition().y : props.baseLine,
            style: props?.style || this.getTextStyle()
        });
    }
    // 获取次级文字样式
    private getSubTextStyle() {
        return getSubTextStyle.call(this);
    }

    // *重写获取单元格展示数值的方法，返回两位日期
    getFieldValue(): string {
        const { value } = this.meta;
        return dayjs(value).format('DD');
    }

    // *重写文字绘制方法，增加星期简写
    drawTextShape(): void {
        super.drawTextShape();

        const { x } = this.getTextPosition();
        const { height, y } = this.meta;
        const { half } = this.getTextHeightBounds({ baseLine: y });

        const style = this.getSubTextStyle();
        const text = dayjs(this.meta.value).format('ddd');
        const { half: dhalf } = this.getTextHeightBounds({ text, style, baseLine: 0 });

        const space = (height - (half + dhalf) * 2) / 10;
        const ty = space * 4;
        const dy = ty + (half + space) * 2;

        this.updateTextPosition({ x, y: ty });
        this.appendChild(new Text({ style: { ...style, text, x, y: dy } }));
    }
}
