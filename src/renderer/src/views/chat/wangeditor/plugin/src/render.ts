import { h, VNode, VNodeData } from 'snabbdom';
import { SlateElement } from '@wangeditor/editor';
import { MENTION_TAG_TYPE, MENTION_TYPE, IMentionTag } from '..';
import { useTagRender } from '@renderer/hooks';

const renderMention = (_elem: SlateElement, children: VNode[] | null): VNode => {
    return h('span', null, children);
};
export const renderMentionConf = { type: MENTION_TYPE, renderElem: renderMention };

const renderTag = (elem: SlateElement): VNode => {
    const { tagName } = elem as unknown as IMentionTag;

    const { type, props, children } = useTagRender(tagName, false);
    const style = props.style as VNodeData;

    return h(type, { props: { contentEditable: false }, style }, children);
};
export const renderTagConf = { type: MENTION_TAG_TYPE, renderElem: renderTag };
