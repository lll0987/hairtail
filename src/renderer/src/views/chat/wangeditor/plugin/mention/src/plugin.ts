import { DomEditor, IDomEditor } from '@wangeditor/editor';
import { IExtendConfig } from '../types';
import { MENTION_TAG_TYPE, MENTION_TYPE } from '../lib';

const withMention = <T extends IDomEditor>(editor: T) => {
    const { insertText, isInline, isVoid } = editor;
    const newEditor = editor;

    newEditor.insertText = t => {
        const elems = DomEditor.getSelectedElems(newEditor);

        const isSelectedVoidElem = elems.some(elem => newEditor.isVoid(elem));

        const { EXTEND_CONF } = newEditor.getConfig();
        const { mentionConfig } = EXTEND_CONF as IExtendConfig;
        const { showPopover, hidePopover, prefix = '#' } = mentionConfig;
        const _prefix = typeof prefix === 'string' ? [prefix] : prefix;

        if (isSelectedVoidElem || !_prefix.includes(t)) {
            insertText(t);
            return;
        }

        setTimeout(() => {
            if (showPopover) showPopover(newEditor);

            const _hide = () => {
                if (hidePopover) hidePopover(newEditor);
            };

            const hideOnChange = () => {
                if (newEditor.selection !== null) {
                    _hide();
                    newEditor.off('change', hideOnChange);
                }
            };

            setTimeout(() => {
                newEditor.once('fullScreen', _hide);
                newEditor.once('unFullScreen', _hide);
                newEditor.once('scroll', _hide);
                newEditor.once('modalOrPanelShow', _hide);
                newEditor.once('modalOrPanelHide', _hide);

                newEditor.on('change', hideOnChange);
            });
        });
    };

    const types = [MENTION_TYPE, MENTION_TAG_TYPE] as string[];

    newEditor.isInline = elem => {
        const type = DomEditor.getNodeType(elem);
        if (types.includes(type)) return true;
        return isInline(elem);
    };

    newEditor.isVoid = elem => {
        const type = DomEditor.getNodeType(elem);
        if (types.includes(type)) return true;
        return isVoid(elem);
    };

    return newEditor;
};

export default withMention;
