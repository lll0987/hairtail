<template>
    <div class="grid grid-cols-1 grid-rows-[1fr_auto] w-full h-full">
        <div ref="listRef" class="p-16 overflow-y-auto">
            <!-- NEXT 增加日期显示 -->
            <div v-for="(item, index) in records" :key="index">
                <div class="flex flex-row items-center justify-end w-full py-12">
                    <div
                        class="rounded-3xl max-w-[90%] rounded-tr-none bg-slate-950 text-slate-200 px-16 py-6"
                    >
                        {{ item.in }}
                    </div>
                </div>
                <div class="flex flex-row items-center justify-start w-full">
                    <OutItem v-bind="item"></OutItem>
                </div>
            </div>
        </div>
        <div class="h-260 short:h-150 px-16 py-8">
            <div
                class="h-full grid grid-cols-1 grid-rows-[1fr_auto] gap-8 p-16 short:p-12 border-2 border-slate-800 rounded-3xl"
            >
                <Editor v-model="text" @enter="handleEnter"></Editor>
                <div class="flex flex-row items-center justify-end">
                    <AgButton type="primary" :loading="sendLoading" @click="handleSend">发送</AgButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { h, nextTick, onMounted, ref } from 'vue';
import { debounce } from 'lodash';

import { RecordStatus } from '@t/enum';
import { IRecord } from '@t/interface';
import { list } from '@renderer/api/record';

import { AgButton, AgLoading, AgTitle, useToast } from '@renderer/components';
import Editor from './wangeditor';

import marked from './marked';
import 'highlight.js/styles/an-old-hope.min.css';

const toast = useToast();

const listRef = ref<HTMLDivElement | null>(null);
const records = ref<IRecord[]>([]);
const getList = async () => {
    const [msg, data] = await list();
    if (msg) {
        toast.error(msg);
    } else {
        records.value = data;
    }
    // 滚动到最下方
    nextTick(() => {
        listRef.value?.scrollTo({ top: listRef.value?.scrollHeight, behavior: 'smooth' });
    });
    return !msg;
};

onMounted(async () => {
    await getList();
});

const text = ref('');

const sendLoading = ref(false);
const handleSend = async () => {
    if (sendLoading.value) return;
    if (!text.value) {
        toast.warning('对话内容不可为空');
        return;
    }
    sendLoading.value = true;
    // NEXT 增加 loading
    const msg = await window.electron.ipcRenderer.invoke('handleInput', text.value);
    if (msg) toast.error(msg);
    getList();
};
window.electron.ipcRenderer.on('insert-record-success', async () => {
    const status = await getList();
    if (status) text.value = '';
    sendLoading.value = false;
});

const handleEnter = debounce(() => {
    handleSend();
}, 1000);

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

const classes = [
    'max-w-[90%]',
    'px-16',
    'py-6',
    'rounded-3xl',
    'rounded-tl-none',
    'border-slate-800',
    'border-2'
];
const BG = 'bg-white';
const ACCEPT_BG = 'bg-green-300';
const IGNORE_BG = 'bg-slate-300';
const FONT_WEIGHT = 'font-semibold';

const OutItem = (item: IRecord) => {
    const { status, out } = item;

    // 等待外部 api 结果
    if (status === RecordStatus.SEND)
        return h(
            'div',
            { class: [...classes, BG] },
            h('div', { class: ['flex', 'items-center'] }, [
                h(AgLoading, { size: 24, class: 'mr-6' }),
                h('span', { class: FONT_WEIGHT }, '转换中')
            ])
        );

    // 等待用户接受/忽略
    if (status === RecordStatus.WAITING)
        return h('div', { class: [...classes, BG] }, [
            h(
                'div',
                {
                    class: [
                        'grid',
                        'grid-rows-1',
                        'grid-cols-[1fr_auto_auto]',
                        'gap-8',
                        'items-center',
                        'py-10'
                    ]
                },
                [
                    h(AgTitle, () => '转换结果'),
                    h(
                        AgButton,
                        {
                            type: 'success',
                            size: 'small',
                            onClick: () => handleAccept(item)
                        },
                        () => '接受'
                    ),
                    h(AgButton, { size: 'small', onClick: () => handleIgnore(item) }, () => '忽略')
                ]
            ),
            h('div', { innerHTML: marked(out) })
        ]);

    // NEXT 收起展开结果
    // 已接受
    if (status === RecordStatus.ACCEPT)
        return h('div', { class: [...classes, ACCEPT_BG, FONT_WEIGHT] }, '已接受');
    // 已忽略
    if (status === RecordStatus.IGNORE)
        return h('div', { class: [...classes, IGNORE_BG, FONT_WEIGHT] }, '已忽略');

    return h('div', { class: [...classes, BG] }, out);
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
