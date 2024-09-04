<template>
    <div
        grid="~ rows-2 cols-[auto_1fr]"
        items-center
        gap-x-6
        px-6
        py-3
        class="card relative"
        @dblclick="handleEdit"
    >
        <i row-span-full text-sky-400>
            <icon-pill-filled h="4rem"></icon-pill-filled>
        </i>
        <p font-semibold pl-1>
            <span text-4xl>{{ info?.value ?? 0 }}</span>
            <span mx-1>/</span>
            <span>{{ info?.total ?? 0 }}</span>
        </p>
        <div flex="~ row nowrap" items-center gap-2>
            <d-input v-model="time" :readonly="!editing"></d-input>
            <i v-show="editing" text-positive @click="handleConfirm">
                <icon-check w-5></icon-check>
            </i>
            <i v-show="editing" text-negative @click="handleCancel">
                <icon-x w-5></icon-x>
            </i>
        </div>
        <i
            absolute
            top-3
            right-3
            hover:text-slate-500
            dark:hover:text-slate-400
            :text="editing ? 'slate-500' : 'transparent'"
            @click="handleEdit"
        >
            <icon-edit w-5></icon-edit>
        </i>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IconCheck, IconEdit, IconPillFilled, IconX } from '@tabler/icons-vue';
import { FilterQuery } from 'mongoose';
import { TResponse } from '@contracts/type';
import { IEvent, IInfo } from '@contracts/interface';
import { EVENT_GRAIN } from '@contracts/component';
import { useApi, useBaseApi } from '@renderer/hooks';
import { useToast } from '@renderer/components';
import DInput from '../input.vue';
import { tag, topic, length } from './_setting';

const { list, update } = useBaseApi('info');
const info = ref<IInfo>();
const refreshInfo = async () => {
    const [, data] = await list({ tag });
    if (data.length !== 1) return;
    info.value = data[0];
};

const time = ref<number>();
const event = ref<IEvent>();
const listEvent = useApi('event', 'list:grain') as (
    filter?: FilterQuery<IEvent>
) => Promise<TResponse<IEvent, true>>;
const refreshEvent = async () => {
    const start = new Date().setHours(0, 0, 0, 0);
    const [, data] = await listEvent({ $and: [{ start: { $gte: start } }, { tags: { $in: [tag] } }] });
    if (data.length !== 1) return;
    event.value = data[0];
    time.value = event.value.start;
};

const refresh = () => {
    refreshEvent();
    refreshInfo();
};
refresh();

const toast = useToast();
const editing = ref(false);
const { add, update: updateE } = useBaseApi('event');
const handleConfirm = async () => {
    // 没有填写时间直接返回
    if (!time.value) return;
    // 日程时间
    const start = time.value;
    const end = start + length;
    if (event.value) {
        // 更新日程
        const [msg] = await updateE(event.value.id!, { start, end });
        if (msg) return toast.error(msg);
        editing.value = false;
        refreshEvent();
    } else {
        // 新增日程
        const [msg] = await add({ start, end, tags: [tag], topic, grain: Number(EVENT_GRAIN.TIME_RANGE) });
        if (msg) return toast.error(msg);
        // 更新数量
        const { id, value } = info.value!;
        if (!id || !value) return; // PERF 理论上不存在这种情况，或许改成抛出异常？
        const [m] = await update(id, { value: value - 1 });
        if (m) return toast.error(m);
        editing.value = false;
        refresh();
    }
};

const handleCancel = () => {
    editing.value = false;
    time.value = event.value?.start;
};

const handleEdit = () => {
    editing.value = true;
};
</script>
