import { DomEditor, IDomEditor, IModuleConf } from '@wangeditor/editor';

function handleEnter<T extends IDomEditor>(editor: T) {
    const { insertBreak } = editor;
    const newEditor = editor;

    setTimeout(() => {
        // beforeInput 事件不能识别 ctrl+enter ，所以自己绑定 DOM 事件
        const { $textArea } = DomEditor.getTextarea(newEditor);
        if ($textArea == null) return;
        $textArea.on('keydown', e => {
            const event = e as KeyboardEvent;
            const isCtrl = event.ctrlKey || event.metaKey;
            if (event.key === 'Enter') {
                if (isCtrl) {
                    // ctrl+enter 触发换行
                    newEditor.insertBreak();
                } else {
                    // #增加回车事件
                    newEditor.emit('cusEnter');
                }
            }
        });
    });

    newEditor.insertBreak = () => {
        const event = window.event as KeyboardEvent;
        const isCtrl = event.ctrlKey || event.metaKey;
        // 只有 ctrl 才能换行
        if (isCtrl) {
            insertBreak();
        }
    };

    return newEditor;
}

const module: Partial<IModuleConf> = {
    editorPlugin: handleEnter
};

export default module;
