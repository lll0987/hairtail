<!-- NEXT chat 增加日期显示 -->
<template>
    <div grid="~ cols-1 rows-[1fr_auto]" class="w-full h-full">
        <div ref="listRef" class="p-4 overflow-y-auto">
            <div v-for="(item, index) in records" :key="index">
                <div flex="~ row" items="center" w="full" class="justify-end py-3">
                    <div
                        p="x-4 y-1.5"
                        bg="slate-950"
                        text="slate-200"
                        rounded="3xl br-none"
                        class="max-w-[90%]"
                    >
                        {{ item.in }}
                    </div>
                </div>
                <div flex="~ row" items="center" w="full" class="justify-start">
                    <out-item :item="item" @accept="handleAccept" @ignore="handleIgnore"></out-item>
                </div>
            </div>
        </div>
        <div class="h-[260px] px-4 py-2">
            <div grid="~ cols-1 rows-[1fr_auto]" class="gap-2 p-4 h-full bdr rounded-3xl">
                <Editor v-model="text" @enter="handleSend"></Editor>
                <div class="flex flex-row items-center justify-end">
                    <ag-button status="primary" :loading="sendLoading" @click="handleSend">发送</ag-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import { useScroll, useThrottleFn } from '@vueuse/core';

import type { IRecord } from '@contracts/interface';
import { useBaseApi } from '@renderer/hooks';
import { useChatApi } from './use-chat-api';

import { AgButton, useToast } from '@renderer/components';
import Editor from './wangeditor';
import OutItem from './out-item';

import 'highlight.js/styles/an-old-hope.min.css';

const toast = useToast();
const listRef = ref<HTMLDivElement | null>(null);
const { y } = useScroll(listRef, { behavior: 'smooth' });

const records = ref<IRecord[]>([]);
const { list } = useBaseApi<IRecord>('record');
const getList = async () => {
    const [msg, data] = await list();
    if (msg) toast.error(msg);
    else records.value = data;
    // 滚动到最下方
    await nextTick();
    y.value = listRef.value?.scrollHeight ?? 0;
    return !msg;
};
onMounted(async () => {
    await getList();
});

const { accept, ignore, send, sendLoading } = useChatApi(async () => {
    const status = await getList();
    if (status) text.value = '';
});
const text = ref('');
const handleSend = useThrottleFn(async () => {
    if (sendLoading.value) return;
    if (!text.value) return toast.warning('对话内容不可为空');
    const msg = await send(text.value);
    if (msg) toast.error(msg);
    getList();
}, 1000);

const handleAccept = async (item: IRecord) => {
    const id = item.id as string;
    const msg = await accept(id);
    if (msg) return toast.error(msg);
    getList();
};

const handleIgnore = async (item: IRecord) => {
    const id = item.id as string;
    const msg = await ignore(id);
    if (msg) return toast.error(msg);
    getList();
};

// NEXT chat 复制：自动添加到输入框然后调用忽略方法
</script>

<style>
pre {
    margin-bottom: 10px;
}
code {
    border-radius: 0.25rem;
}
</style>
