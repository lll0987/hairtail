import { computed, reactive, toRef, watch } from 'vue';
import { ArrowKey, SelectApi, SelectItem, SelectMenuProps, SelectState, SelectValue } from '..';
import { EVENT_KEY } from '@renderer/constants';
import { useModelValue, ValueRequired } from '@renderer/hooks';

export const useSelect = (props: ValueRequired<SelectMenuProps>, emits): SelectApi => {
    // 过滤数据
    const options = toRef(props, 'options', []);
    const filterText = toRef(props, 'filter');
    const filterOptions = computed(() => {
        const label = filterText.value;
        if (!label) return options.value;
        return options.value.filter(item => item.label.includes(label));
    });

    // model-value
    const { mergedValue, updateValue } = useModelValue<SelectValue>(props, emits);

    // 内部值
    const selectValue = computed(() => {
        const value = mergedValue.value;
        if (!value?.length) return [];
        if (typeof value === 'string') return [value];
        return value;
    });

    // 内部状态
    const state = reactive<SelectState>({ focusIndex: 0, multiple: !!props.multiple });

    // 更新焦点
    const updateFoucus = (index: number): void => {
        state.focusIndex = index;
    };

    // 自动聚焦
    const handleAutoFocus = (): void => {
        if (!filterOptions.value.length) return;
        // 默认第一个
        let index = 0;
        // 如果有选中的值，使用最后一个选中值的下标
        if (selectValue.value.length) {
            const value = selectValue.value.at(-1);
            index = filterOptions.value.findIndex(item => item.value === value);
            // 找不到则还是第一个
            if (index === -1) index = 0;
        }
        updateFoucus(index);
    };

    // 选中子项
    const handleItemSelect = (item: SelectItem): void => {
        const { value } = item;
        let val: SelectValue = selectValue.value;

        if (state.multiple) {
            const ind = val.indexOf(value);
            if (ind === -1) {
                val.push(value);
            } else {
                val.splice(ind, 1);
            }
        } else {
            val = value;
        }

        updateValue(val);
    };

    // 清空选中
    const handleClear = (): void => {
        const value = state.multiple ? [] : '';
        updateValue(value);
        updateFoucus(0);
    };

    // 方向键
    const handleArrowEvent = (key: ArrowKey): void => {
        const length = filterOptions.value.length;
        if (length < 1) return;

        const { UP, DOWN } = EVENT_KEY;
        const { focusIndex } = state;

        if (key === UP && focusIndex > 0) {
            updateFoucus(focusIndex - 1);
        }
        if (key === DOWN && focusIndex < length - 1) {
            updateFoucus(focusIndex + 1);
        }
    };

    const onItemSelect = (item?: SelectItem): void => {
        const defaultItem = filterOptions.value[state.focusIndex];
        handleItemSelect(item || defaultItem);
    };

    watch(filterText, value => {
        if (value) {
            handleAutoFocus();
        } else {
            handleClear();
        }
    });

    return {
        state,
        filterOptions,
        selectValue,
        updateValue,
        updateFoucus,
        handleAutoFocus,
        handleArrowEvent,
        onItemSelect
    };
};
