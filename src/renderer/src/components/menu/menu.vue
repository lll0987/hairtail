<template>
    <nav class="w-52">
        <menu class="py-8">
            <li v-for="(item, index) in props.routes" :key="index" class="mt-8 first:mt-0">
                <div class="flex items-center justify-start px-6" @click="onClick(item.key)">
                    <div
                        class="hover:bg-cyan-950 hover:bg-opacity-15 bg-opacity-15 rounded flex"
                        :class="{ 'bg-cyan-950': item.key === props.actived }"
                    >
                        <icon :size="40"><component :is="item.icon" /></icon>
                    </div>
                    <!-- <span class="px-4">{{ item.label }}</span> -->
                </div>
            </li>
        </menu>
    </nav>
</template>

<script setup lang="ts">
import icon from '../icon';
import { IRoute } from '@t/interface';

const props = defineProps<{ routes: IRoute[]; actived: string }>();
const emits = defineEmits(['update:actived']);

const onClick = (actived: string) => {
    emits('update:actived', actived);
};
</script>
