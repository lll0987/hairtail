import { DomEditor, IDomEditor, SlateEditor, SlateRange, SlateTransforms } from '@wangeditor/editor';
import { IExtendConfig, IMention, MentionChild, MentionConfig, MentionEvent, MentionTag } from '../types';
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

const handleChange = (editor: IDomEditor, close: boolean = false) => {
    const _hide = () => {
        editor.emit(MentionEvent.HIDE);
    };

    const label = getPrefixLabel(editor);
    if (label === null) return close ? _hide() : void 0;

    setTimeout(() => {
        const position = getCursorPosition();
        editor.emit(MentionEvent.INSERT, position, label.text);

        // 暴露隐藏事件，方便外部组件关闭弹窗等组件
        setTimeout(() => {
            editor.once('fullScreen', _hide);
            editor.once('unFullScreen', _hide);
            editor.once('scroll', _hide);
            editor.once('modalOrPanelShow', _hide);
            editor.once('modalOrPanelHide', _hide);
        });
    });
};

const withMention = <T extends IDomEditor>(editor: T) => {
    const { deleteBackward, deleteForward, insertText, isInline, isVoid, getText } = editor;
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
        handleChange(newEditor);
    };
    // 重写删除方法
    newEditor.deleteBackward = unit => {
        deleteBackward(unit);
        handleChange(newEditor, true);
    };
    newEditor.deleteForward = unit => {
        deleteForward(unit);
        handleChange(newEditor, true);
    };

    // 监听提交事件，将文本替换为 mention 节点
    newEditor.on(MentionEvent.POSITIVE, (data: IMention) => {
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

        SlateTransforms.insertNodes(newEditor, nodes, { at: label.at });

        const { anchor } = label.at;
        const length = text.reduce((r, i) => (r += i.text.length + 1), tags.length * 2);
        newEditor.move(anchor.offset + length);
    });

    // 重写获取文本的方法，增加 tag 文本
    newEditor.getText = () => {
        const text = getText();
        const elems = newEditor.getElemsByType(MENTION_TAG_TYPE) as unknown as MentionTag[];
        if (!elems.length) return text;
        const tags = [...new Set(elems.map(elem => elem.label))];
        return [...tags.map(label => `tag:${label}`), text].join(',');
    };

    return newEditor;
};

export default withMention;
