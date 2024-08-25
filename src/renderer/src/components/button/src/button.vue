<template>
    <button
        p="x-3 y-1.5"
        flex="inline row center"
        class="bdr reset h-max text-slate-950"
        :class="status === undefined ? 'bg-slate-200' : 'bg-' + getStatusColor(status, '300')"
        :size="size"
        :style="{ backgroundColor: color, cursor: loading ? 'wait' : '' }"
    >
        <span v-show="loading" flex="inline center" class="mr-1.5">
            <IconLoader2 size="1em" class="animate-spin"></IconLoader2>
        </span>
        <span class="flex items-center flex-nowrap min-w-0">
            <slot></slot>
        </span>
    </button>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import { IconLoader2 } from '@tabler/icons-vue';
import { getStatusColor } from '@contracts/component';
import type { ButtonProps } from '..';

// props
const props = defineProps<ButtonProps>();
const { status, size, color, loading } = toRefs(props);
</script>
