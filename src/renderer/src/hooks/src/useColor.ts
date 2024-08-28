import { ref } from 'vue';
import { colors } from '@contracts/component';

const RGB = (color: string): [number, number, number] | null => {
    // hex 6
    if (/^#?[0-9A-Fa-f]{6}$/.test(color)) {
        return [
            parseInt(color.substring(1, 3), 16),
            parseInt(color.substring(3, 5), 16),
            parseInt(color.substring(5, 7), 16)
        ];
    }
    // hex 3
    if (/^#?[0-9A-Fa-f]{3}$/.test(color)) {
        const r = color.substring(1, 2);
        const g = color.substring(2, 3);
        const b = color.substring(3, 4);
        return [parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16)];
    }
    // rgb
    const rgbMatch = color.match(/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/);
    if (rgbMatch) return [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])];
    // rgba
    const rgbaMatch = color.match(/^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(0|1|0?\.\d+)\)$/);
    if (rgbaMatch) return [parseInt(rgbaMatch[1]), parseInt(rgbaMatch[2]), parseInt(rgbaMatch[3])];

    return null;
};

const def_text_color_light = colors.white;
const def_text_color_dark = colors.black;
const def_bg_color_light = colors.slate[200];
const def_bg_color_dark = colors.slate[950];

const colorMap = ref(
    new Map<string, string>([
        [def_bg_color_dark, def_text_color_light],
        [def_bg_color_light, def_text_color_dark]
    ])
);
const getColor = (backgroundColor: string) => colorMap.value.get(backgroundColor) as string;

export type ColorMode = 'light' | 'dark';
/**
 * 获取默认背景颜色和文字颜色
 * @param mode 颜色主题（默认 dark）
 */
export const getDefaultColor = (mode: ColorMode = 'dark') => {
    const backgroundColor = mode === 'light' ? def_bg_color_light : def_bg_color_dark;
    const color = getColor(backgroundColor);
    return { backgroundColor, color };
};

/**
 * 设置背景颜色和文字颜色
 * @param backgroundColor 背景颜色
 * @param color 文字颜色
 * @param mode 颜色主题（默认 dark）
 */
export const useColor = (
    backgroundColor?: string,
    color?: string,
    mode?: ColorMode
): { backgroundColor: string; color: string } => {
    const def_style = getDefaultColor(mode);
    // 如果背景色不存在或不能解析，返回默认样式
    if (!backgroundColor) return def_style;
    const rgb = RGB(backgroundColor);
    if (rgb === null) return def_style;

    // 根据背景色计算默认文字颜色
    if (!colorMap.value.has(backgroundColor)) {
        const isLight = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2] > 138;
        colorMap.value.set(backgroundColor, isLight ? def_text_color_dark : def_text_color_light);
    }

    // 没有指定文字颜色时使用默认文字颜色
    if (!color) color = getColor(backgroundColor);
    return { backgroundColor, color };
};
