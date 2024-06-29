<template>
    <div class="grid">
        <button class="w-100" @click="handleScroll(SHORTCUT.TODAY)">回到今天</button>
    </div>
</template>

<script setup lang="ts">
import { SHORTCUT } from './hooks/useScroll';

const emits = defineEmits(['scroll']);

const handleScroll = (date: SHORTCUT | string) => {
    emits('scroll', date);
};
</script>
