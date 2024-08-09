<template>
    <ag-field
        ref="fieldRef"
        v-bind="props"
        @mousedown.prevent.stop="handleFocus"
        @focusout.prevent.stop="handleBlur"
    >
        <template #default="{ id }">
            <div
                :id="id"
                ref="focusRef"
                tabindex="0"
                class="peer flex flex-row items-center flex-wrap gap-4 min-w-100 bg-transparent border-0 outline-none"
                @mousedown.prevent.stop="onMousedown"
                @keydown.enter.stop.prevent="onEnter"
                @keydown.down.stop.prevent="onArrow(EVENT_KEY.DOWN)"
                @keydown.up.stop.prevent="onArrow(EVENT_KEY.UP)"
            >
                <child></child>
            </div>
            <ag-select-menu ref="menuRef" v-model:show="show"></ag-select-menu>
        </template>
    </ag-field>
</template>

<script setup lang="ts">
import { computed, h, onMounted, provide, reactive, ref } from 'vue';
import { EVENT_KEY } from '@renderer/constants';
import { ArrowKey, SelectApiKey, useSelect } from '@renderer/components';
import { SelectEmits, SelectProps } from '..';
import { AgField, AgSelectMenu, PopoverApiKey } from '../..';

const props = withDefaults(defineProps<SelectProps>(), { defaultValue: '' });
const emits = defineEmits<SelectEmits>();

// API
const api = useSelect(props, emits);
provide(SelectApiKey, api);

// DOM
const fieldRef = ref<InstanceType<typeof AgField>>();
const contentRef = ref<HTMLFieldSetElement | null>(null);
const popApi = reactive({ contentRef });
provide(PopoverApiKey, popApi);
onMounted(() => {
    contentRef.value = fieldRef.value?.fieldRef as HTMLFieldSetElement;
});

// 提示语
const placeholder = computed(() => '请选择' + props.label);

// 焦点
const show = ref(false);
const focusRef = ref<HTMLDivElement | null>(null);
const handleFocus = () => {
    show.value = true;
    focusRef.value?.focus();
};
const handleBlur = () => {
    show.value = false;
    focusRef.value?.blur();
};
const onMousedown = () => {
    if (show.value) {
        handleBlur();
    } else {
        handleFocus();
    }
};

// 键盘事件
const onArrow = (key: ArrowKey): void => {
    api.handleArrowEvent(key);
};

// 回车
const onEnter = () => {
    if (show.value) {
        api.onItemSelect();
        if (!api.state.multiple) show.value = false;
    } else {
        handleFocus();
    }
};

// TODO 增加清空按钮
// NEXT 高度固定，不再依赖文字行高
// content
const child = () => {
    const value = api.selectValue.value;
    // 没有选中值显示提示语
    if (!value.length) return h('p', { class: ['text-zinc-400', 'pointer-events-none'] }, placeholder.value);
    // 单选直接显示选中值
    if (!api.state.multiple) return h('p', {}, value[0]);
    // 多选显示 tag 样式
    // FIX 多选会在点击其它 tag 时触发事件，导致菜单收起
    return value.map(item => h('p', { class: ['bg-slate-200', 'px-5', 'rounded-sm'] }, item));
};
</script>
