<template>
    <div class="overflow-auto">
        <Toolbar :editor="editorRef" :default-config="toolbarConfig" :mode="mode" />
        <Editor v-model="valueHtml" :default-config="editorConfig" :mode="mode" @on-created="handleCreated" />
    </div>
</template>

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css';

import { onBeforeUnmount, ref, shallowRef } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { IDomEditor, IToolbarConfig, IEditorConfig } from '@wangeditor/editor';

const mode = 'simple';
const toolbarConfig = ref<Partial<IToolbarConfig>>({
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
const editorConfig = ref<Partial<IEditorConfig>>({});

const editorRef = shallowRef<IDomEditor>();
const handleCreated = editor => {
    editorRef.value = editor;
};

onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
});

const valueHtml = ref('');
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
