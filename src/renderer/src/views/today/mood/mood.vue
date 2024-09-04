<template>
    <div
        class="flex items-center gap-3 px-3 card text-black relative"
        @dblclick.prevent.stop="() => (editing = true)"
    >
        <i v-for="i in max" :key="i" flex-1 @click.stop="updateMood(i)">
            <IconMoodSmile :fill="i <= mood ? color : 'none'"></IconMoodSmile>
        </i>
        <div v-show="editing" flex="inline nowrap" items-center gap-1>
            <i text-positive @click.stop="handleConfirm">
                <icon-check w-5></icon-check>
            </i>
            <i text-negative @click.stop="() => (editing = false)">
                <icon-x w-5></icon-x>
            </i>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IconCheck, IconMoodSmile, IconX } from '@tabler/icons-vue';
import { colors, EVENT_GRAIN } from '@contracts/component';
import { TDoc } from '@contracts/type';
import { IEventModel } from '@contracts/interface';
import { useBaseApi } from '@renderer/hooks';
import { useToast } from '@renderer/components';
import { topic, max } from './_setting';

const color = colors.yellow[300];

const getStart = () => {
    const hour = new Date().getHours();
    const h = hour >= 20 ? 0 : -24;
    return new Date().setHours(h, 0, 0, 0);
};

const mood = ref(0);
const editing = ref(false);
const updateMood = (i: number) => {
    if (!editing.value) return;
    mood.value = i;
};

const event = ref<TDoc<IEventModel>>();
const { list, add, update } = useBaseApi('event');
const refresh = async () => {
    const start = getStart();
    const end = start + 86400000;
    const [, data] = await list({ $and: [{ start: { $gte: start } }, { start: { $lte: end } }, { topic }] });
    if (data.length !== 1) return;
    event.value = data[0];
    mood.value = event.value.value || 0;
};
refresh();

const toast = useToast();
const handleConfirm = async () => {
    const t = getStart();
    const handler = event.value
        ? update(event.value.id!, { value: mood.value })
        : add({
              start: t,
              end: t,
              topic,
              value: mood.value,
              grain: Number(EVENT_GRAIN.DATE)
          });
    const [msg] = await handler;
    if (msg) return toast.error(msg);
    editing.value = false;
    refresh();
};
</script>
