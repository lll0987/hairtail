import { computed, ComputedRef, Reactive, reactive, Ref, ref } from 'vue';
import {
    CronExpression,
    CronFields,
    DayOfTheMonthRange,
    DayOfTheWeekRange,
    fieldsToExpression,
    HourRange,
    MonthRange,
    parseExpression,
    SixtyRange
} from 'cron-parser';
import { CronOption, cronOptions, CronPickerType } from '..';

interface ICronFields {
    // 秒
    second: SixtyRange | null;
    // 分钟
    minute: SixtyRange | null;
    // 小时
    hour: HourRange | null;
    // 天
    day: DayOfTheMonthRange | null;
    // 月
    month: MonthRange | null;
    // 星期
    week: DayOfTheWeekRange | null;
}

const hashMap: Record<keyof ICronFields, { field: keyof CronFields; def: (string | number)[] }> = {
    second: { field: 'second', def: [0] as SixtyRange[] },
    minute: { field: 'minute', def: [0] as SixtyRange[] },
    hour: { field: 'hour', def: [0] as HourRange[] },
    day: { field: 'dayOfMonth', def: [1] as DayOfTheMonthRange[] },
    month: { field: 'month', def: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as MonthRange[] },
    week: { field: 'dayOfWeek', def: [0, 1, 2, 3, 4, 5, 6, 7] as DayOfTheWeekRange[] }
};
const fields = Object.keys(hashMap);

const init = (): ICronFields => ({ second: 0, minute: 0, hour: 0, day: null, month: null, week: null });

const parse = (data: string, expression: Ref<CronExpression | null>, cron: Reactive<ICronFields>) => {
    expression.value = parseExpression(data);
    fields.forEach(f => {
        const value = expression.value?.fields[hashMap[f].field];
        cron[f] = value?.length === 1 ? value[0] : null;
    });
};

const updateExpression = (expression: Ref<CronExpression | null>, cron: Reactive<ICronFields>) => {
    expression.value = fieldsToExpression(
        fields.reduce((pre, cur) => {
            const { field, def } = hashMap[cur];
            pre[field] = cron[cur] === null ? def : [cron[cur]];
            return pre;
        }, {} as CronFields)
    );
};

const stringify = (expression: Ref<CronExpression | null>, cron: Reactive<ICronFields>) => {
    if (expression.value === null) updateExpression(expression, cron);
    return expression.value!.stringify();
};

export const useCronValue = (
    mergedValue: ComputedRef<CronPickerType>,
    updateValue: (value: CronPickerType) => void
) => {
    const cron_s = reactive<ICronFields>(init());
    const cron_e = reactive<ICronFields>(init());

    const inputValue = computed(() => {
        if (selected.value === cronOptions.all) return '整月';
        const s = cron_s.day === null ? '' : cron_s.day;
        const e = cron_e.day === null ? '' : cron_e.day;
        if (s && e) return `每月${s}号到${e}号`;
        return '';
    });

    const expression_s = ref<CronExpression | null>(null);
    const expression_e = ref<CronExpression | null>(null);
    // 初始化 expression
    const { start, end } = mergedValue.value;
    if (start) parse(start, expression_s, cron_s);
    if (end) parse(end, expression_e, cron_e);

    const handleValue = () => {
        const start = stringify(expression_s, cron_s);
        const end = stringify(expression_e, cron_e);
        updateValue({ start, end });
    };

    const cronDay = reactive({ start: '', end: '' });
    const handleCronDay = (key: 'start' | 'end', value?: string) => {
        const cron = key === 'start' ? cron_s : cron_e;
        if (value === undefined) {
            cronDay[key] = cron.day === null ? '' : cron.day.toString();
        } else {
            cronDay[key] = value;
            cron.day = value === 'L' ? value : (Number(value) as DayOfTheMonthRange);
            updateExpression(key === 'start' ? expression_s : expression_e, cron);
        }
        handleValue();
    };

    const selected = ref<CronOption>();
    const handleCronSelected = (option: CronOption) => {
        if (option === cronOptions.all) {
            cron_s.day = 1;
            cron_e.day = 1;
        } else {
            cron_s.day = null;
            cron_e.day = null;
            handleCronDay('start');
            handleCronDay('end');
        }
        selected.value = option;
        handleValue();
    };

    return { inputValue, cronDay, selected, handleCronDay, handleCronSelected };
};