<template>
    <div class="grid grid-cols-1 grid-rows-[1fr_260px] w-full h-full">
        <div class="p-16">
            <!-- NEXT 增加日期显示 -->
            <div v-for="(item, index) in records" :key="index">
                <div class="flex flex-row items-center justify-end w-full">
                    <div class="rounded max-w-full bg-cyan-700 text-white px-8 py-4">
                        {{ item.in }}
                    </div>
                </div>
                <div class="flex flex-row items-center justify-start w-full">
                    <div class="rounded max-w-full bg-white px-8 py-4">
                        <!-- eslint-disable-next-line vue/no-v-html -->
                        <div v-html="item.output"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-1 grid-rows-[1fr_auto] border-t-2 border-zinc-950 gap-8 py-8">
            <Editor v-model="text" @enter="handleSend"></Editor>
            <div class="flex flex-row items-center justify-end">
                <PrimaryButton class="mr-16" @click="handleSend">保存</PrimaryButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Editor from '../components/editor';
import PrimaryButton from '../components/button';

import { IRecord } from '@t/interface';
import { list } from '../api/record';
import { marked } from 'marked';

interface Record extends IRecord {
    output: string;
}
const records = ref<Record[]>([]);
const text = ref('');

const handleSend = async () => {
    if (!text.value) return;
    await window.electron.ipcRenderer.invoke('handleInput', text.value);
    const status = await getList();
    if (status) text.value = '';
};

const getList = async () => {
    const [msg, data] = await list();
    if (msg) {
        // NEXT 错误提示
        console.log(msg);
    } else if (data) {
        records.value = data.map((i: IRecord) => ({ ...i, output: marked(i.out) }));
    }
    return !msg;
};

onMounted(() => {
    getList();
});
</script>
