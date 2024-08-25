import { computed, toRef } from 'vue';

export interface ILabelProps {
    label?: string;
    placeholder?: string;
    'show-label': boolean;
}

export const useLabel = (props: ILabelProps, def_label: string, def_placeholder: string) => {
    const label = toRef(props, 'label');
    const showLabel = toRef(props, 'show-label');
    const placeholder = toRef(props, 'placeholder');

    const mergedLabel = computed(() => {
        if (!showLabel.value) return '';
        return label.value === undefined ? def_label : label.value;
    });

    const mergedPlaceholder = computed(() => {
        if (placeholder.value !== undefined) return placeholder.value;
        if (mergedLabel.value === def_label) return def_placeholder;
        return def_placeholder + mergedLabel.value;
    });

    return { mergedLabel, mergedPlaceholder };
};
