<template>
    <field :label="props.label">
        <input
            type="text"
            class="w-full min-h-[auto] bg-transparent border-0 outline-none peer placeholder:text-gray-600"
            :placeholder="placeholder"
            :value="modelValue"
            @input="onInput"
        />
    </field>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { InputProps } from './types';
import Field from './field.vue';

const props = withDefaults(defineProps<InputProps>(), { modelValue: '', label: '文本' });
const emits = defineEmits(['update:modelValue']);

const placeholder = computed(() => '请输入' + props.label);

const inputValue = ref<string | null>(props.modelValue);
const onValueChange = (value: string) => {
    inputValue.value = value;
    emits('update:modelValue', value);
};

const onInput = (e: InputEvent | CompositionEvent | Event): void => {
    const targetValue = (e.target as HTMLInputElement).value;
    onValueChange(targetValue);
};

watch(
    () => props.modelValue,
    value => {
        if (value === inputValue.value) return;
        onValueChange(value);
    }
);
</script>

<style></style>
