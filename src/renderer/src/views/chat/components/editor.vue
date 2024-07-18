<template>
    <div ref="divRef">
        <textarea
            ref="textareaRef"
            class="w-full h-full resize-none block bg-transparent focus-within:outline-none"
            :rows="1"
            placeholder=""
            :value="modelValue"
            @input="onInput"
            @keydown="onKeydown"
        ></textarea>
        <!-- 字数 -->
        <!-- <span class="absolute bottom-0 right-12 text-stone-600">{{ modelValue.length }}</span> -->
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = withDefaults(defineProps<{ modelValue?: string }>(), {
    modelValue: ''
});
const emits = defineEmits(['update:modelValue', 'enter']);

const textareaValue = ref('');
const onValueChange = (value: string) => {
    textareaValue.value = value;
};

// const divRef = ref<HTMLDivElement | null>(null);
// const textareaRef = ref<HTMLTextAreaElement | null>(null);
// const handleAutoHeight = () => {
//     if (!textareaRef.value) return;
//     if (textareaValue.value) {
//         textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px';
//     } else {
//         textareaRef.value.style.height = 'auto';
//     }
// };

const onInput = (e: InputEvent | CompositionEvent | Event): void => {
    const targetValue = (e.target as HTMLTextAreaElement).value;
    onValueChange(targetValue);
    // handleAutoHeight();
    emits('update:modelValue', targetValue);
};

const onKeydown = (e: KeyboardEvent): void => {
    // NEXT ctrl + enter 换行
    // TODO 清除输入框中的回车
    // key='Control' 延时固定间隔后出现 enter
    if (e.key !== 'Enter') return;
    emits('enter');
};

onMounted(() => {
    if (props.modelValue) onValueChange(props.modelValue);
});
</script>

<style></style>
