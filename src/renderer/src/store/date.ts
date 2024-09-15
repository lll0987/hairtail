import { computed, onMounted, onUnmounted, ref } from 'vue';

const h24 = 86400000;

const date = ref(new Date());
const listeners = ref<(() => void)[]>([]);

export const useDateStore = (hour: number = 0) => {
    const _listeners = ref<(() => void)[]>([]);
    const subscribe = (listener: () => void) => {
        listeners.value.push(listener);
        _listeners.value.push(listener);
    };
    onUnmounted(() => {
        listeners.value = listeners.value.filter(listener => !_listeners.value.includes(listener));
    });

    onMounted(() => {
        date.value = new Date();
        listeners.value.forEach(listener => listener());
    });

    const updateDate = (timestamp: number) => {
        date.value = new Date(timestamp);
        listeners.value.forEach(listener => listener());
    };

    const timestamp = computed(() => date.value.setHours(hour, 0, 0, 0));
    const last = computed(() => timestamp.value - h24);
    const next = computed(() => timestamp.value + h24);

    return { timestamp, last, next, updateDate, subscribe };
};
