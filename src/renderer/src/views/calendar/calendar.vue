<template>
    <div class="w-full h-full grid grid-rows-[auto_1fr] grid-cols-1">
        <div class="flex py-8">
            <PrimaryButton type="primary" size="large" class="ml-6" @click="handleScroll(SHORTCUT.TODAY)">
                回到今天
            </PrimaryButton>
        </div>
        <chart ref="chartRef" :data="data"></chart>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SHORTCUT } from './hooks/useScroll';
import PrimaryButton from '../../components/button';
import chart from './s2/canvas.vue';
import data from '../../data';

const chartRef = ref<InstanceType<typeof chart> | null>(null);

// 滚动到日期
const handleScroll = (date: SHORTCUT | string) => {
    chartRef.value?.handleScrollToDate(date);
};
</script>
