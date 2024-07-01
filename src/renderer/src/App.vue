<template>
    <div
        class="w-screen h-screen grid grid-cols-[auto_1fr] grid-rows-1 bg-neutral-100 text-zinc-950"
    >
        <MainMenu v-model:actived="actived" :routes="routes"></MainMenu>
        <div class="w-full h-full border-l-2 border-zinc-950">
            <component :is="activedComponent" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import MainMenu from './components/menu/menu.vue';
import routes from './router/routes';

const actived = ref('input');
const activedComponent = computed(() => routes.find(i => i.key === actived.value)?.component);
</script>
