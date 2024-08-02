<template>
    <ag-input v-bind="bindProps" :model-value="inputValue" @update:model-value="handleValue" @blur="onBlur" />
</template>

<script setup lang="ts">
import { computed, ref, toRef, useAttrs } from 'vue';
import { InputNumberProps } from './types';
import { useMergedState } from '@renderer/hooks';
import { AgInput } from '@renderer/components';

const props = withDefaults(defineProps<InputNumberProps>(), { defaultValue: null });
const emits = defineEmits(['update:modelValue']);

const attrs = useAttrs();
const bindProps = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { modelValue, defaultValue, ..._props } = props;
    return { ..._props, ...attrs };
});

const parse = (value: string) => {
    let val: number | null = parseFloat(value);
    if (isNaN(val)) val = null;
    return val;
};

const controlledValue = toRef(props, 'modelValue');
const uncontrolledValue = ref(props.defaultValue);
const mergedValue = useMergedState(controlledValue, uncontrolledValue);

const inputValue = ref(mergedValue.value === null ? '' : mergedValue.value + '');
const handleValue = (value: string) => {
    inputValue.value = value;

    const targetValue = parse(value);
    emits('update:modelValue', targetValue);
    uncontrolledValue.value = targetValue;
};

const onBlur = () => {
    const val = mergedValue.value;
    inputValue.value = val === null ? '' : val + '';
};
</script>
