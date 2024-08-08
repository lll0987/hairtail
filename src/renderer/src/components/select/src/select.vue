<template>
    <ag-field ref="fieldRef" v-bind="props">
        <template #default="{ id }">
            <div
                :id="id"
                ref="focusRef"
                tabindex="0"
                class="peer flex flex-row items-center flex-wrap gap-4 min-w-100 bg-transparent border-0 outline-none"
                @click.prevent.stop="onClick"
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

// 显示隐藏
const show = ref(false);

// 点击
const focusRef = ref<HTMLDivElement | null>(null);
const onClick = () => {
    if (!show.value) {
        show.value = true;
        focusRef.value?.focus();
    } else {
        show.value = false;
        focusRef.value?.blur();
    }
};
// TODO 支持更多关闭弹窗的方式
// NEXT 焦点保持

// 键盘事件
const onArrow = (key: ArrowKey): void => {
    api.handleArrowEvent(key);
};

// 回车
const onEnter = () => {
    api.onItemSelect();
    if (!api.state.multiple) show.value = false;
};

// content
const child = () => {
    const value = api.selectValue.value;
    // 没有选中值显示提示语
    if (!value.length) return h('p', { class: 'text-zinc-400' }, placeholder.value);
    // 单选直接显示选中值
    if (!api.state.multiple) return h('p', value[0]);
    // 多选显示 tag 样式
    return value.map(item => h('p', { class: ['bg-slate-200', 'px-5', 'rounded-sm'] }, item));
};
</script>
