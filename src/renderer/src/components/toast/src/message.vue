<template>
    <div
        class="bg-zinc-800 bg-opacity-85 rounded-lg border max-w-[80vw] flex items-center p-8 gap-8"
        :style="{ borderColor: color }"
    >
        <icon :size="22" :style="{ color: color }"><component :is="iconComponent" /></icon>
        <p class="text-slate-50 flex-1 flex items-center justify-center flex-wrap mr-8">{{ message }}</p>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import colors from 'tailwindcss/colors';

import { MessageProps, MessageType } from './types';

import icon from '../../icon';
import {
    CheckmarkCircle24Filled,
    DismissCircle24Filled,
    ErrorCircle24Filled,
    Info24Filled
} from '@vicons/fluent';

const props = withDefaults(defineProps<MessageProps>(), { type: 'info' });

// 颜色
const colorMap: Record<MessageType, string> = {
    info: colors.sky[400],
    success: colors.green[400],
    warning: colors.yellow[400],
    error: colors.rose[400]
};
const color = computed(() => colorMap[props.type]);

// 图标
const IconMap = {
    info: Info24Filled,
    success: CheckmarkCircle24Filled,
    warning: ErrorCircle24Filled,
    error: DismissCircle24Filled
};
const iconComponent = computed(() => IconMap[props.type]);

// 消息内容
const message = computed(() => props.message);
</script>
