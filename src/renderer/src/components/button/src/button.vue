<template>
    <button
        class="text-slate-950 border-2 border-slate-800 rounded px-8 h-32 inline-flex flex-row justify-center items-center"
        :style="{ backgroundColor: color, ...styles }"
    >
        <span v-show="loading" class="flex items-center mr-6">
            <AgLoading size="1em"></AgLoading>
        </span>
        <span class="flex items-center flex-nowrap min-w-0">
            <slot></slot>
        </span>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import colors from 'tailwindcss/colors';

import { AgLoading } from '@renderer/components';
import { ButtonProps, ButtonType } from './types';

const props = withDefaults(defineProps<ButtonProps>(), { loading: false, type: 'default', size: 'medium' });

// 加载状态
const loading = computed(() => props.loading);

// 颜色
const colorMap: Record<ButtonType, string> = {
    default: colors.slate[200],
    primary: colors.lime[300],
    accent: colors.sky[300],
    success: colors.green[300],
    warning: colors.yellow[300],
    error: colors.rose[300]
};
const color = computed(() => props.color || colorMap[props.type]);

// 样式
const styles = computed(() => {
    const style: {
        height?: string;
        fontSize?: string;
        paddingLeft?: string;
        paddingRight?: string;
        cursor: string;
    } = { cursor: loading.value ? 'wait' : 'pointer' };

    if (props.size === 'small') {
        style.height = '28px';
        style.fontSize = '14px';
    }
    if (props.size === 'large') {
        style.height = '36px';
        style.paddingLeft = '12px';
        style.paddingRight = '12px';
    }

    return style;
});
</script>
