<template>
    <div class="grid grid-cols-1 grid-rows-[1fr_260px] w-full h-full">
        <div class="p-16 overflow-y-auto">
            <!-- NEXT 增加日期显示 -->
            <div v-for="(item, index) in records" :key="index">
                <div class="flex flex-row items-center justify-end w-full">
                    <div class="rounded max-w-full bg-zinc-800 text-white px-10 py-4">
                        {{ item.in }}
                    </div>
                </div>
                <div class="flex flex-row items-center justify-start w-full">
                    <div class="rounded max-w-full bg-white px-10 py-6">
                        <div v-if="item.status === SEND_STATUS" class="flex items-center">
                            <LoadingIcon :size="24" class="mr-6"></LoadingIcon>
                            <span class="font-semibold">转换中</span>
                        </div>
                        <div v-else>
                            <span class="font-semibold ml-2">转化结果：</span>
                            <!-- NEXT 收起展开结果 -->
                            <div
                                v-if="item.status === ACCEPT_STATUS"
                                class="bg-lime-600 bg-opacity-15 text-lime-600 rounded py-4 px-10 my-4"
                            >
                                已接受
                            </div>
                            <div
                                v-if="item.status === IGNORE_STATUS"
                                class="bg-slate-500 bg-opacity-15 text-slate-600 rounded py-4 px-10 my-4"
                            >
                                已忽略
                            </div>
                            <!-- eslint-disable-next-line vue/no-v-html -->
                            <div v-html="item.output"></div>
                        </div>
                        <div
                            v-if="item.status === WAIT_STATUS"
                            class="flex flex-row items-center justify-end"
                        >
                            <PrimaryButton
                                type="success"
                                size="small"
                                class="ml-8"
                                @click="handleAccept(item)"
                            >
                                接受
                            </PrimaryButton>
                            <PrimaryButton size="small" class="ml-8" @click="handleIgnore(item)">
                                忽略
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-1 grid-rows-[1fr_auto] border-t-2 border-zinc-300 gap-8 py-8">
            <Editor v-model="text" @enter="handleSend"></Editor>
            <div class="flex flex-row items-center justify-end">
                <PrimaryButton type="primary" size="large" class="mr-16" @click="handleSend">
                    保存
                </PrimaryButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Editor from '../components/editor';
import PrimaryButton from '../components/button';
import { useToast } from '../components/toast';
import LoadingIcon from '../components/loading';

import { RecordStatus } from '@t/enum';
import { IRecord } from '@t/interface';
import { list } from '../api/record';
import { marked } from 'marked';

const SEND_STATUS = RecordStatus.SEND;
const WAIT_STATUS = RecordStatus.WAITING;
const ACCEPT_STATUS = RecordStatus.ACCEPT;
const IGNORE_STATUS = RecordStatus.IGNORE;

const toast = useToast();

interface Record extends IRecord {
    output: string | Promise<string>;
}
const records = ref<Record[]>([]);
const getList = async () => {
    // TODO 滚动到最下方
    const [msg, data] = await list();
    if (msg) {
        toast.error(msg);
    } else {
        records.value = data.map((i: IRecord) => ({ ...i, output: marked(i.out) }));
    }
    return !msg;
};

onMounted(async () => {
    await getList();
});

const text = ref('');

const handleSend = async () => {
    if (!text.value) {
        toast.warning('对话内容不可为空');
        return;
    }
    // TODO 增加 loading
    const msg = await window.electron.ipcRenderer.invoke('handleInput', text.value);
    if (msg) {
        toast.error(msg);
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
        toast.error(msg);
        return;
    }
    getList();
};

const handleIgnore = async (item: IRecord) => {
    const id = item.id as string;
    const msg = await window.electron.ipcRenderer.invoke('handleIgnore', id);
    if (msg) {
        toast.error(msg);
        return;
    }
    getList();
};

// NEXT 复制：自动添加到输入框然后调用忽略方法
</script>
