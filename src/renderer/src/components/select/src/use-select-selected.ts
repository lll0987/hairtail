import { ComputedRef, Ref } from 'vue';
import type { SelectItem, SelectValue } from '..';

export const useSelectSelected = (api: {
    hidePopover: () => void;
    updateValue: (value: SelectValue) => void;
    multiple: Ref<boolean>;
    selectValue: ComputedRef<string[]>;
    focusValue: ComputedRef<SelectItem>;
}) => {
    const { hidePopover, updateValue, selectValue, focusValue, multiple } = api;

    const handleItemSelected = (item?: SelectItem): void => {
        const { value } = item || focusValue.value;
        let val: SelectValue = value;
        if (multiple.value) {
            val = selectValue.value;
            const ind = val.indexOf(value);
            if (ind === -1) {
                val.push(value);
            } else {
                val.splice(ind, 1);
            }
        }
        updateValue(val);
        if (!multiple.value) hidePopover();
    };

    return { handleItemSelected };
};
