<template>
    <div class="grid grid-cols-1 grid-rows-[1fr_auto] w-full h-full">
        <div class="p-16 overflow-y-auto">
            <!-- NEXT 增加日期显示 -->
            <div v-for="(item, index) in records" :key="index">
                <div class="flex flex-row items-center justify-end w-full py-12">
                    <div class="rounded-3xl max-w-[90%] rounded-tr-none bg-slate-950 text-slate-200 px-16 py-6">
                        {{ item.in }}
                    </div>
                </div>
                <div class="flex flex-row items-center justify-start w-full">
                    <Item :item="item" @accept="handleAccept" @ignore="handleIgnore"></Item>
                </div>
            </div>
        </div>
        <div class="h-260 short:h-150 px-16 py-8">
            <div
                class="h-full grid grid-cols-1 grid-rows-[1fr_auto] gap-8 p-16 short:p-12 border-2 border-slate-800 rounded-3xl"
            >
                <Editor v-model="text" @enter="handleSend"></Editor>
                <div class="flex flex-row items-center justify-end">
                    <IButton type="primary" size="large" @click="handleSend">保存</IButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { IRecord } from '@t/interface';
import { list } from '@renderer/api/record';

import Item from './components/item';
import Editor from './components/editor.vue';
import IButton from '@renderer/components/button';
import { useToast } from '@renderer/components/toast';

const toast = useToast();

const records = ref<IRecord[]>([]);
const getList = async () => {
    // TODO 滚动到最下方
    const [msg, data] = await list();
    if (msg) {
        toast.error(msg);
    } else {
        records.value = data;
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

<style>
pre {
    margin-bottom: 10px;
}
code {
    border-radius: 0.25rem;
}
</style>
