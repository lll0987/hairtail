<template>
    <nav>
        <menu class="flex flex-col gap-1.5">
            <li v-for="item in routes" :key="item.key" class="cursor-pointer">
                <div class="flex items-center justify-start" @click="updateRouter(item.key)">
                    <div
                        bg="hover:lime-300"
                        p="x-1 y-1.5"
                        flex="~ row"
                        class="border-2 rounded-xl"
                        :class="
                            activedRouter === item.key
                                ? ['bg-lime-300', 'border-slate-800']
                                : 'border-transparent'
                        "
                    >
                        <component :is="item.icon" size="30px" />
                    </div>
                </div>
            </li>
        </menu>
    </nav>
</template>

<script setup lang="ts">
import { routes, activedRouter, updateRouter } from '@renderer/router';
</script>
