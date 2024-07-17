<template>
    <div ref="canvasRef" class="w-full h-full overflow-hidden"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { PivotSheet, S2Event } from '@antv/s2';
import { debounce } from 'lodash';

import { initOptions, useOptions } from '../hooks/useOptions';
import { useScroll, SHORTCUT } from '../hooks/useScroll';
import { LightTheme } from './theme/light';

import { IEvent } from '@t/interface';

const props = defineProps<{ data: IEvent[] }>();
const canvasRef = ref<HTMLDivElement | null>(null);
let s2: PivotSheet | null = null;

// 滚动到日期
// TODO 从本周第一天开始
const handleScrollToDate = (date: SHORTCUT | string) => {
    if (!s2) return;
    useScroll(s2, date);
};
defineExpose({ handleScrollToDate });

// 尺寸自适应
const handleResize = debounce(async (width: number, height: number) => {
    if (!s2) return;
    const options = initOptions(width, height);
    s2.setOptions(options, true);
    s2.changeSheetSize(width, height);
    await s2.render(false);
}, 300);

const resizeObserver = new ResizeObserver(([entry] = []) => {
    const [size] = entry.borderBoxSize || [];
    handleResize(size.inlineSize, size.blockSize);
});

// 初始化图表
const initS2 = async () => {
    const container = canvasRef.value as HTMLDivElement;
    const { clientWidth: width, clientHeight: height } = container;

    // 生成配置
    const { dataConfig, options } = useOptions(width, height, props.data);

    // 创建图像
    s2 = new PivotSheet(container, dataConfig, options);
    s2.setTheme(LightTheme);
    await s2.render();

    // 初始默认在今天
    handleScrollToDate(SHORTCUT.TODAY);

    // 监听尺寸变化
    resizeObserver.observe(container);
    s2.on(S2Event.LAYOUT_DESTROY, () => {
        resizeObserver.disconnect();
    });
};

// RE 按左侧/右侧配置项？
// 大尺寸缩小到小尺寸时，滚动位置会保持不变，即按最左侧位置，因此会有一部分右侧信息丢失
// 月份计算、滚动到日期同理

onMounted(() => {
    if (props.data?.length) initS2();
});

watch(
    () => props.data,
    data => {
        if (data?.length) initS2();
    }
);
</script>

<style></style>
