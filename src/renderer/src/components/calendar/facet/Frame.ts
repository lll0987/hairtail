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
        this.addBottomBorder();
    }

    // 增加底部边框
    private addBottomBorder() {
        const { spreadsheet } = this.cfg;
        const { horizontalBorderColor, horizontalBorderColorOpacity, horizontalBorderWidth } =
            spreadsheet.theme?.splitLine!;

        const { cornerWidth, cornerHeight, position, viewportWidth, viewportHeight } = this.cfg;

        const x1 = position.x;
        const x2 = x1 + cornerWidth + viewportWidth;
        const y = position.y + cornerHeight + viewportHeight + horizontalBorderWidth / 2;

        this.appendChild(
            new Line({
                style: {
                    x1,
                    y1: y,
                    x2,
                    y2: y,
                    stroke: horizontalBorderColor,
                    lineWidth: horizontalBorderWidth,
                    opacity: horizontalBorderColorOpacity
                }
            })
        );
    }
}
