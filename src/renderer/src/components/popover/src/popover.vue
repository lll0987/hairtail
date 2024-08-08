<template>
    <div class="fixed top-0 left-0 pointer-events-none z-auto" :style="{ zIndex }">
        <div
            v-show="show"
            class="absolute top-0 left-0 right-0 h-0 pointer-events-none"
            :style="positionStyle"
        >
            <div
                class="scrollbar-small pointer-events-auto w-max max-w-[80vw] max-h-200 overflow-y-auto p-6 bg-white border-slate-800 border-2 rounded-lg"
                :style="sizeStyle"
            >
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, toRef } from 'vue';
import { useZIndex } from '@renderer/hooks';
import { PopoverProps } from '..';
import { usePopoverSize } from './use-size';
import { usePopoverPosition } from './use-position';

const props = defineProps<PopoverProps>();

// 显示隐藏
const show = toRef(props, 'show');

// 层级
const { nextZIndex } = useZIndex();
const zIndex = ref(nextZIndex());
// 位置
const positionStyle = usePopoverPosition();
// 尺寸
const sizeStyle = usePopoverSize();
</script>
