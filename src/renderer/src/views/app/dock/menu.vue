<template>
    <nav>
        <menu flex="~ col" gap-3>
            <li v-for="item in routes" :key="item.key" cursor-pointer>
                <div
                    p="x-1 y-1.5"
                    flex="~ row center"
                    rounded-xl
                    hover:bg-lime-300
                    dark:hover:text-black
                    :class="activedRouter === item.key ? 'bdr bg-lime-300 dark:text-black' : ''"
                    @click="updateRouter(item.key)"
                >
                    <component :is="item.icon" size="30px" />
                </div>
            </li>
        </menu>
    </nav>
</template>

<script setup lang="ts">
import { routes, activedRouter, updateRouter } from '@renderer/router';
</script>
