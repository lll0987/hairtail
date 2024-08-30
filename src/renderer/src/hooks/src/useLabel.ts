import { computed, toRefs } from 'vue';

export interface ILabelProps {
    label?: string | false;
    placeholder?: string;
}

export const useLabel = (props: ILabelProps, def_label: string, def_placeholder: string) => {
    const { label, placeholder } = toRefs(props);

    const mergedLabel = computed(() => {
        if (label?.value === false) return '';
        return label?.value === undefined ? def_label : label.value;
    });

    const mergedPlaceholder = computed(() => {
        if (placeholder?.value !== undefined) return placeholder.value;
        if (mergedLabel.value === def_label) return def_placeholder;
        return def_placeholder + mergedLabel.value;
    });

    return { mergedLabel, mergedPlaceholder };
};
