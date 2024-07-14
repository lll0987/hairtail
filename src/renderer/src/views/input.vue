<template>
    <div class="grid grid-cols-1 grid-rows-[1fr_260px] w-full h-full">
        <div class="p-16 overflow-y-auto">
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
                        <div
                            v-if="item.status === WAIT_STATUS"
                            class="flex flex-row items-center justify-end"
                        >
                            <PrimaryButton class="ml-8" @click="handleAccept(item)">接受</PrimaryButton>
                            <PrimaryButton class="ml-8" @click="handleIgnore(item)">忽略</PrimaryButton>
                        </div>
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

import { RecordStatus } from '@t/enum';
import { IRecord } from '@t/interface';
import { list } from '../api/record';
import { marked } from 'marked';

const WAIT_STATUS = RecordStatus.WAITING;

interface Record extends IRecord {
    output: string;
}
const records = ref<Record[]>([]);
const getList = async () => {
    const [msg, data] = await list();
    if (msg) {
        // NEXT 错误提示
        console.log(msg);
    } else {
        records.value = data.map((i: IRecord) => ({ ...i, output: marked(i.out) }));
    }
    return !msg;
};

onMounted(() => {
    getList();
});

const text = ref('');

const handleSend = async () => {
    if (!text.value) {
        console.log('对话内容不可为空');
        return;
    }
    const msg = await window.electron.ipcRenderer.invoke('handleInput', text.value);
    if (msg) {
        console.log(msg);
        return;
    }
    getList();
};
window.electron.ipcRenderer.on('insert-record-success', async () => {
    const status = await getList();
    if (status) text.value = '';
});

const handleAccept = async (item: IRecord) => {
    const id = item.id as string;
    const msg = await window.electron.ipcRenderer.invoke('handleAccept', id);
    if (msg) {
        console.log(msg);
        return;
    }
    getList();
};

const handleIgnore = async (item: IRecord) => {
    const id = item.id as string;
    const msg = await window.electron.ipcRenderer.invoke('handleIgnore', id);
    if (msg) {
        console.log(msg);
        return;
    }
    getList();
};

// NEXT 复制：自动添加到输入框然后调用忽略方法
</script>
