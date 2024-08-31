<template>
    <button
        flex="inline row center"
        class="bdr-all reset h-max font-semibold"
        :class="[
            'bg-' + (status ? getStatusColor(status, '300') : 'slate-200'),
            'btn-' + (size || 'default')
        ]"
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
