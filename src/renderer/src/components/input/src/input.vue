<template>
    <ag-field v-bind="props">
        <template #default="{ id }">
            <input
                :id="id"
                type="text"
                class="w-full min-w-100 min-h-[auto] bg-transparent border-0 outline-none peer placeholder:text-zinc-400"
                :placeholder="placeholder"
                :value="mergedValue"
                :readonly="props.readonly"
                @input="onInput"
                @blur="onBlur"
            />
        </template>
    </ag-field>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useModelValue } from '@renderer/hooks';
import { InputProps } from '..';
import { AgField } from '../..';

const props = withDefaults(defineProps<InputProps>(), { defaultValue: '' });
const emits = defineEmits(['update:modelValue', 'blur']);

const placeholder = computed(() => '请输入' + (props.label || ''));

const { mergedValue, updateValue } = useModelValue<string>(props, emits);

const onInput = (e: InputEvent | Event): void => {
    const targetValue = (e.target as HTMLInputElement).value;
    updateValue(targetValue);
};

const onBlur = () => {
    emits('blur');
};
</script>
