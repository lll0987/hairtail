import { computed, onMounted, ref } from 'vue';

const h24 = 86400000;

const date = ref(new Date());

export const useDateStore = (hour: number = 0) => {
    onMounted(() => {
        date.value = new Date();
    });

    const updateDate = (timestamp: number) => {
        date.value = new Date(timestamp);
    };

    const timestamp = computed(() => date.value.setHours(hour, 0, 0, 0));
    const last = computed(() => timestamp.value - h24);
    const next = computed(() => timestamp.value + h24);

    return { timestamp, last, next, updateDate };
};
