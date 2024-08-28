<template>
    <div ref="canvasRef" class="w-full h-full overflow-hidden"></div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useResizeObserver, useThrottleFn } from '@vueuse/core';
import { PivotSheet } from '@antv/s2';
import { IEventRawData } from '@contracts/interface';
import { LightTheme } from './theme/light';
import { useCalendarState } from '../use-calendar-state';
import { useS2Options } from './use-s2-options';
import { useS2Config } from './use-s2-config';
import { useS2Scroll } from './use-s2-scroll';

// props & emits
const props = defineProps<{ data: IEventRawData[] }>();
const emits = defineEmits(['rendered']);
// s2
let s2: PivotSheet | null = null;
const initS2 = async () => {
    const dom = canvasRef.value as HTMLDivElement;
    const dataCfg = useS2Config(props.data);
    const options = useS2Options();
    s2 = new PivotSheet(dom, dataCfg, options);
    s2.setTheme(LightTheme);
    await s2.render();
    emits('rendered', s2);
    // 初始默认在今天
    useS2Scroll(s2, 'today');
};
watch(
    () => props.data,
    data => data?.length && initS2(),
    { immediate: true }
);
// reset options
const setOptions = async () => {
    if (!s2) return;
    const options = useS2Options();
    s2.setOptions(options, true);
    s2.changeSheetSize(options.width, options.height);
    await s2.render(false);
};
// resize
const { state } = useCalendarState();
const canvasRef = ref<HTMLDivElement | null>(null);
useResizeObserver(
    canvasRef,
    useThrottleFn(entries => {
        const { width, height } = entries[0].contentRect;
        state.width.client = width;
        state.height.client = height;
        setOptions();
    }, 300)
);

// Q: 按左侧/右侧配置项？
// 大尺寸缩小到小尺寸时，滚动位置会保持不变，即按最左侧位置，因此会有一部分右侧信息丢失
// 月份计算、滚动到日期同理
</script>

<style></style>
