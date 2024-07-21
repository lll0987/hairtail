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
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef, watch } from 'vue';
import { debounce } from 'lodash';

import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { Boot, IDomEditor, IToolbarConfig, IEditorConfig } from '@wangeditor/editor';

import { EnterModule } from './plugin';
Boot.registerModule(EnterModule);

// 使用 v-model 绑定输入文本
const props = withDefaults(defineProps<{ modelValue?: string }>(), {
    modelValue: ''
});
const emits = defineEmits(['update:modelValue', 'enter']);
// 内容变化时更新文本值
const handleChange = (editor: IDomEditor): void => {
    const targetValue = editor.getText();
    if (targetValue === props.modelValue) return;
    emits('update:modelValue', targetValue);
};
// 文本传递给编辑器
const valueHtml = ref(props.modelValue);
watch(
    () => props.modelValue,
    (value: string) => {
        const editor = editorRef.value;
        if (!editor || editor.getText() === value) return;
        valueHtml.value = value;
    }
);

// 不需要太复杂的功能，使用简洁模式
const mode = 'simple';
// 隐藏工具栏
const toolbarConfig = ref<Partial<IToolbarConfig>>({
    // NEXT 动态更新需要再研究，暂时写死
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
const editorConfig = ref<Partial<IEditorConfig>>({});

// 记录编辑器实例
const editorRef = shallowRef<IDomEditor>();
const handleCreated = (editor: IDomEditor): void => {
    editorRef.value = editor;
    editorRef.value.on('cusEnter', handleEnter);
};
// 组件销毁时，销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
});

// 回车事件
const handleEnter = debounce(() => {
    emits('enter');
}, 1000);
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
