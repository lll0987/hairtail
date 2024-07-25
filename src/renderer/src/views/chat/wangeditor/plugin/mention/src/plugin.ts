import { DomEditor, IDomEditor, SlateEditor, SlateRange, SlateTransforms } from '@wangeditor/editor';
import { IExtendConfig, IMention, MentionChild, MentionConfig } from '../types';
import { MENTION_TAG_TYPE, MENTION_TYPE } from '../lib';

// 获取插件配置
interface IConfig extends Required<Omit<MentionConfig, 'prefix'>> {
    prefix: string[];
}
const getConfig = (editor: IDomEditor): IConfig => {
    const { EXTEND_CONF } = editor.getConfig();
    const { mentionConfig } = EXTEND_CONF as IExtendConfig;
    const { prefix = '#', separator = ' ' } = mentionConfig;
    const _prefix = typeof prefix === 'string' ? [prefix] : prefix;

    return { ...mentionConfig, prefix: _prefix, separator };
};

// 获取光标位置
const getCursorPosition = () => {
    const domSelection = document.getSelection();
    const domRange = domSelection?.getRangeAt(0);
    if (!domRange) return { top: 0, left: 0 };
    const rect = domRange.getBoundingClientRect();
    return { top: rect.top, left: rect.left + 4 };
};

// 获取快捷短语内容
const getPrefixLabel = (editor: IDomEditor) => {
    // MEMO 当锚点和焦点重合时，选区就表示一个光标
    const { selection } = editor;
    if (selection === null) return null;
    // 选区有内容时，执行默认操作
    if (SlateRange.isExpanded(selection)) return null;
    if (DomEditor.getSelectedNodeByType(editor, 'paragraph') == null) return null;

    const { anchor } = selection;
    const { path } = anchor;
    const text = SlateEditor.string(editor, { anchor, focus: { path, offset: 0 } });

    const { prefix } = getConfig(editor);
    const index = prefix.reduceRight((_, cur) => text.indexOf(cur), -1);

    if (index === -1) return null;

    return { text: text.slice(index + 1), at: { anchor, focus: { path, offset: index } } };
};

const withMention = <T extends IDomEditor>(editor: T) => {
    const { insertText, isInline, isVoid } = editor;
    const newEditor = editor;

    const types = [MENTION_TYPE, MENTION_TAG_TYPE] as string[];
    // 重写是否为行内元素的判断
    newEditor.isInline = elem => {
        const type = DomEditor.getNodeType(elem);
        if (types.includes(type)) return true;
        return isInline(elem);
    };
    // 重写是否为空元素的判断
    newEditor.isVoid = elem => {
        const type = DomEditor.getNodeType(elem);
        if (types.includes(type)) return true;
        return isVoid(elem);
    };

    // 重写插入文本的方法，识别到前缀时向外暴露光标位置和输入文本
    newEditor.insertText = t => {
        insertText(t);

        const label = getPrefixLabel(newEditor);
        if (label === null) return;

        setTimeout(() => {
            const position = getCursorPosition();
            newEditor.emit('cusInsert', position, label.text);

            // 暴露隐藏事件，方便外部组件关闭弹窗等组件
            const _hide = () => {
                newEditor.emit('cusHide', position);
            };
            const hideOnChange = () => {
                if (newEditor.selection === null) return;
                _hide();
                newEditor.off('change', hideOnChange);
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

    // 监听提交事件，将文本替换为 mention 节点
    newEditor.on('cusPositive', (data: IMention) => {
        const label = getPrefixLabel(newEditor);
        if (label === null) return;

        const { tags, text } = data;
        const { separator } = getConfig(editor);

        const nodes = [
            ...tags.reduce(
                (acc, { color, label }) =>
                    acc.concat(
                        { type: MENTION_TAG_TYPE, color, label, children: [{ text: '' }] },
                        { text: separator }
                    ),
                [] as MentionChild[]
            ),
            ...text.reduce((acc, { text }) => acc.concat({ text }, { text: separator }), [] as MentionChild[])
        ];

        // newEditor.select(label.at);
        // newEditor.deselect();
        // newEditor.insertFragment(nodes);
        // SlateTransforms.insertNodes(newEditor, nodes);
        SlateTransforms.insertNodes(newEditor, nodes, { at: label.at });

        // newEditor.move(nodes.length);
    });

    return newEditor;
};

export default withMention;
