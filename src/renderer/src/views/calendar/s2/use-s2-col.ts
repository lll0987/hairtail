/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { HeaderCell, SpreadSheet, type TextTheme } from '@antv/s2';
import type { TextStyleProps } from '@antv/g';

/**
 * 列头/角头工具
 */
export interface HeaderCellUtil {
    getSpreadsheet(): SpreadSheet;
}

/**
 * 文字高度边界选项
 */
export interface TextHeightBoundsProps {
    baseLine: number;
    text: string | number;
    style: TextTheme;
}

/**
 * 获取文字高度边界
 * @param this 上下文
 * @param props 选项
 * @returns 坐标基于`baseLine`计算
 * - `half` 总高度的一半
 * - `center` 中心坐标
 * - `min` 最小坐标
 * - `max` 最大坐标
 -------------------------
 *  ————————   <- min
 * |        |
 * |  text  |  <- half
 * |        |  <- center
 *  ————————   <- max
 */
export function getTextHeightBounds(this: HeaderCellUtil, props: TextHeightBoundsProps) {
    const { baseLine, style, text } = props;
    const spreadsheet = this.getSpreadsheet();
    const { fontSize, fontFamily, fontWeight, textBaseline } = style;

    const ctx = spreadsheet.getCanvasElement()?.getContext('2d')!;
    ctx.textBaseline = textBaseline || 'middle';
    ctx.font = ['normal', 'normal', fontWeight, `${fontSize}px`, fontFamily].join(' ').trim();
    const textMetrics = ctx.measureText(String(text));

    const actualBoundingBoxAscent = textMetrics?.actualBoundingBoxAscent ?? 0;
    const actualBoundingBoxDescent = textMetrics?.actualBoundingBoxDescent ?? 0;

    const center = baseLine + (actualBoundingBoxDescent - actualBoundingBoxAscent) / 2;
    const half = (actualBoundingBoxAscent + actualBoundingBoxDescent) / 2;
    const min = baseLine - actualBoundingBoxAscent;
    const max = baseLine + actualBoundingBoxDescent;

    return { center, half, min, max };
}

/**
 * 获取次级文字样式
 * @param this 上下文
 * @returns
 */
export function getSubTextStyle(
    this: HeaderCell
): TextTheme & Pick<TextStyleProps, 'wordWrapWidth' | 'lineWidth'> {
    const { measureText, text } = this.getStyle();
    return {
        ...measureText,
        fontFamily: measureText.fontFamily || text.fontFamily,
        fontVariant: 'normal',
        fontStyle: 'normal',
        wordWrapWidth: this.getMaxTextWidth() || 0,
        lineWidth: 1
    };
}
