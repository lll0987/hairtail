<template>
    <i class="w-[1em] h-[1em] leading-[1em] text-center inline-block" :style="styles">
        <slot></slot>
    </i>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ size: number | string; color?: string }>();

const styles = computed(() => ({
    'font-size': typeof props.size === 'string' ? props.size : `${props.size}px`
}));
</script>
