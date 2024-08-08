import { inject, ref, watch } from 'vue';
import { PopoverApiKey } from '..';

export const usePopoverPosition = () => {
    const api = inject(PopoverApiKey, {});

    const style = ref<{ transform?: string }>({});

    if (api.left !== undefined && api.top !== undefined) {
        style.value.transform = `translateX(${api.left}px) translateY(${api.top}px)`;
    }

    watch(
        () => api.contentRef,
        value => {
            if (value) {
                const { offsetLeft, offsetTop, offsetHeight } = value;
                const x = offsetLeft;
                const y = offsetTop + offsetHeight + 4;
                style.value.transform = `translateX(${x}px) translateY(${y}px)`;
            }
        }
    );

    return style;
};
