<template>
    <ag-popover :show="show">
        <div v-if="loading" class="w-48 text-center">
            <ag-loading :size="24"></ag-loading>
        </div>
        <ul
            v-else
            class="min-w-48 h-full flex flex-col gap-4 focus:bg-sky-300 focus-within:bg-blue-300"
            @keydown="onKeydown"
        >
            <li
                v-for="(item, index) in filterOptions"
                :key="item.value"
                class="py-4 px-6 bg-transparent rounded"
                :style="{
                    backgroundColor: index === state.focusIndex ? bgColor : '',
                    color: selectValue.includes(item.value) ? color : ''
                }"
                @click.stop="onClick(item)"
                @dblclick.stop="onClick(item)"
                @mouseenter="updateFoucus(index)"
            >
                <span>{{ item.label }}</span>
            </li>
        </ul>
    </ag-popover>
</template>

<script setup lang="ts">
import { inject, toRef, watch } from 'vue';
import { AgLoading, AgPopover } from '@renderer/components';
import { EVENT_KEY } from '@renderer/constants';
import { SelectItem, SelectMenuProps, SelectApiKey, SelectMenuEmits, useSelect } from '..';

// 颜色
import colors from 'tailwindcss/colors';
const bgColor = colors.slate[200];
const color = colors.lime[500];

const props = withDefaults(defineProps<SelectMenuProps>(), { defaultValue: '' });
const emits = defineEmits<SelectMenuEmits>();

const { state, selectValue, filterOptions, updateFoucus, handleArrowEvent, handleAutoFocus, onItemSelect } =
    inject(SelectApiKey, useSelect(props, emits));

// 显示隐藏
const show = toRef(props, 'show');
const close = () => emits('update:show', false);

// 加载状态
const loading = toRef(props, 'loading');

// 鼠标事件
const onClick = (item?: SelectItem) => {
    onItemSelect(item);
    if (!state.multiple) close();
};

// 键盘事件
const onKeydown = (e: KeyboardEvent): void => {
    const { key } = e;
    const { ENTER, UP, DOWN } = EVENT_KEY;
    switch (key) {
        case ENTER:
            onClick();
            break;
        case UP:
        case DOWN:
            handleArrowEvent(key);
            break;
        default:
            break;
    }
};

// 显示时自动聚焦
watch(show, value => {
    if (value) {
        handleAutoFocus();
    }
});
</script>
