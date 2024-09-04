<template>
    <div flex="~ center" gap="4">
        <span>今天</span>
        <span>{{ date }}</span>
        <span>{{ day }}</span>
    </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';

const date = dayjs().format('YYYY-MM-DD');
const day = dayjs().format('dddd');
</script>
