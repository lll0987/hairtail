<template>
    <div class="w-full h-full grid grid-rows-[auto_1fr] grid-cols-1">
        <div class="flex py-8">
            <PrimaryButton type="primary" size="large" class="ml-6" @click="handleScroll(SHORTCUT.TODAY)">
                回到今天
            </PrimaryButton>
        </div>
        <chart ref="chartRef" :data="events"></chart>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { SHORTCUT } from './hooks/useScroll';
import chart from './s2/canvas.vue';
import PrimaryButton from '@renderer/components/button';

import { useToast } from '@renderer/components/toast';
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
