<template>
    <div grid="~ cols-12" gap-1 px-4>
        <component
            :is="compat[type]"
            v-for="({ type, ...item }, index) in setting"
            :key="index"
            v-bind="item"
            rounded-3xl
        ></component>
    </div>
</template>

<script setup lang="ts">
import { WPill, WSleep } from '@renderer/widgets';
import { setting } from './_setting';

const compat = {
    pill: WPill,
    sleep: WSleep
} as const;
</script>
