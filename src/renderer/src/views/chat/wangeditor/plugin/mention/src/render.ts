import { h, VNode } from 'snabbdom';
import { SlateElement } from '@wangeditor/editor';

import { borderColor, MENTION_TAG_TYPE, MENTION_TYPE } from '../lib';
import { MentionTag } from '../types';

const renderMention = (_elem: SlateElement, children: VNode[] | null): VNode => {
    return h('span', null, children);
};
export const renderMentionConf = { type: MENTION_TYPE, renderElem: renderMention };

const getRGB = (color: string) => {
    const rgbRegex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
    const rgbaRegex = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(0|1|0?\.\d+)\)$/;

    const rgbMatch = color.match(rgbRegex);
    const rgbaMatch = color.match(rgbaRegex);

    if (/^#?[0-9A-Fa-f]{6}$/.test(color)) {
        return [
            parseInt(color.substring(1, 3), 16),
            parseInt(color.substring(3, 5), 16),
            parseInt(color.substring(5, 7), 16)
        ];
    }
    if (/^#?[0-9A-Fa-f]{3}$/.test(color)) {
        const r = color.substring(1, 2);
        const g = color.substring(2, 3);
        const b = color.substring(3, 4);
        return [parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16)];
    }

    if (rgbMatch) return [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])];

    if (rgbaMatch) return [parseInt(rgbaMatch[1]), parseInt(rgbaMatch[2]), parseInt(rgbaMatch[3])];

    return [30, 41, 59];
};

const isLight = (color: string) => {
    const rgb = getRGB(color);
    return 0.213 * rgb[0] + 0.715 * rgb[1] + 0.072 * rgb[2] > 255 / 2;
};

const renderTag = (elem: SlateElement): VNode => {
    const { color, label } = elem as unknown as MentionTag;
    const backgroundColor = color || '#1e293b';

    return h(
        'span',
        {
            props: {
                contentEditable: false // 不可编辑
            },
            style: {
                color: isLight(backgroundColor) ? '#000' : '#fff',
                backgroundColor,
                borderColor,
                borderWidth: '2px',
                borderStyle: 'solid',
                borderRadius: '0.25rem',
                display: 'inline-flex',
                alignItems: 'center',
                flexWrap: 'nowrap',
                fontSize: '14px',
                padding: '4px 6px',
                lineHeight: '1',
                cursor: 'default',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box'
            }
        },
        label
    );
};
export const renderTagConf = { type: MENTION_TAG_TYPE, renderElem: renderTag };
