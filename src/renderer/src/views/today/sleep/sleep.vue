<!-- min w 70 -->
<template>
    <div flex="~ col" p-3 class="card" @dblclick.prevent.stop="handleEdit">
        <div flex-1 flex items-end gap-1 mb-2 font-semibold>
            <i text-teal-400 mr-2><icon-zzz size="2rem"></icon-zzz></i>
            <span text-4xl>{{ form.hour ?? 0 }}</span>
            <span text-zinc-400>小时</span>
            <span text-4xl>{{ form.minute }}</span>
            <span v-show="form.minute" text-zinc-400>分钟</span>
        </div>
        <div flex-1 flex items-center gap-2 pl-4>
            <d-input v-model="form.start" :readonly="!editing"></d-input>
            <span>至</span>
            <d-input v-model="form.end" :readonly="!editing"></d-input>
        </div>
        <div flex-1 flex items-center gap-2 pl-4>
            <d-input v-model="form.up" :readonly="!editing"></d-input>
            <span>起床</span>
            <i v-show="editing" text-positive @click.stop="handleConfirm">
                <icon-check w-5></icon-check>
            </i>
            <i v-show="editing" text-negative @click.stop="handleCancel">
                <icon-x w-5></icon-x>
            </i>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IconCheck, IconX, IconZzz } from '@tabler/icons-vue';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { EVENT_GRAIN } from '@contracts/component';
import { useBaseApi } from '@renderer/hooks';
import { useToast } from '@renderer/components';
import DInput from '../input.vue';
import { topic, topic2 } from './_setting';

dayjs.extend(duration);

interface E {
    start?: number;
    end?: number;
    up?: number;
    hour?: number;
    minute?: number;
}

const { list, add, update } = useBaseApi('event');
const form = ref<E>({});
const old = ref<E>({});

const ids = ref<string[]>();
const ids2 = ref<string[]>();
const refresh = async () => {
    const e = new Date().setHours(20, 0, 0, 0);
    const s = e - 86400000;
    const [, data] = await list({
        $and: [{ end: { $gte: s } }, { end: { $lte: e } }, { topic: { $in: [topic, topic2] } }]
    });
    if (data.length < 1) return;
    let l = 0;
    ids.value = [];
    ids2.value = [];
    for (const event of data) {
        if (event.topic === topic) {
            // 最早开始时间
            if (!form.value.start) form.value.start = event.start;
            if (event.start < form.value.start) form.value.start = event.start;
            // 最晚结束时间
            if (!form.value.end) form.value.end = event.end;
            if (event.end > form.value.end) form.value.end = event.end;
            // 总时长
            l += event.end - event.start;
            // id
            ids.value.push(event.id!);
        } else {
            // 最晚时间
            if (!form.value.up) form.value.up = event.end;
            if (event.end > form.value.up) form.value.up = event.end;
            // id
            ids2.value.push(event.id!);
        }
    }
    const d = dayjs.duration(l);
    form.value.hour = d.hours();
    form.value.minute = d.minutes();
    old.value = { ...form.value };
};
refresh();

const editing = ref(false);
const toast = useToast();
const handleConfirm = async () => {
    if (!form.value.start || !form.value.end) return;
    const doc = { start: form.value.start, end: form.value.end };
    const handler = ids.value?.length
        ? update(ids.value[0], doc)
        : add({ ...doc, topic, grain: Number(EVENT_GRAIN.TIME_RANGE) });
    const [msg] = await handler;
    if (msg) return toast.error(msg);
    if (form.value.up) {
        const doc = { start: form.value.end, end: form.value.up };
        const handler = ids2.value?.length
            ? update(ids2.value[0], doc)
            : add({ ...doc, topic: topic2, grain: Number(EVENT_GRAIN.TIME_RANGE) });
        const [msg] = await handler;
        if (msg) return toast.error(msg);
    }
    editing.value = false;
    refresh();
};

const handleCancel = () => {
    editing.value = false;
    Object.assign(form.value, { ...old.value });
};

const handleEdit = () => {
    editing.value = true;
};
</script>
