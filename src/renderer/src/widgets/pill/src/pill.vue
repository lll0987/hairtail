<template>
    <article widget flex flex-col @dblclick.stop="handleEdit">
        <header>
            <h2 widget-header>{{ tag }}</h2>
            <p pb-1 flex gap-1>
                <button
                    v-for="(item, index) in pillOptions"
                    :key="index"
                    type="button"
                    bg-white
                    dark:bg-black
                    rounded-full
                    px-2
                    py-1
                    text-sm
                    @click="selectedPill(item.value)"
                >
                    {{ item.label }}
                </button>
            </p>
        </header>
        <section widget-card min-h-16 flex-1 flex flex-col justify-center>
            <p v-show="!editing" font-semibold>
                <span text-4xl>{{ pill.current }}</span>
                <span mx-1>/</span>
                <span>{{ pill.total }}</span>
            </p>
            <p v-show="editing">
                <time-input v-model="timeValue"></time-input>
            </p>
            <p v-show="editing">
                <icon-button mr-0.5 type="positive" @click="handleConfirm"></icon-button>
                <icon-button type="negative" @click="handleCancel"></icon-button>
            </p>
        </section>
    </article>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue';
import { IconButton, TimeInput } from '../..';
import { PillProps } from '..';
import { usePillValue } from './use-pill-value';

const props = defineProps<PillProps>();
const { tag, topic, length } = toRefs(props);
const { pill, pillOptions, timeValue, selectedPill, updatePillValue, updateTimeValue } = usePillValue({
    tag,
    topic,
    length
});

const editing = ref(false);
const handleEdit = () => {
    editing.value = true;
};
const handleConfirm = async () => {
    await updatePillValue();
    editing.value = false;
};
const handleCancel = () => {
    editing.value = false;
    updateTimeValue();
};
</script>
