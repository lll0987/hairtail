<template>
    <div class="flex">
        <PrimaryButton type="primary" size="large" class="ml-6" @click="handleScroll(SHORTCUT.TODAY)">
            回到今天
        </PrimaryButton>
    </div>
</template>

<script setup lang="ts">
import { SHORTCUT } from './hooks/useScroll';
import PrimaryButton from '../button';

const emits = defineEmits(['scroll']);

const handleScroll = (date: SHORTCUT | string) => {
    emits('scroll', date);
};
</script>
