import { h, VNode } from 'snabbdom';
import { DomEditor, IDomEditor, SlateElement } from '@wangeditor/editor';

import { borderColor, MENTION_TAG_TYPE, MENTION_TYPE } from '../lib';
import { MentionTag } from '../types';

const renderMention = (_elem: SlateElement, children: VNode[] | null): VNode => {
    return h('span', null, children);
};
export const renderMentionConf = { type: MENTION_TYPE, renderElem: renderMention };

const renderTag = (elem: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode => {
    const isSelected = DomEditor.isNodeSelected(editor, elem);
    const { color = '#fff' } = elem as MentionTag;

    return h(
        'span',
        {
            props: {
                contentEditable: false // 不可编辑
            },
            style: {
                backgroundColor: color,
                borderColor: isSelected ? borderColor : color,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: '0.25rem',
                fontSize: '14px',
                padding: '4px 6px'
            }
        },
        children
    );
};
export const renderTagConf = { type: MENTION_TAG_TYPE, renderElem: renderTag };
