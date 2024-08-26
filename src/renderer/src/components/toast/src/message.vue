<template>
    <div
        bg="zinc-950 opacity-80"
        class="rounded-lg border max-w-[80vw] flex items-center gap-2 px-2 py-1.5"
        :class="`border-${color}`"
    >
        <i flex="~ center" h="full" :class="`text-${color}`">
            <component :is="iconComponent" size="1.25rem" />
        </i>
        <p flxe="1 ~ center wrap" class="text-slate-50 mr-1">{{ message }}</p>
    </div>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue';
import {
    IconAlertCircleFilled,
    IconCircleCheckFilled,
    IconCircleXFilled,
    IconInfoCircleFilled
} from '@tabler/icons-vue';
import type { MessageProps } from '..';
import { getStatusColor } from '@contracts/component';

const props = defineProps<MessageProps>();
// message
const message = toRef(props, 'message');
// color
const color = computed(() => {
    const { status } = props;
    if (status === undefined) return getStatusColor('accent', '400');
    return getStatusColor(status, '400');
});
// icon
const IconMap = {
    success: IconCircleCheckFilled,
    warning: IconAlertCircleFilled,
    error: IconCircleXFilled
} as const;
const iconComponent = computed(() => {
    const { status } = props;
    if (status === undefined) return IconInfoCircleFilled;
    return IconMap[status];
});
</script>
