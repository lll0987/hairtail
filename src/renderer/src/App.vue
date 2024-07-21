<template>
    <ToastProvider>
        <div class="w-screen h-screen flex flex-row bg-slate-100 text-slate-950">
            <div
                class="flex flex-col items-center justify-between gap-12 p-12 border-r-2 border-slate-300 border-opacity-70"
            >
                <AgMenu v-model:actived="actived" :routes="routes"></AgMenu>
                <AgTheme></AgTheme>
            </div>
            <div class="flex-1 w-full h-full">
                <component :is="activedComponent" />
            </div>
        </div>
    </ToastProvider>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import routes from '@renderer/router/routes';
import { AgMenu, AgTheme } from '@renderer/components';
import { ToastProvider } from '@renderer/components/toast';

const actived = ref('dashboard');
const activedComponent = computed(() => routes.find(i => i.key === actived.value)?.component);
</script>
