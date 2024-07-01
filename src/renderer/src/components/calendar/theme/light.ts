import type { S2Theme } from '@antv/s2';
import colors from 'tailwindcss/colors';

const BG_COLOR = colors.neutral[100];
const BORDER_COLOR = colors.zinc[950];
const TEXT_COLOR = colors.zinc[950];
const SUB_TEXT_COLOR = colors.zinc[800];

const hasBorderCell = {
    // 水平边框
    horizontalBorderColor: BORDER_COLOR,
    horizontalBorderColorOpacity: 1,
    horizontalBorderWidth: 1,
    // 垂直边框
    verticalBorderColor: BORDER_COLOR,
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

export const LightTheme: S2Theme = {
    background: { color: BG_COLOR },
    splitLine: {
        // 水平有边框
        horizontalBorderColor: BORDER_COLOR,
        horizontalBorderColorOpacity: 1,
        horizontalBorderWidth: 1,
        // 垂直无边框
        verticalBorderColor: BORDER_COLOR,
        verticalBorderColorOpacity: 0,
        verticalBorderWidth: 0,
        // 显示阴影
        showShadow: true
    },
    dataCell: {
        cell: noBorderCell,
        text: { fill: TEXT_COLOR },
        bolderText: { fill: TEXT_COLOR }
    },
    rowCell: {
        cell: hasBorderCell,
        text: { fill: TEXT_COLOR, textBaseline: 'middle', textAlign: 'center' },
        bolderText: { fill: TEXT_COLOR, textBaseline: 'middle', textAlign: 'center' }
    },
    colCell: {
        cell: noBorderCell,
        text: { fill: TEXT_COLOR },
        bolderText: { fill: TEXT_COLOR, fontSize: 20, textBaseline: 'top', textAlign: 'center' },
        measureText: {
            fill: SUB_TEXT_COLOR,
            fontSize: 12,
            textBaseline: 'top',
            textAlign: 'center',
            fontWeight: 'normal'
        }
    },
    cornerCell: {
        cell: noBorderCell,
        text: { fill: TEXT_COLOR, fontSize: 32, textBaseline: 'middle', textAlign: 'center' },
        bolderText: { fill: BG_COLOR, fontSize: 28, textBaseline: 'middle', textAlign: 'center' },
        measureText: {
            fill: TEXT_COLOR,
            fontSize: 12,
            textBaseline: 'middle',
            textAlign: 'center',
            fontWeight: 'bold'
        }
    }
};

// NEXT 选中态样式
