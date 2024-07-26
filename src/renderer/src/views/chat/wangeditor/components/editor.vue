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
        <popover
            :show="showPopover"
            :left="popoverProps.left"
            :top="popoverProps.top"
            :text="popoverProps.text"
            @change="onSelected"
            @selected="handleSelected"
        ></popover>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef, watch } from 'vue';

import { ISetting } from '@t/interface';

import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { Boot, IDomEditor, IToolbarConfig, IEditorConfig } from '@wangeditor/editor';

import popover from './popover.vue';

import { EnterModule, MentionModule, IMention, PureText, MentionEvent } from '../plugin';
Boot.registerModule(EnterModule);
Boot.registerModule(MentionModule);

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

// 显示/隐藏预设选项
const showPopover = ref(false);
const popoverProps = ref({ left: 0, top: 0, text: '' });
const showMention = (position: { top: number; left: number }, text: string) => {
    popoverProps.value.left = position.left;
    popoverProps.value.top = position.top;
    popoverProps.value.text = text;
    if (text === '') showPopover.value = true;
};
const hideMention = () => {
    showPopover.value = false;
    popoverProps.value.text = '';
};

// 选中的预设
const mentionSelected = ref<ISetting>();
const onSelected = (item: ISetting) => {
    mentionSelected.value = item;
};
const handleSelected = () => {
    if (!mentionSelected.value) return;
    const { value } = mentionSelected.value;
    const data: IMention = {
        tags: value.tags?.map(tag => ({ color: '', label: tag })) ?? [],
        text: [value.topic, value.value, value.text].reduce((pre, cur) => {
            if (cur !== undefined) {
                pre.push({ text: cur + '' });
            }
            return pre;
        }, [] as PureText[])
    };
    editorRef.value?.emit(MentionEvent.POSITIVE, data);
    hideMention();
};

let timer: number | null = null;
// 回车事件
const handleEnter = () => {
    if (showPopover.value) {
        // 弹窗显示 && 有选中数据 == 插入
        handleSelected();
        timer = window.setTimeout(() => {
            timer = null;
        }, 1000);
    } else {
        // 弹窗不显示时 == 回车
        if (timer === null) {
            emits('enter');
        }
    }
};

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
const editorConfig: Partial<IEditorConfig> = { EXTEND_CONF: { mentionConfig: {} } };

// 记录编辑器实例
const editorRef = shallowRef<IDomEditor>();
const handleCreated = (editor: IDomEditor): void => {
    editorRef.value = editor;
    editorRef.value.on('cusEnter', handleEnter);
    editorRef.value.on(MentionEvent.INSERT, showMention);
    // editorRef.value.on(MentionEvent.HIDE, hideMention);
};
// 组件销毁时，销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
});
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
