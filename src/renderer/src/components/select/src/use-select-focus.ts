import { computed, ComputedRef, ref } from 'vue';
import { KEYBOARD_EVENT } from '@contracts/component';
import type { SelectApi } from '..';

const def_focus_index = 0;

export const useSelectFocus = (
    api: Pick<SelectApi, 'matchOptions'> & { selectValue: ComputedRef<string[]> }
) => {
    const { matchOptions, selectValue } = api;

    const focusIndex = ref(def_focus_index);
    const updateFoucus = (index: number = def_focus_index): void => {
        focusIndex.value = index;
    };
    const isFocus = (index: number): boolean => focusIndex.value === index;
    const focusValue = computed(() => matchOptions.value[focusIndex.value]);

    // 自动聚焦
    const handleAutoFocus = (): void => {
        const { value: options } = matchOptions;
        const { value } = selectValue;
        if (!options.length) return;
        // 默认第一个
        let index = def_focus_index;
        // 如果有选中的值，使用最后一个选中值的下标
        if (value.length) {
            const v = value.at(-1);
            index = options.findIndex(item => item.value === v);
            // 找不到则还是第一个
            if (index === -1) index = def_focus_index;
        }
        updateFoucus(index);
    };

    // 键盘上下移动
    const handleArrowFocus = (key: KEYBOARD_EVENT): void => {
        const length = matchOptions.value.length - 1;
        if (length < 1) return;
        const { UP, DOWN } = KEYBOARD_EVENT;
        const { value: index } = focusIndex;
        if (key === UP) {
            updateFoucus(index > 0 ? index - 1 : length);
        }
        if (key === DOWN) {
            updateFoucus(index < length ? index + 1 : 0);
        }
    };

    return { focusValue, updateFoucus, isFocus, handleAutoFocus, handleArrowFocus };
};
