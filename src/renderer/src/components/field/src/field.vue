<template>
    <div class="flex flex-row items-center gap-4">
        <label v-if="props.inline" class="text-nowrap" :for="id">{{ props.label }}</label>
        <fieldset
            ref="fieldRef"
            class="flex-1 px-6 pb-4 transition-color duration-200 ease-out motion-reduce:transition-none rounded border-slate-800 has-[:focus]:border-lime-500"
            :style="styles"
        >
            <slot :id="id"></slot>
            <p class="block text-12" :style="{ color: colorMap[status] }">{{ msg }}</p>
            <legend
                class="transition-color duration-200 ease-out motion-reduce:transition-none text-slate-800 peer-focus:text-lime-500 text-12 mx-8 px-4"
                :style="legendStyle"
            >
                {{ legendText }}
            </legend>
        </fieldset>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import colors from 'tailwindcss/colors';
import { FieldProps, ItemStatus } from '..';
import { useId } from '@renderer/hooks';

// defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<FieldProps>(), { borderWidth: 2, status: 'default' });

const id = useId().next() + '';

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
        paddingTop: props.inline ? '4px' : undefined,
        backgroundColor: bgColorMap[props.status]
    };
});

const legendText = computed(() => (props.inline ? '' : props.label));
const legendStyle = computed(() => (props.borderWidth && legendText.value ? {} : { padding: 0 }));

const fieldRef = ref<HTMLFieldSetElement | null>(null);
defineExpose({ fieldRef });
</script>
