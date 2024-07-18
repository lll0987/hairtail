<template>
    <nav>
        <menu class="text-zinc-500">
            <li v-for="(item, index) in props.routes" :key="index" class="mt-24">
                <div class="flex items-center justify-start px-16" @click="onClick(item.key)">
                    <div
                        class="hover:text-zinc-950 rounded flex"
                        :class="{ 'text-cyan-950': item.key === props.actived }"
                    >
                        <icon :size="30">
                            <component :is="item.key === props.actived ? item.iconFilled : item.icon" />
                        </icon>
                    </div>
                </div>
            </li>
        </menu>
    </nav>
</template>

<script setup lang="ts">
import icon from '../../icon';
import { IRoute } from '@t/interface';

const props = defineProps<{ routes: IRoute[]; actived: string }>();
const emits = defineEmits(['update:actived']);

const onClick = (actived: string) => {
    emits('update:actived', actived);
};
</script>
