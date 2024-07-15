<template>
    <div
        class="bg-neutral-800 bg-opacity-85 rounded-lg border max-w-[80%] p-8 flex items-center gap-8"
        :style="{ borderColor: color }"
    >
        <div class="h-full flex items-start" :style="{ color: color }">
            <icon :size="24"><component :is="iconComponent" /></icon>
        </div>
        <div class="text-neutral-50 flex-1 flex-wrap pr-4">{{ message }}</div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import colors from 'tailwindcss/colors';

import { MessageProps, MessageType } from './types';

import icon from '../icon';
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
    error: colors.red[500]
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
