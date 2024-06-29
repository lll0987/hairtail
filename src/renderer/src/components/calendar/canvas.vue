<template>
    <div class="w-full h-full grid grid-rows-[auto_1fr] grid-cols-1 gap-8">
        <bar @scroll="handleScroll"></bar>
        <div ref="canvasRef" class="w-full h-full"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { PivotSheet } from '@antv/s2';

import { IEvent } from '@t/interface';

import bar from './bar.vue';

import { useOptions } from './hooks/useOptions';
import { useScroll, SHORTCUT } from './hooks/useScroll';

import { LightTheme } from './theme/light';

const props = defineProps<{ data: IEvent[] }>();
const canvasRef = ref<HTMLDivElement | null>(null);
let s2: PivotSheet | null = null;

const handleScroll = (date: SHORTCUT | string) => {
    if (!s2) return;
    useScroll(s2, date);
};

onMounted(async () => {
    const container = canvasRef.value as HTMLDivElement;
    const { clientWidth: width, clientHeight: height } = container;

    const { dataConfig, options } = useOptions(width, height, props.data);

    // 创建图像
    s2 = new PivotSheet(container, dataConfig, options);
    s2.setTheme(LightTheme);
    await s2.render();

    // 初始默认在今天
    handleScroll(SHORTCUT.TODAY);
});
</script>

<style></style>
