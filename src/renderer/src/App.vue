<template>
    <div class="w-screen h-screen">
        <calendar :data="data"></calendar>
    </div>
</template>

<script setup lang="ts">
import calendar from './components/calendar';

import data from './data';
</script>

<style></style>
