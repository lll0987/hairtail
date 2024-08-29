import { computed, ComputedRef, reactive, ref } from 'vue';
import { CronOption, cronOptions, CronPickerType } from '..';
import { useCronValue } from './use-cron-value';
import { DayOfTheMonthRange } from 'cron-parser';

const parse = (value: string): DayOfTheMonthRange => {
    if (value === 'L') return value;
    return Number(value) as DayOfTheMonthRange;
};

export const useCronMenu = (
    mergedValue: ComputedRef<CronPickerType>,
    updateValue: (value: CronPickerType) => void
) => {
    const { startCron, endCron, getCronStringifyValue } = useCronValue(mergedValue);
    const selected = ref<CronOption>(0);
    const cronDayValue = reactive({ start: '', end: '' });

    const inputValue = computed(() => {
        if (selected.value === cronOptions.all) return '整月';
        const s = startCron.day === null ? '' : startCron.day;
        const e = endCron.day === null ? '' : endCron.day;
        if (s && e) return `每月${s}号到${e}号`;
        return '';
    });

    const handleCronDayValue = (key: 'start' | 'end', value?: string) => {
        if (value === undefined) {
            const day = key === 'start' ? startCron.day : endCron.day;
            cronDayValue[key] = day === null ? '' : day.toString();
        } else {
            cronDayValue[key] = value;
            const day = parse(value);
            if (key === 'start') startCron.day = day;
            else endCron.day = day;
        }
        updateValue(getCronStringifyValue());
    };

    const handleCronSelected = (option: CronOption) => {
        if (option === cronOptions.all) {
            startCron.day = 1;
            endCron.day = 1;
        } else {
            startCron.day = null;
            endCron.day = null;
            handleCronDayValue('start');
            handleCronDayValue('end');
        }
        selected.value = option;
        updateValue(getCronStringifyValue());
    };

    return { inputValue, cronDayValue, selected, handleCronDayValue, handleCronSelected };
};
