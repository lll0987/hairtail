<template>
    <div inline-block>
        <input v-model="hour" type="text" :readonly="readonly" :class="inputClass" @blur="onBlurHour" />
        <span mx-1>:</span>
        <input v-model="minute" type="text" :readonly="readonly" :class="inputClass" @blur="onBlurMinute" />
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';
import dayjs from 'dayjs';

const inputClass = [
    'reset-all',
    'bg-slate-800',
    'dark:bg-black',
    'bg-opacity-5',
    'rounded-lg',
    'text-center',
    'text-xl',
    'py-1',
    'w-11'
];

const props = defineProps<{ readonly?: boolean }>();
const { readonly } = toRefs(props);

const hour = ref('');
const onBlurHour = () => {
    const value = parseInt(hour.value);
    if (isNaN(value)) hour.value = '';
    else {
        if (value < 0) hour.value = '0';
        if (value > 23) hour.value = '23';
    }
    updateValue();
};
const minute = ref('');
const onBlurMinute = () => {
    const value = parseInt(minute.value);
    if (isNaN(value)) minute.value = '';
    else {
        if (value < 0) minute.value = '0';
        if (value > 59) minute.value = '59';
    }
    updateValue();
};

const model = defineModel<number>();
watch(
    model,
    value => {
        if (!value) return;
        const d = dayjs(value);
        hour.value = d.format('HH');
        minute.value = d.format('mm');
    },
    { immediate: true }
);
const updateValue = () => {
    const h = hour.value ? Number(hour.value) : 0;
    const m = minute.value ? Number(minute.value) : 0;
    model.value = dayjs().hour(h).minute(m).valueOf();
};
</script>
