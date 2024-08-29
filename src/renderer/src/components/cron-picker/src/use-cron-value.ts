import { ComputedRef, Reactive, reactive, Ref, ref, watch } from 'vue';
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
import { CronPickerType } from '..';

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

const stringify = (expression: Ref<CronExpression | null>, cron: Reactive<ICronFields>) => {
    // FIX 改为响应式数据后 expression 需要重新生成
    if (expression.value === null) {
        expression.value = fieldsToExpression(
            fields.reduce((pre, cur) => {
                const { field, def } = hashMap[cur];
                pre[field] = cron[cur] === null ? def : [cron[cur]];
                return pre;
            }, {} as CronFields)
        );
    }
    return expression.value.stringify();
};

export const useCronValue = (value: ComputedRef<CronPickerType>) => {
    const expression_s = ref<CronExpression | null>(null);
    const expression_e = ref<CronExpression | null>(null);

    const startCron = reactive<ICronFields>(init());
    const endCron = reactive<ICronFields>(init());

    watch(value, ({ start, end }) => {
        if (start) parse(start, expression_s, startCron);
        if (end) parse(end, expression_e, endCron);
    });

    const getCronStringifyValue = () => {
        const start = stringify(expression_s, startCron);
        const end = stringify(expression_e, endCron);
        return { start, end };
    };

    return { startCron, endCron, getCronStringifyValue };
};
