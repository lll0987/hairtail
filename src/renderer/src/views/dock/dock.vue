<template>
    <div flex="~ col between-center" class="bdr-opacity border-r-2 gap-3 p-3">
        <ag-menu></ag-menu>
        <ag-theme></ag-theme>
    </div>
</template>

<script setup lang="ts">
import AgMenu from './menu.vue';
import AgTheme from './theme.vue';
</script>
