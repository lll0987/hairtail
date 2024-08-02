<template>
    <div class="flex flex-row items-center gap-4">
        <label class="text-nowrap" :for="props.label">{{ props.label }}</label>
        <field :legend="props.legend">
            <input
                :id="props.label"
                type="text"
                class="w-full min-w-100 min-h-[auto] bg-transparent border-0 outline-none peer placeholder:text-zinc-400"
                :placeholder="placeholder"
                :value="mergedValue"
                :readonly="props.readonly"
                @input="onInput"
                @blur="onBlur"
            />
        </field>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from 'vue';
import { useMergedState } from '@renderer/hooks';
import { InputProps } from './types';
import Field from './field.vue';

const props = withDefaults(defineProps<InputProps>(), { defaultValue: '' });
const emits = defineEmits(['update:modelValue', 'blur']);

const placeholder = computed(() => '请输入' + (props.label || ''));

const controlledValue = toRef(props, 'modelValue');
const uncontrolledValue = ref(props.defaultValue);
const mergedValue = useMergedState(controlledValue, uncontrolledValue);

const onInput = (e: InputEvent | Event): void => {
    const targetValue = (e.target as HTMLInputElement).value;
    emits('update:modelValue', targetValue);
    uncontrolledValue.value = targetValue;
};

const onBlur = () => {
    emits('blur');
};
</script>

<style></style>
