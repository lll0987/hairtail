<template>
    <Card>
        <template #title>提醒</template>
        <template #form>
            <div flex="~ wrap" items="center" gap="2">
                <ag-input v-model="form.msg" label="提醒内容"></ag-input>
                <ag-select v-model="form.tag" label="标签" :options="tagOptions"></ag-select>
                <ag-cron-picker v-model="cron" label="规则"></ag-cron-picker>
                <ag-button status="primary" @click="handleAdd">新增</ag-button>
                <ag-button @click="handleReset">重置</ag-button>
            </div>
        </template>
        <div grid="~ cols-[auto_1fr]" items="center" gap="2">
            <template v-for="item in crons" :key="item.id">
                <span>{{ item.msg }}</span>
                <span>{{ item.label }}</span>
            </template>
        </div>
    </Card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRaw } from 'vue';
import { ICron } from '@contracts/interface';
import { useBaseApi, useTag } from '@renderer/hooks';
import {
    AgButton,
    AgCronPicker,
    AgInput,
    AgSelect,
    getCronLabel,
    parseCron,
    useToast
} from '@renderer/components';
import Card from './card.vue';

const { tagOptions } = useTag();

type TCron = ICron & { label: string };
const crons = ref<TCron[]>([]);

const toast = useToast();
const { list, add } = useBaseApi('cron');
const getList = async () => {
    const [msg, data] = await list();
    if (msg) toast.error(msg);
    crons.value = data.map(item => {
        const { fields: s } = parseCron(item.start);
        const { fields: e } = parseCron(item.end);
        const label = getCronLabel(s, e);
        return { ...item, label };
    });
};
onMounted(() => {
    getList();
});

const form = reactive({ msg: '', tag: '' });
const cron = ref({ start: '', end: '' });
const handleReset = () => {
    form.msg = '';
    form.tag = '';
    cron.value.start = '';
    cron.value.end = '';
};
const handleAdd = async () => {
    const [msg] = await add({ ...toRaw(form), ...cron.value });
    if (msg) toast.error(msg);
    else getList();
};
</script>
