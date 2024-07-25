import DOMElement = globalThis.Element;
import { SlateDescendant, SlateElement } from '@wangeditor/editor';
import { MentionTag } from '../types';
import { MENTION_TAG_TYPE, MENTION_TYPE } from '../lib';

const mentionElemToHtml = (_, childrenHtml: string): string => {
    return `<span data-w-e-type="${MENTION_TYPE}" data-w-e-is-void data-w-e-is-inline>${childrenHtml}</span>`;
};
export const mentionToHtmlConf = { type: MENTION_TYPE, elemToHtml: mentionElemToHtml };

const parseMentionElemHtml = (_, children: SlateDescendant[]) => {
    return { type: MENTION_TYPE, children };
};
export const parseMentionHtmlConf = {
    selector: `span[data-w-e-type="${MENTION_TYPE}"]`,
    parseElemHtml: parseMentionElemHtml
};

const tagElemToHtml = (elem: SlateElement): string => {
    const { color, label } = elem as MentionTag;
    return `<span data-w-e-type="${MENTION_TAG_TYPE}" data-w-e-is-void data-w-e-is-inline data-color="${color}" data-label="${label}">${label}</span>`;
};
export const tagToHtmlConf = { type: MENTION_TAG_TYPE, elemToHtml: tagElemToHtml };

const parseTagElemHtml = (elem: DOMElement) => {
    const color = elem.getAttribute('data-color');
    const label = elem.getAttribute('data-label');
    return { type: MENTION_TAG_TYPE, children: [{ text: '' }], color, label } as MentionTag;
};
export const parseTagHtmlConf = {
    selector: `span[data-w-e-type="${MENTION_TAG_TYPE}"]`,
    parseElemHtml: parseTagElemHtml
};
