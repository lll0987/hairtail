import { h, VNode } from 'snabbdom';
import { SlateElement } from '@wangeditor/editor';

import { borderColor, MENTION_TAG_TYPE, MENTION_TYPE } from '../lib';
import { MentionTag } from '../types';

const renderMention = (_elem: SlateElement, children: VNode[] | null): VNode => {
    return h('span', null, children);
};
export const renderMentionConf = { type: MENTION_TYPE, renderElem: renderMention };

// const isLight = (color: string) => {
//     return 0.213 * rgb[0] + 0.715 * rgb[1] + 0.072 * rgb[2] > 255 / 2;
// };

const renderTag = (elem: SlateElement, children: VNode[] | null): VNode => {
    const { color } = elem as MentionTag;
    const backgroundColor = color || '#1e293b';

    return h(
        'span',
        {
            props: {
                contentEditable: false // 不可编辑
            },
            style: {
                color: '#fff',
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
        children
    );
};
export const renderTagConf = { type: MENTION_TAG_TYPE, renderElem: renderTag };
