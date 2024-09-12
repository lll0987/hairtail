<template>
    <input type="time" :value="inputValue" @input="onInput" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import dayjs from 'dayjs';
import { useDateStore } from '@renderer/store';

const { timestamp } = useDateStore();

const model = defineModel<number>();
const inputValue = computed(() => dayjs(model.value).format('HH:mm'));
const onInput = (e: InputEvent | Event): void => {
    const targetValue = (e.target as HTMLInputElement).value;
    const [hour, minute] = targetValue.split(':');
    const h = hour ? Number(hour) : 0;
    const m = minute ? Number(minute) : 0;
    model.value = dayjs(timestamp.value).hour(h).minute(m).valueOf();
};
</script>
