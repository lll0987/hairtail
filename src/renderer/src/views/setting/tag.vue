<template>
    <Card>
        <template #title>标签</template>
        <template #form>
            <div grid="~ rows-1 cols-[auto_auto_1fr_auto_auto]" items="center" gap="2">
                <ag-color-picker v-model="form.color"></ag-color-picker>
                <ag-color-picker v-model="form.c2"></ag-color-picker>
                <ag-input v-model="form.name" :label="false"></ag-input>
                <ag-button status="primary" @click="() => handleAddOrUpdate()">新增</ag-button>
                <ag-button @click="handleReset">重置</ag-button>
            </div>
        </template>
        <div flex="~ row wrap" items="center" gap="2">
            <dict
                v-for="item in tagList"
                :key="item.id"
                :item="item"
                accent
                @update="handleAddOrUpdate"
                @delete="handleDelete"
            ></dict>
        </div>
    </Card>
</template>

<script setup lang="ts">
import { reactive, toRaw } from 'vue';
import { ITag } from '@contracts/interface';
import { getDefaultColor, useTag } from '@renderer/hooks';
import { AgButton, AgColorPicker, AgInput } from '@renderer/components';
import Card from './card.vue';
import dict from './dict';

const { tagList, refreshTagList, addOrUpdateTag, removeTag } = useTag();

const { backgroundColor, color } = getDefaultColor();
const init = (): ITag => ({ name: '', color: backgroundColor, c2: color });
const form = reactive<ITag>(init());
const handleReset = () => {
    Object.assign(form, init());
};
const handleAddOrUpdate = async (tag?: ITag, callback?: () => void) => {
    const status = await addOrUpdateTag(tag || toRaw(form));
    if (!status) return;
    refreshTagList();
    callback?.();
};
const handleDelete = async (tag: ITag) => {
    const { id } = tag;
    if (!id) return refreshTagList();
    const status = await removeTag(id);
    if (status) refreshTagList();
};
</script>
