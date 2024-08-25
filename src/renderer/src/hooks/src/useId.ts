import { ref, computed } from 'vue';

const initial = Math.floor(Math.random() * 10000);
const id = ref(0);

export const useId = () => {
    const current = computed(() => initial + id.value + '');

    const next = () => {
        id.value++;
        return current.value;
    };

    return {
        initial,
        current,
        next
    };
};
