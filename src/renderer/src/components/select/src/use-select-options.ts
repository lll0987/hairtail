import { computed, toRef } from 'vue';
import type { SelectProps } from '..';

export const useSelectOptions = (props: SelectProps) => {
    const options = toRef(props, 'options', []);
    const matchLabel = toRef(props, 'match');
    const matchOptions = computed(() => {
        const label = matchLabel.value;
        if (!label) return options.value;
        return options.value.filter(item => item.label.includes(label));
    });
    return { matchOptions, matchLabel };
};
