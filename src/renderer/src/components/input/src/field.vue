<template>
    <fieldset
        class="px-6 pb-4 transition-color duration-200 ease-out motion-reduce:transition-none rounded border-slate-800 has-[:focus]:border-lime-500"
        :style="styles"
        v-bind="$attrs"
    >
        <slot></slot>
        <p class="block text-12" :style="{ color: colorMap[props.status] }">{{ props.msg }}</p>
        <legend
            class="transition-color duration-200 ease-out motion-reduce:transition-none text-slate-800 peer-focus:text-lime-500 text-12 mx-8 px-4"
            :style="{ padding: props.borderWidth && hasLegend ? undefined : 0 }"
        >
            {{ props.legend }}
        </legend>
    </fieldset>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { FieldProps, ItemStatus } from './types';
import colors from 'tailwindcss/colors';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FieldProps>(), { borderWidth: 2, status: 'default' });

const hasLegend = computed(() => !!props.legend);

// 文本颜色
const colorMap: Record<ItemStatus, string> = {
    default: colors.slate[500],
    success: colors.green[500],
    warning: colors.amber[500],
    error: colors.rose[500]
};

// 背景颜色
const bgColorMap: Record<ItemStatus, string> = {
    default: colors.white,
    success: colors.green[100],
    warning: colors.amber[100],
    error: colors.rose[100]
};

// 样式
const styles = computed(() => {
    return {
        borderColor: props.borderColor,
        borderWidth: props.borderWidth + 'px',
        paddingTop: hasLegend.value ? undefined : '4px',
        backgroundColor: bgColorMap[props.status]
    };
});
</script>
