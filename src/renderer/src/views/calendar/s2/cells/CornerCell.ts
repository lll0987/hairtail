import { CornerCell, SpreadSheet } from '@antv/s2';
import { Rect, Text } from '@antv/g';
import { getSubTextStyle, getTextHeightBounds } from '../use-s2-col';
import type { HeaderCellUtil, TextHeightBoundsProps } from '../use-s2-col';

/**
 * 自定义角头
 */
export class ShapeCornerCell extends CornerCell implements HeaderCellUtil {
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

    // 获取当前可见区域内第一列的月份和年份
    private getValue() {
        const { scrollX } = this.spreadsheet.facet.getScrollOffset();
        const width = this.spreadsheet.options.style?.colCell?.width as number;

        const index = Math.floor(scrollX / width);
        const colNode = this.spreadsheet.facet.getColNodeByIndex(index);

        const arr = colNode?.id.match(/(\d{4})-(\d{2})/);
        const month = (arr && arr[2]) || '';
        const year = (arr && arr[1]) || '';

        return { month, year };
    }

    // *重写获取单元格展示数值的方法，返回当前月份
    getFieldValue(): string {
        const { month } = this.getValue();
        return month;
    }

    // *重写文字绘制方法，增加年份
    drawTextShape(): void {
        super.drawTextShape();

        const { width, height, x, y } = this.meta;
        const padding = 6;
        const bgWidth = width - padding * 2;
        const left = x + padding;

        const { half, min } = this.getTextHeightBounds({ baseLine: 0 });
        const monthPadding = 8;
        const monthHeight = (half + monthPadding) * 2;

        const style = this.getSubTextStyle();
        const { year: text } = this.getValue();
        const { half: yhalf, min: ymin } = this.getTextHeightBounds({ text, style, baseLine: 0 });
        const yearPadding = 6;
        const yearHeight = (yhalf + yearPadding) * 2;

        const top = y + (height - yearHeight - monthHeight) / 2;

        const { fill, opacity } = this.getStyle().text;

        this.textShape?.attr('y', top + monthPadding - min);
        this.textShape?.attr('zIndex', 5);
        this.appendChild(
            new Rect({
                style: {
                    x: left,
                    y: top,
                    width: bgWidth,
                    height: monthHeight,
                    fill,
                    opacity,
                    radius: [4, 4, 0, 0],
                    zIndex: 1
                }
            })
        );

        const lineWidth = 2;
        const out = lineWidth / 2;
        const yearTop = top + monthHeight;
        this.appendChild(
            new Text({
                style: {
                    ...style,
                    text,
                    x: this.getTextPosition().x,
                    y: yearTop + yearPadding - ymin - out
                }
            })
        );
        this.appendChild(
            new Rect({
                style: {
                    x: left + out,
                    y: yearTop - out,
                    width: bgWidth - lineWidth,
                    height: yearHeight - out,
                    stroke: fill,
                    strokeOpacity: opacity,
                    lineWidth,
                    radius: [0, 0, 3, 3],
                    zIndex: 1
                }
            })
        );
    }
}
