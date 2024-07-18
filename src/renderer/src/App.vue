<template>
    <ToastProvider>
        <div class="w-screen h-screen flex flex-row bg-slate-100 text-slate-950">
            <div
                class="flex flex-col items-center justify-between gap-12 p-12 border-r-2 border-slate-300 border-opacity-70"
            >
                <MainMenu v-model:actived="actived" :routes="routes"></MainMenu>
                <Theme></Theme>
            </div>
            <div class="flex-1 w-full h-full">
                <component :is="activedComponent" />
            </div>
        </div>
    </ToastProvider>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import routes from './router/routes';
import MainMenu from './components/menu';
import Theme from './components/theme';
import { ToastProvider } from './components/toast';

const actived = ref('dashboard');
const activedComponent = computed(() => routes.find(i => i.key === actived.value)?.component);
</script>
