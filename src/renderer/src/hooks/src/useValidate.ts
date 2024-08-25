import { computed, ref, toRef } from 'vue';
import type { TCStatus } from '@contracts/component';

// NEXT validate

export interface IValidateProps {
    rule?: string[];
    status?: TCStatus;
}

export const useValidate = (props: IValidateProps) => {
    const feedback = ref('');

    const rule = toRef(props, 'rule');
    const status = toRef(props, 'status');
    const meragedStatus = computed<TCStatus | undefined>(() => {
        if (rule.value === undefined) return status.value;
        return undefined;
    });

    return { feedback, meragedStatus };
};
