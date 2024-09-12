import { computed, ref } from 'vue';

const dark = ref(true);

const mode = computed(() => (dark.value ? 'dark' : 'light'));
const updateMode = (isDark?: boolean) => {
    if (isDark === undefined) isDark = !dark.value;
    dark.value = isDark;
};

export const useModeStore = () => {
    return { mode, updateMode };
};
