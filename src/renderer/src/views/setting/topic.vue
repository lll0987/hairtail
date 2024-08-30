<template>
    <Card>
        <template #title>主题</template>
        <template #form>
            <div grid="~ rows-1 cols-[auto_1fr_auto_auto]" items="center" gap="2">
                <ag-color-picker v-model="form.color"></ag-color-picker>
                <ag-input v-model="form.name" :label="false"></ag-input>
                <ag-button status="success" @click="handleAddOrUpdate">新增</ag-button>
                <ag-button @click="handleReset">重置</ag-button>
            </div>
        </template>
        <div flex="~ row wrap" items="center" gap="2">
            <dict
                v-for="item in topicList"
                :key="item.id"
                :item="item"
                @update="handleAddOrUpdate"
                @delete="handleDelete"
            ></dict>
        </div>
    </Card>
</template>

<script setup lang="ts">
import { reactive, toRaw } from 'vue';
import { ITag } from '@contracts/interface';
import { getDefaultColor, useTopic } from '@renderer/hooks';
import { AgButton, AgColorPicker, AgInput } from '@renderer/components';
import Card from './card.vue';
import dict from './dict';

const { topicList, refreshTopicList, addOrUpdateTopic, removeTopic } = useTopic();

const { backgroundColor } = getDefaultColor();
const init = (): ITag => ({ name: '', color: backgroundColor });
const form = reactive<ITag>(init());
const handleReset = () => {
    Object.assign(form, init());
};
const handleAddOrUpdate = async (tag?: ITag, callback?: () => void) => {
    const status = await addOrUpdateTopic(tag || toRaw(form));
    if (!status) return;
    refreshTopicList();
    callback?.();
};
const handleDelete = async (tag: ITag) => {
    const { id } = tag;
    if (!id) return refreshTopicList();
    const status = await removeTopic(id);
    if (status) refreshTopicList();
};
</script>
