import { computed, ComputedRef, onMounted, ref, Ref } from 'vue';

// NEXT 获取弹出层实际高度
const popover_height = 200;

// MEMO 弹出层与触发元素间距 2px
const gap = 2;

export interface PopoverStyle {
    left?: string;
    top?: string;
    width?: string;
}

export const usePopover = (el: Ref<HTMLElement | null>): ComputedRef<PopoverStyle> => {
    const x = ref(0);
    const y = ref(0);
    const w = ref('');

    onMounted(() => {
        if (!el.value) return;
        const { bottom, left, top, width } = el.value.getBoundingClientRect();
        x.value = left;
        y.value = bottom + gap;
        w.value = width + 'px';

        // 如果下方空间不足，显示在上方

        if (y.value + popover_height > window.innerHeight) {
            y.value = top - popover_height - gap;
        }
    });

    // NEXT resize 时重新计算位置

    const styles = computed(() => {
        if (!x.value || !y.value || !w.value) return {};
        return {
            left: x.value + 'px',
            top: y.value + 'px',
            width: w.value
        };
    });
    return styles;
};
