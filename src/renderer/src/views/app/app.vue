<template>
    <toast-provider>
        <div
            bg="slate-100 dark:neutral-700"
            text="slate-950 dark:white"
            flex="~ row"
            class="w-screen h-screen"
        >
            <dock></dock>
            <div class="flex-1 w-full h-full">
                <component :is="activedComponent" />
            </div>
        </div>
    </toast-provider>
</template>

<script setup lang="ts">
import { activedComponent } from '@renderer/router';
import { ToastProvider } from '@renderer/components';
import Dock from './dock';
</script>
