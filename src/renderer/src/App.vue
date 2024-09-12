<template>
    <div :class="mode">
        <App />
    </div>
</template>

<script setup lang="ts">
import App from '@renderer/views/app';
import { useModeStore } from '@renderer/store';
const { mode } = useModeStore();
</script>
