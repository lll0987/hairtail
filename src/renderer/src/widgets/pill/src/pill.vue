<template>
    <article @dblclick.stop="handleEdit">
        <header>
            <h2>{{ tag }}</h2>
        </header>
        <section v-show="!editing">
            <p font-semibold>
                <span text-4xl>{{ pill.current }}</span>
                <span mx-1>/</span>
                <span>{{ pill.total }}</span>
            </p>
        </section>
        <section v-show="editing">
            <p flex="~ nowrap" items-center gap-2>
                <time-input v-model="timeValue"></time-input>
                <icon-button type="positive" @click="handleConfirm"></icon-button>
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
const { pill, timeValue, updatePillValue, updateTimeValue } = usePillValue({ tag, topic, length });

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
