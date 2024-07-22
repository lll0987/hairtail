import { ref, computed } from 'vue';

const initialZIndex = 2000;
const zIndex = ref(0);

export const useZIndex = () => {
    const currentZIndex = computed(() => initialZIndex + zIndex.value);

    const nextZIndex = () => {
        zIndex.value++;
        return currentZIndex.value;
    };

    return {
        initialZIndex,
        currentZIndex,
        nextZIndex
    };
};
