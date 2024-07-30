<template>
    <fieldset
        class="px-6 pb-4 transition-color duration-200 ease-out motion-reduce:transition-none rounded border-slate-800 has-[:focus]:border-lime-500 bg-white"
        :style="styles"
    >
        <slot></slot>
        <p v-if="hasMsg" class="block text-12">
            <span class="text-rose-500">{{ props.errorMsg }}</span>
            <span class="text-amber-500">{{ props.warnMsg }}</span>
            <span class="text-green-500">{{ props.succMsg }}</span>
            <span class="text-slate-500">{{ props.msg }}</span>
        </p>
        <legend
            class="transition-color duration-200 ease-out motion-reduce:transition-none text-slate-800 peer-focus:text-lime-500 text-12 mx-8 px-4"
            :style="{ padding: props.borderWidth ? undefined : 0 }"
        >
            {{ props.label }}
        </legend>
    </fieldset>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { FieldProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FieldProps>(), { borderWidth: 2 });
const styles = computed(() => {
    return {
        borderColor: props.borderColor,
        borderWidth: props.borderWidth + 'px'
    };
});

const hasMsg = computed(() => {
    return !!(props.errorMsg || props.warnMsg || props.succMsg || props.msg);
});
</script>
