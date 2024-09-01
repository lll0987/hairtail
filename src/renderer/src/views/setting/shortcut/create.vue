<template>
    <div flex="~ wrap" items="center" gap="2">
        <ag-input v-model="form.label" label="提示词"></ag-input>

        <ag-select v-model="form.value.tags" :options="tagOptions" label="标签" multiple></ag-select>
        <ag-select v-model="form.value.topic" :options="topicOptions" label="主题"></ag-select>
        <ag-input v-model="form.val" label="数值" parse="number"></ag-input>
        <ag-input v-model="form.value.text" label="其他信息"></ag-input>

        <ag-button status="primary" @click="handleCreate">新增</ag-button>
        <ag-button @click="handleReset">重置</ag-button>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { ISetting } from '@contracts/interface';
import { useBaseApi, useTag, useTopic } from '@renderer/hooks';
import { AgButton, AgInput, AgSelect, useToast } from '@renderer/components';

const { tagOptions } = useTag();
const { topicOptions } = useTopic();

type TSetting = ISetting & { val?: string };
const initForm = (): TSetting => ({ label: '', value: { tags: [], topic: '', text: '' }, val: '' });

const form = reactive(initForm());
const handleReset = () => {
    Object.assign(form, initForm());
};

const emits = defineEmits(['refresh']);
const toast = useToast();
const { add } = useBaseApi<ISetting>('setting');
const getSettingItem = () => {
    const { label, value, val } = form;
    const item: ISetting = { label, value: {} };
    if (value.tags?.length) item.value.tags = value.tags;
    if (value.topic) item.value.topic = value.topic;
    if (val) item.value.value = Number(value.value);
    if (value.text) item.value.text = value.text;
    return item;
};
const handleCreate = async () => {
    const item = getSettingItem();
    if (!item.label || !Object.keys(item.value).length) return;
    const [msg] = await add(item);
    if (msg) toast.error(msg);
    emits('refresh');
};
</script>
