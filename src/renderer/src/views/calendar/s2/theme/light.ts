import type { S2Theme, InteractionState } from '@antv/s2';
import { colors } from '@contracts/component';

const light = colors.slate[100];
const dark = colors.slate[950];
const dark2 = colors.slate[800];

const hasBorderCell = {
    // 水平边框
    horizontalBorderColor: dark,
    horizontalBorderColorOpacity: 1,
    horizontalBorderWidth: 1,
    // 垂直边框
    verticalBorderColor: dark,
    verticalBorderColorOpacity: 0,
    verticalBorderWidth: 0,
    // 边框设置为虚线
    borderDash: [6, 4],
    // 背景透明
    backgroundColorOpacity: 0
};

const noBorderCell = {
    // 水平无边框
    horizontalBorderColorOpacity: 0,
    horizontalBorderWidth: 0,
    // 垂直无边框
    verticalBorderColorOpacity: 0,
    verticalBorderWidth: 0,
    // 背景透明
    backgroundColorOpacity: 0
};

// NEXT 交互态样式
const interactionState: InteractionState = {
    hover: { backgroundOpacity: 0 },
    hoverFocus: { backgroundOpacity: 0 },
    selected: { backgroundOpacity: 0 }
};

export const LightTheme: S2Theme = {
    background: { color: colors.transparent },
    splitLine: {
        // 水平有边框
        horizontalBorderColor: dark,
        horizontalBorderColorOpacity: 1,
        horizontalBorderWidth: 1,
        // 垂直无边框
        verticalBorderColor: dark,
        verticalBorderColorOpacity: 0,
        verticalBorderWidth: 0,
        // 显示阴影
        showShadow: true
    },
    dataCell: {
        cell: noBorderCell,
        text: { fill: dark },
        bolderText: { fill: dark }
    },
    rowCell: {
        cell: { ...hasBorderCell, interactionState },
        text: { fill: dark, textBaseline: 'middle', textAlign: 'center' },
        bolderText: { fill: dark, textBaseline: 'middle', textAlign: 'center' }
    },
    colCell: {
        cell: { ...noBorderCell, interactionState },
        text: { fill: dark },
        bolderText: { fill: dark, fontSize: 20, textBaseline: 'top', textAlign: 'center' },
        measureText: {
            fill: dark2,
            fontSize: 12,
            textBaseline: 'top',
            textAlign: 'center',
            fontWeight: 'normal'
        }
    },
    cornerCell: {
        cell: noBorderCell,
        text: { fill: dark, fontSize: 32, textBaseline: 'middle', textAlign: 'center' },
        bolderText: { fill: light, fontSize: 28, textBaseline: 'middle', textAlign: 'center' },
        measureText: {
            fill: dark,
            fontSize: 12,
            textBaseline: 'middle',
            textAlign: 'center',
            fontWeight: 'bold'
        }
    }
};
