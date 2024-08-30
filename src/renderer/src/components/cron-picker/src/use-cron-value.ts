import { computed, ComputedRef, reactive, Ref, ref } from 'vue';
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

const setting: Record<keyof ICronFields, { field: keyof CronFields; def: (string | number)[] }> = {
    second: { field: 'second', def: [0] as SixtyRange[] },
    minute: { field: 'minute', def: [0] as SixtyRange[] },
    hour: { field: 'hour', def: [0] as HourRange[] },
    day: { field: 'dayOfMonth', def: [1] as DayOfTheMonthRange[] },
    month: { field: 'month', def: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as MonthRange[] },
    week: { field: 'dayOfWeek', def: [0, 1, 2, 3, 4, 5, 6, 7] as DayOfTheWeekRange[] }
};
const keys = Object.keys(setting);

export const parseCron = (cron: string) => {
    const expression: CronExpression = parseExpression(cron);
    const fields: ICronFields = keys.reduce((pre, cur) => {
        const value = expression.fields[setting[cur].field];
        pre[cur] = value?.length === 1 ? value[0] : null;
        return pre;
    }, {} as ICronFields);
    return { expression, fields };
};

export const getCronLabel = (startFields: ICronFields, endFields: ICronFields, selected?: CronOption) => {
    if (selected === cronOptions.all) return '整月';
    const { day: s } = startFields;
    const { day: e } = endFields;
    if (s === 1 && s === e) return '整月';
    if (s && e) return `每月${s}号到${e}号`;
    return '';
};

const init = (): ICronFields => ({ second: 0, minute: 0, hour: 0, day: null, month: null, week: null });

const parse = (s: string, e: Ref<CronExpression | null>, f: Ref<ICronFields>) => {
    const { expression, fields } = parseCron(s);
    e.value = expression;
    f.value = fields;
};

const update = (expression: Ref<CronExpression | null>, fields: Ref<ICronFields>) => {
    expression.value = fieldsToExpression(
        keys.reduce((pre, cur) => {
            const { field, def } = setting[cur];
            const value = fields.value[cur];
            pre[field] = value === null ? def : [value];
            return pre;
        }, {} as CronFields)
    );
};

const stringify = (expression: Ref<CronExpression | null>, fields: Ref<ICronFields>) => {
    if (expression.value === null) update(expression, fields);
    return expression.value!.stringify();
};

export const useCronValue = (
    mergedValue: ComputedRef<CronPickerType>,
    updateValue: (value: CronPickerType) => void
) => {
    const fields_s = ref<ICronFields>(init());
    const fields_e = ref<ICronFields>(init());
    const expression_s = ref<CronExpression | null>(null);
    const expression_e = ref<CronExpression | null>(null);
    // 初始化 expression
    const { start, end } = mergedValue.value;
    if (start) parse(start, expression_s, fields_s);
    if (end) parse(end, expression_e, fields_e);

    const handleValue = () => {
        const start = stringify(expression_s, fields_s);
        const end = stringify(expression_e, fields_e);
        updateValue({ start, end });
    };

    const cronDay = reactive({ start: '', end: '' });
    const handleCronDay = (key: 'start' | 'end', value?: string) => {
        const cron = key === 'start' ? fields_s : fields_e;
        if (value === undefined) {
            cronDay[key] = cron.value.day === null ? '' : cron.value.day.toString();
        } else {
            cronDay[key] = value;
            cron.value.day = value === 'L' ? value : (Number(value) as DayOfTheMonthRange);
            update(key === 'start' ? expression_s : expression_e, cron);
        }
        handleValue();
    };

    const selected = ref<CronOption>();
    const handleCronSelected = (option: CronOption) => {
        if (option === cronOptions.all) {
            fields_s.value.day = 1;
            fields_e.value.day = 1;
        } else {
            fields_s.value.day = null;
            fields_e.value.day = null;
            handleCronDay('start');
            handleCronDay('end');
        }
        selected.value = option;
        handleValue();
    };

    const inputValue = computed(() => getCronLabel(fields_s.value, fields_e.value, selected.value));

    return { inputValue, cronDay, selected, handleCronDay, handleCronSelected };
};
