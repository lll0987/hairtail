<template>
    <div class="overflow-auto">
        <Toolbar :editor="editorRef" :default-config="toolbarConfig" :mode="mode" />
        <Editor
            v-model="valueHtml"
            :default-config="editorConfig"
            :mode="mode"
            @on-created="handleCreated"
            @on-change="handleChange"
        />
        <ag-select-menu :id="popoverId" :style="popoverStyle"></ag-select-menu>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef, watch } from 'vue';

import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { Boot, IDomEditor, IToolbarConfig, IEditorConfig } from '@wangeditor/editor';
import { EditorEmits, EditorProps } from '..';

import { useModelValue } from '@renderer/hooks';
import { AgSelectMenu } from '@renderer/components';
import { useMentionSelect } from './use-mention-select';
import { MentionModule, MENTION_EVENT, MENTION_TAG_TYPE, IMentionTag } from '../plugin';
Boot.registerModule(MentionModule);

// ------------------------------ editor value -------------------------------------
// 使用 v-model 绑定输入文本
const props = withDefaults(defineProps<EditorProps>(), { defaultValue: '' });
const emits = defineEmits<EditorEmits>();
const { mergedValue, updateValue } = useModelValue(props, emits);

// 内容变化时更新文本值
const getTextWithTag = (editor: IDomEditor): string => {
    const text = editor.getText();
    const elems = editor.getElemsByType(MENTION_TAG_TYPE) as unknown as IMentionTag[];
    if (!elems.length) return text;
    const tags = [...new Set(elems.map(elem => elem.tagName))];
    return [...tags.map(label => `tag:${label}`), text].join(',');
};
const handleChange = (editor: IDomEditor): void => {
    const targetValue = getTextWithTag(editor);
    updateValue(targetValue);
};

// 文本传递给编辑器
const valueHtml = ref(props.modelValue);
watch(mergedValue, (value: string) => {
    const editor = editorRef.value;
    if (!editor || getTextWithTag(editor) === value) return;
    valueHtml.value = value;
});
// -------------------------------- editor -------------------------------------
// 不需要太复杂的功能，使用简洁模式
const mode = 'simple';
// 隐藏工具栏
const toolbarConfig = ref<Partial<IToolbarConfig>>({
    // NEXT editor 动态更新需要再研究，暂时写死
    excludeKeys: [
        'blockquote',
        'header1',
        'header2',
        'header3',
        '|',
        'bold',
        'underline',
        'italic',
        'through',
        'color',
        'bgColor',
        'clearStyle',
        '|',
        'bulletedList',
        'numberedList',
        'todo',
        'justifyLeft',
        'justifyRight',
        'justifyCenter',
        '|',
        'insertLink',
        'group-image',
        'insertVideo',
        'insertTable',
        'codeBlock',
        '|',
        'undo',
        'redo',
        '|',
        'fullScreen'
    ]
});
// 编辑器使用默认配置
const editorConfig: Partial<IEditorConfig> = { EXTEND_CONF: { mentionConfig: {} } };

// 记录编辑器实例
const editorRef = shallowRef<IDomEditor>();
const handleCreated = (editor: IDomEditor): void => {
    editorRef.value = editor;
    editorRef.value.on(MENTION_EVENT.KEYDOWN, onKeydown);
    editorRef.value.on(MENTION_EVENT.INSERT, onInsert);
    editorRef.value.on(MENTION_EVENT.NEGATIVE, onNegative);
};
// 组件销毁时，销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
});
// -------------------------------- mention -------------------------------------
const { onInsert, onKeydown, onNegative, popoverId, popoverStyle } = useMentionSelect(editorRef, emits);
</script>

<style>
:root,
:host {
    --w-e-textarea-bg-color: transparent;
    --w-e-textarea-color: #020617;
    --w-e-textarea-border-color: transparent;
    --w-e-textarea-slight-border-color: transparent;
    --w-e-textarea-slight-color: transparent;
    --w-e-textarea-slight-bg-color: transparent;
    --w-e-textarea-selected-border-color: transparent;
    --w-e-textarea-handler-bg-color: transparent;

    --w-e-toolbar-color: transparent;
    --w-e-toolbar-bg-color: transparent;
    --w-e-toolbar-active-color: transparent;
    --w-e-toolbar-active-bg-color: transparent;
    --w-e-toolbar-disabled-color: transparent;
    --w-e-toolbar-border-color: transparent;

    --w-e-modal-button-bg-color: transparent;
    --w-e-modal-button-border-color: transparent;
}

.w-e-text-container [data-slate-editor] {
    padding: 0;
}
.w-e-text-container [data-slate-editor] p {
    margin: 0;
}
</style>
