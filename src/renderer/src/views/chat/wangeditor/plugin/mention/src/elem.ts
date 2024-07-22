import { MENTION_TAG_TYPE, MENTION_TYPE } from '../lib';

import { SlateDescendant } from '@wangeditor/editor';

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

const tagElemToHtml = (_, childrenHtml: string): string => {
    return `<span data-w-e-type="${MENTION_TAG_TYPE}" data-w-e-is-void data-w-e-is-inline>${childrenHtml}</span>`;
};
export const tagToHtmlConf = { type: MENTION_TAG_TYPE, elemToHtml: tagElemToHtml };

const parseTagElemHtml = (_, children: SlateDescendant[]) => {
    return { type: MENTION_TAG_TYPE, children };
};
export const parseTagHtmlConf = {
    selector: `span[data-w-e-type="${MENTION_TAG_TYPE}"]`,
    parseElemHtml: parseTagElemHtml
};
