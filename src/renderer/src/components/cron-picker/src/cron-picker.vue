<template>
    <ag-field
        :label="mergedLabel"
        :disabled="disabled"
        :feedback="feedback"
        :status="meragedStatus"
        @provide="v => (popoverStyles = v)"
    >
        <template #default="{ id }">
            <button
                :id="id"
                :popovertarget="popoverId"
                flex="1 ~ row wrap"
                class="gap-1 items-center reset-all min-w-40"
            >
                <p v-if="!inputValue" class="text-placeholder">{{ mergedPlaceholder }}</p>
                <p v-else>{{ inputValue }}</p>
            </button>
            <div :id="popoverId" popover class="m-0 p-2 bg-white bdr-all" :style="popoverStyles">
                <div grid="~ cols-[1.1rem_1fr]" class="items-center gap-y-2">
                    <cron-radio label="整月" :value="cronOptions.all"></cron-radio>
                    <cron-radio label="具体日期" :value="cronOptions.day"></cron-radio>
                    <cron-input
                        v-show="selected === cronOptions.day"
                        class="col-start-2"
                        label="开始："
                        :value="cronDay.start"
                        @update="v => handleCronDay('start', v)"
                    ></cron-input>
                    <cron-input
                        v-show="selected === cronOptions.day"
                        class="col-start-2"
                        label="结束："
                        :value="cronDay.end"
                        @update="v => handleCronDay('end', v)"
                    ></cron-input>
                </div>
            </div>
        </template>
    </ag-field>
</template>

<script setup lang="ts">
import { computed, h, ref, toRef } from 'vue';
import { PopoverStyle, useId, useLabel, useModelValue, useValidate } from '@renderer/hooks';
import { AgField } from '@renderer/components';
import { CronOption, cronOptions, CronPickerEmits, CronPickerProps } from '..';
import { useCronValue } from './use-cron-value';
// popover
const popoverId = useId().next();
const popoverStyles = ref<PopoverStyle>({});
// props & emits
const props = withDefaults(defineProps<CronPickerProps>(), { defaultValue: () => ({ start: '', end: '' }) });
const emits = defineEmits<CronPickerEmits>();
// label & placeholder
const { mergedLabel, mergedPlaceholder } = useLabel(props, 'cron', '请选择');
// readonly & disabled
const disabled = toRef(props, 'disabled');
// feedback & status
const { feedback, meragedStatus } = useValidate(props);
// value
const { mergedValue, updateValue } = useModelValue(props, emits);
const { inputValue, cronDay, selected, handleCronDay, handleCronSelected } = useCronValue(
    mergedValue,
    updateValue
);
// component
const cronRadio = (props: { label: string; value: CronOption }) => {
    const { label, value } = props;
    const id = `cron-picker-${value}`;
    const checked = computed(() => value === selected.value);
    return [
        h('input', {
            id,
            type: 'radio',
            name: 'cron-picker',
            class: [
                'appearance-none',
                'w-3',
                'h-3',
                'border-slate-950',
                'rounded-full',
                'border-2',
                checked.value && 'border-4'
            ],
            value: value,
            checked: checked.value,
            onChange: () => handleCronSelected(value)
        }),
        h('label', { for: id }, label)
    ];
};
const CronInput = (props: { label: string; value: string }, { emit }) => {
    const inputValue = toRef(props, 'value');
    const onInput = (e: InputEvent | Event): void => {
        let targetValue = (e.target as HTMLInputElement).value;
        let value = parseInt(targetValue);
        if (isNaN(value)) {
            targetValue = '';
        } else {
            if (value < 1) value = 0;
            if (value > 31) value = 31;
            targetValue = '' + value;
        }
        emit('update', targetValue);
    };
    return h(
        'label',
        {
            grid: '~ cols-[auto_1fr]',
            class: ['items-center', 'p-1', 'border-b-2', 'bdr-opacity']
        },
        [
            h('span', { class: ['text-slate-500', 'text-3.5'] }, props.label),
            h('input', {
                type: 'text',
                class: ['reset-all', ' placeholder:text-placeholder', 'min-w-0'],
                value: inputValue.value,
                onInput: onInput
            })
        ]
    );
};
</script>
