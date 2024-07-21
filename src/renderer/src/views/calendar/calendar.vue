<template>
    <div class="w-full h-full grid grid-rows-[auto_1fr] grid-cols-1">
        <div class="flex items-center justify-start gap-8 p-8">
            <AgButton type="primary" size="large" @click="handleScroll(SHORTCUT.TODAY)">回到今天</AgButton>
        </div>
        <chart ref="chartRef" :data="events"></chart>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { SHORTCUT } from './hooks/useScroll';
import chart from './s2/canvas.vue';
import { AgButton, useToast } from '@renderer/components';

import { listWithColor } from '@renderer/api/event';
import { EventRawData } from '@t/interface';

const chartRef = ref<InstanceType<typeof chart> | null>(null);
// 滚动到日期
const handleScroll = (date: SHORTCUT | string) => {
    chartRef.value?.handleScrollToDate(date);
};

const toast = useToast();
const events = ref<EventRawData[]>([]);
const getList = async () => {
    const [msg, data] = await listWithColor();
    if (msg) {
        toast.error(msg);
    } else {
        events.value = data;
    }
};

onMounted(async () => {
    getList();
});
</script>
