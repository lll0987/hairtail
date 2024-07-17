/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable no-unsafe-optional-chaining */

import { Frame } from '@antv/s2';
import { Line } from '@antv/g';

/**
 * 自定义框架
 */
export class ShapeFrame extends Frame {
    layout(): void {
        super.layout();
        this.addTopAndBottomBorder();
    }

    // 增加顶部和底部边框
    private addTopAndBottomBorder() {
        const { spreadsheet } = this.cfg;
        const { horizontalBorderColor, horizontalBorderColorOpacity, horizontalBorderWidth } =
            spreadsheet.theme?.splitLine!;

        const { cornerWidth, cornerHeight, position, viewportWidth, viewportHeight } = this.cfg;

        const x1 = position.x;
        const x2 = x1 + cornerWidth + viewportWidth;
        const yt = horizontalBorderWidth / 2;
        const yb = position.y + cornerHeight + viewportHeight + yt;

        this.append(
            new Line({
                style: {
                    x1,
                    y1: yb,
                    x2,
                    y2: yb,
                    stroke: horizontalBorderColor,
                    lineWidth: horizontalBorderWidth,
                    opacity: horizontalBorderColorOpacity
                }
            }),
            new Line({
                style: {
                    x1,
                    y1: yt,
                    x2,
                    y2: yt,
                    stroke: horizontalBorderColor,
                    lineWidth: horizontalBorderWidth,
                    opacity: horizontalBorderColorOpacity
                }
            })
        );
    }
}
