<template>
    <article @dblclick.stop="handleEdit">
        <header>
            <h2>{{ topic }}</h2>
        </header>
        <section v-show="!editing">
            <p font-semibold>
                <span text-4xl>{{ sleep.hour }}</span>
                <span text-placeholder>小时</span>
                <span text-4xl>{{ sleep.minute }}</span>
                <span text-placeholder>分钟</span>
            </p>
            <p>
                <span>{{ sleep.length }}</span>
            </p>
        </section>
        <section v-show="editing">
            <p>
                <time-input v-model="timeValue.start"></time-input>
            </p>
            <p>
                <time-input v-model="timeValue.end"></time-input>
            </p>
            <p>
                <time-input v-model="timeValue.up"></time-input>
            </p>
            <p>
                <icon-button type="positive" @click="handleConfirm"></icon-button>
                <icon-button type="negative" @click="handleCancel"></icon-button>
            </p>
        </section>
    </article>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue';
import { IconButton, TimeInput } from '../..';
import { SleepProps } from '..';
import { useSleepValue } from './use-sleep-value';

const props = defineProps<SleepProps>();
const { topic, topic2 } = toRefs(props);
const { sleep, timeValue, updateSleepValue, updateTimeValue } = useSleepValue({ topic, topic2 });

const editing = ref(false);
const handleEdit = () => {
    editing.value = true;
};
const handleConfirm = async () => {
    await updateSleepValue();
    editing.value = false;
};
const handleCancel = () => {
    updateTimeValue();
    editing.value = false;
};
</script>
