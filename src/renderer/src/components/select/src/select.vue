<template>
    <ag-field
        :disabled="disabled"
        :size="size"
        :label="mergedLabel"
        :feedback="feedback"
        :status="meragedStatus"
        @provide="v => (popoverStyles = v)"
    >
        <template #default="{ id }">
            <button
                :id="id"
                :popovertarget="popoverId"
                :disabled="disabled"
                flex="1 ~ row wrap"
                class="gap-1 items-center reset-all min-w-40 w-full"
                @keydown.enter.stop="handelEnter"
                @keydown.down.stop.prevent="handleArrowFocus(KEYBOARD_EVENT.DOWN)"
                @keydown.up.stop.prevent="handleArrowFocus(KEYBOARD_EVENT.UP)"
            >
                <p v-if="!selectLabel.length" class="text-placeholder">{{ mergedPlaceholder }}</p>
                <p v-else-if="!multiple">{{ selectLabel[0] }}</p>
                <template v-else>
                    <p v-for="(value, index) in selectLabel" :key="index" class="px-1.5 bg-slate-200 rounded">
                        {{ value }}
                    </p>
                </template>
            </button>
            <select-menu :id="popoverId" :style="popoverStyles"></select-menu>
        </template>
    </ag-field>
</template>

<script setup lang="ts">
import { computed, provide, ref, toRefs, watch } from 'vue';
import { KEYBOARD_EVENT } from '@contracts/component';
import { PopoverStyle, useId, useLabel, useModelValue, useValidate } from '@renderer/hooks';
import { AgField } from '@renderer/components';
import type { SelectItem, SelectEmits, SelectProps } from '..';
import { SelectApiKey } from '..';
import { useSelectOptions } from './use-select-options';
import { useSelectFocus } from './use-select-focus';
import { useSelectSelected } from './use-select-selected';
import SelectMenu from './select-menu.vue';
// popover
const popoverId = useId().next();
const popoverStyles = ref<PopoverStyle>({});
const popoverState = ref(false);
const updateShow = (state: boolean) => {
    popoverState.value = state;
};
const hidePopover = () => {
    const popover = document.getElementById(popoverId);
    popover?.hidePopover();
};
// props & emits
const props = withDefaults(defineProps<SelectProps>(), { defaultValue: '' });
const emits = defineEmits<SelectEmits>();
// multiple & loading & disabled & size
const { multiple, loading, disabled, size } = toRefs(props);
// value
const { mergedValue, updateValue } = useModelValue(props, emits);
const selectValue = computed(() => {
    const { value } = mergedValue;
    if (!value?.length) return [];
    if (typeof value === 'string') return [value];
    return value;
});
// match
const { matchOptions, matchLabel, options } = useSelectOptions(props);
const selectLabel = computed(() => selectValue.value.map(v => options.value.find(i => i.value === v)?.label));
// focus
const { focusValue, updateFoucus, isFocus, handleAutoFocus, handleArrowFocus } = useSelectFocus({
    matchOptions,
    selectValue
});
// selected
const { handleItemSelected } = useSelectSelected({
    hidePopover,
    updateValue,
    selectValue,
    focusValue,
    multiple
});
// api
const isSelected = (item: SelectItem) => {
    return selectValue.value.includes(item.value);
};
provide(SelectApiKey, {
    loading,
    matchOptions,
    updateShow,
    updateFoucus,
    isFocus,
    isSelected,
    handleItemSelected
});
// watch
watch(matchLabel, value => {
    if (value) {
        handleAutoFocus();
    } else {
        const value = multiple.value ? [] : '';
        updateValue(value);
        updateFoucus();
    }
});
// label & placeholder
const { mergedLabel, mergedPlaceholder } = useLabel(props, 'select', '请选择');
// feedback & status
const { feedback, meragedStatus } = useValidate(props);
// enter event
const handelEnter = (e: KeyboardEvent) => {
    if (popoverState.value) {
        handleItemSelected();
        e.preventDefault();
    }
};

// NEXT select 增加下拉箭头
</script>
