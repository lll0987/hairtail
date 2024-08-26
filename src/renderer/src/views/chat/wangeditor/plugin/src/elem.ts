import DOMElement = globalThis.Element;
import { SlateDescendant, SlateElement } from '@wangeditor/editor';
import { MENTION_TAG_TYPE, MENTION_TYPE, IMentionTag } from '..';

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
    const { tagName } = elem as IMentionTag;
    return `<span data-w-e-type="${MENTION_TAG_TYPE}" data-w-e-is-void data-w-e-is-inline data-tag-name="${tagName}">${tagName}</span>`;
};
export const tagToHtmlConf = { type: MENTION_TAG_TYPE, elemToHtml: tagElemToHtml };

const parseTagElemHtml = (elem: DOMElement) => {
    const tagName = elem.getAttribute('data-tag-name');
    return { type: MENTION_TAG_TYPE, children: [{ text: '' }], tagName } as IMentionTag;
};
export const parseTagHtmlConf = {
    selector: `span[data-w-e-type="${MENTION_TAG_TYPE}"]`,
    parseElemHtml: parseTagElemHtml
};
