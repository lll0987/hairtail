<template>
    <div :class="mode">
        <App />
    </div>
</template>

<script setup lang="ts">
import App from '@renderer/views/app';
import { mode } from '@renderer/store';
</script>
