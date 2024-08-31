<template>
    <ag-field
        :disabled="disabled"
        :size="size"
        :label="mergedLabel"
        :feedback="feedback"
        :status="meragedStatus"
    >
        <template #default="{ id }">
            <input
                :id="id"
                type="text"
                class="reset-all h-[1em] w-full placeholder:text-placeholder"
                :placeholder="mergedPlaceholder"
                :value="inputValue"
                :disabled="disabled"
                @input="onInput"
                @blur="onBlur"
            />
        </template>
    </ag-field>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import { useLabel, useModelValue, useValidate } from '@renderer/hooks';
import { AgField } from '@renderer/components';
import type { InputEmits, InputProps } from '..';
import { useInputValue } from './use-input-value';

defineOptions({ inheritAttrs: false });

// props & emits
const props = withDefaults(defineProps<InputProps>(), { defaultValue: '' });
const emits = defineEmits<InputEmits>();
// disabled & size
const { disabled, size } = toRefs(props);
// label & placeholder
const { mergedLabel, mergedPlaceholder } = useLabel(props, 'input', '请输入');
// feedback & status
const { feedback, meragedStatus } = useValidate(props);
// value
const { inputValue, parseValue } = useInputValue(props);
const onInput = (e: InputEvent | Event): void => {
    const targetValue = (e.target as HTMLInputElement).value;
    inputValue.value = targetValue;
};
const { mergedValue, updateValue } = useModelValue(props, emits);
const onBlur = () => {
    updateValue(parseValue.value);
    inputValue.value = mergedValue.value;
};
</script>
