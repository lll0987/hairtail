import { computed, ComputedRef, Ref } from 'vue';
import { useElementBounding } from '@vueuse/core';

// MEMO popover 弹出层与触发元素间距 2px
const gap = 2;
// NEXT popover 获取弹出层实际高度
const height = 200;

export interface PopoverStyle {
    left?: string;
    top?: string;
    width?: string;
}

export const usePopover = (
    triggerEl: Ref<HTMLElement | null>,
    width: 'trigger' | false = 'trigger'
): ComputedRef<PopoverStyle> => {
    const { bottom, left, top: t, width: w } = useElementBounding(triggerEl);
    const styles = computed(() => {
        const value: PopoverStyle = { left: left.value + 'px' };
        let top = bottom.value + gap;
        // 如果下方空间不足，显示在上方
        if (top + height > window.innerHeight) {
            top = t.value - height - gap;
        }
        value.top = top + 'px';
        // 与触发元素宽度一致
        if (width === 'trigger') {
            value.width = w.value + 'px';
        }
        return value;
    });
    return styles;
};
