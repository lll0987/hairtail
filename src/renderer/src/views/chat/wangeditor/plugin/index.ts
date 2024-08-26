export * from './src/type';
export * from './src/lib';

import { IModuleConf } from '@wangeditor/editor';

import { renderMentionConf, renderTagConf } from './src/render';
import { mentionToHtmlConf, parseMentionHtmlConf, parseTagHtmlConf, tagToHtmlConf } from './src/elem';
import plugin from './src/plugin';

const module: Partial<IModuleConf> = {
    renderElems: [renderMentionConf, renderTagConf],
    elemsToHtml: [mentionToHtmlConf, tagToHtmlConf],
    parseElemsHtml: [parseMentionHtmlConf, parseTagHtmlConf],
    editorPlugin: plugin
};

export { module as MentionModule };
