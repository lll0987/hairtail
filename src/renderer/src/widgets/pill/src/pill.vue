<template>
    <article widget-black widget-card @dblclick.stop="handleEdit">
        <header widget-header>
            <h2>{{ tag }}</h2>
            <span text-orange-500><icon-pill-filled size="1.5rem"></icon-pill-filled></span>
        </header>
        <section v-show="!editing" flex-1 flex items-center min-h-14>
            <p font-semibold>
                <span text-4xl>{{ pill.current }}</span>
                <span mx-1>/</span>
                <span>{{ pill.total }}</span>
            </p>
        </section>
        <section v-show="editing" flex-1 flex items-center>
            <p flex="~ nowrap" items-center w-full>
                <time-input v-model="timeValue" mr-auto></time-input>
                <icon-button mr-0.5 type="positive" @click="handleConfirm"></icon-button>
                <icon-button type="negative" @click="handleCancel"></icon-button>
            </p>
        </section>
    </article>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue';
import { IconPillFilled } from '@tabler/icons-vue';
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
