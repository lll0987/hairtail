<template>
    <div flex="~ center" cursor="pointer" @click="() => updateMode()">
        <icon-moon v-if="mode === 'dark'" size="32px"></icon-moon>
        <icon-sun v-else size="32px"></icon-sun>
    </div>
</template>

<script setup lang="ts">
import { IconSun, IconMoon } from '@tabler/icons-vue';
import { mode, updateMode } from '@renderer/store';
</script>
