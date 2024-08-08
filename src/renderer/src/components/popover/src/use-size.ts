import { inject, ref, watch } from 'vue';
import { PopoverApiKey } from '..';

export const usePopoverSize = () => {
    const api = inject(PopoverApiKey, {});

    const style = ref<{ width?: string }>({});

    watch(
        () => api.contentRef,
        value => {
            if (value) {
                const { offsetWidth } = value;
                style.value.width = offsetWidth + 'px';
            }
        }
    );

    return style;
};
