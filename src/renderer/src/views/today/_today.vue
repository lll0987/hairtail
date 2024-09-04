<template>
    <div grid="~ cols-5 rows-20 auto-flow-col-dense" class="gap-4 p-4 w-full h-full">
        <date class="col-span-4 row-span-1"></date>
        <event class="col-span-2 row-span-19"></event>
        <remind class="col-span-1 row-span-19"></remind>
        <pill class="col-span-1 row-span-3"></pill>
        <done grid="col-span-1 row-span-16"></done>
        <mood class="col-span-1 row-span-2"></mood>
        <sleep class="col-span-1 row-span-4"></sleep>
        <food grid="col-span-1 row-span-14"></food>
    </div>
</template>

<script setup lang="ts">
import Date from './date.vue';
import Done from './done.vue';
import Event from './event.vue';
import Food from './food.vue';
import Mood from './mood/mood.vue';
import Pill from './pill/pill.vue';
import Remind from './remind.vue';
import Sleep from './sleep/sleep.vue';
</script>
