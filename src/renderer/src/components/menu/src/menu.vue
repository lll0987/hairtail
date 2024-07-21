<template>
    <nav>
        <menu class="text-slate-950 flex flex-col gap-20">
            <li v-for="(item, index) in props.routes" :key="index">
                <div class="flex items-center justify-start" @click="onClick(item.key)">
                    <div
                        class="hover:bg-lime-300 bg-transparent border-transparent border-2 rounded-xl flex px-4 py-6"
                        :style="
                            item.key === props.actived
                                ? { backgroundColor: BG_COLOR, borderColor: BORDER_COLOR }
                                : {}
                        "
                    >
                        <AgIcon :size="30">
                            <component :is="item.iconFilled" />
                        </AgIcon>
                    </div>
                </div>
            </li>
        </menu>
    </nav>
</template>

<script setup lang="ts">
import { AgIcon } from '@renderer/components';
import { IRoute } from '@t/interface';

import colors from 'tailwindcss/colors';
const BG_COLOR = colors.lime[300];
const BORDER_COLOR = colors.slate[800];

const props = defineProps<{ routes: IRoute[]; actived: string }>();
const emits = defineEmits(['update:actived']);

const onClick = (actived: string) => {
    emits('update:actived', actived);
};
</script>
