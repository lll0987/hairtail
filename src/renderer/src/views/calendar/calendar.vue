<template>
    <div grid="~ cols-1 rows-[auto_1fr]" class="w-full h-full">
        <div class="flex items-center gap-1 p-1">
            <ag-button status="primary" @click="handleScroll('today')">回到今天</ag-button>
        </div>
        <chart :data="events" @rendered="handleS2"></chart>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { PivotSheet } from '@antv/s2';
import type { IEventRawData } from '@contracts/interface';
import { AgButton, useToast } from '@renderer/components';
import { useApi } from '@renderer/hooks';
import chart from './s2/canvas.vue';
import { DateShortcut, useS2Scroll } from './s2/use-s2-scroll';

let s2: PivotSheet | null = null;
const handleS2 = (value: PivotSheet) => {
    s2 = value;
};
const handleScroll = (date: DateShortcut) => {
    useS2Scroll(s2!, date);
};

const events = ref<IEventRawData[]>([]);
const toast = useToast();
const list = useApi('event', 'list:color');
const getList = async () => {
    const [msg, data] = await list();
    if (msg) toast.error(msg);
    else events.value = data as IEventRawData[];
};
onMounted(async () => {
    getList();
});
</script>
