import { computed, ref, toRef } from 'vue';
import type { InputProps } from '..';

export type InputParseType = 'number';

const parseNumber = (value: string) => {
    const val = parseFloat(value);
    if (isNaN(val)) return '';
    return val + '';
};

const handlers = {
    number: parseNumber
} as const;

export const useInputValue = (props: InputProps) => {
    const inputValue = ref('');

    const parse = toRef(props, 'parse');
    const parseValue = computed(() => {
        if (parse.value === undefined) return inputValue.value;
        const handler = handlers[parse.value];
        return handler(inputValue.value);
    });

    return { inputValue, parseValue };
};
