<template>
    <ag-input v-bind="bindProps" :model-value="inputValue" @update:model-value="handleValue" @blur="onBlur" />
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import { useModelValue } from '@renderer/hooks';
import { InputNumberProps, InputNumberType } from '..';
import { AgInput } from '../..';

const props = withDefaults(defineProps<InputNumberProps>(), { defaultValue: null });
const emits = defineEmits(['update:modelValue']);

const attrs = useAttrs();
const bindProps = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { modelValue, defaultValue, ..._props } = props;
    return { ..._props, ...attrs };
});

const parse = (value: string) => {
    let val: InputNumberType = parseFloat(value);
    if (isNaN(val)) val = null;
    return val;
};

const { mergedValue, updateValue } = useModelValue<InputNumberType>(props, emits);

const inputValue = ref(mergedValue.value === null ? '' : mergedValue.value + '');
const handleValue = (value: string) => {
    inputValue.value = value;

    const targetValue = parse(value);
    updateValue(targetValue);
};

const onBlur = () => {
    const val = mergedValue.value;
    inputValue.value = val === null ? '' : val + '';
};
</script>
