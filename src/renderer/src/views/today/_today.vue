<template>
    <div grid auto-cols="12rem" auto-rows="12rem" grid-flow-col gap-1 px-4>
        <component
            :is="compat[type]"
            v-for="({ type, ...item }, index) in setting"
            :key="index"
            v-bind="item"
        ></component>
    </div>
</template>

<script setup lang="ts">
import { compat } from '.';
import { setting } from './_setting';
</script>
