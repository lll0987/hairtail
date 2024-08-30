import { TCSize } from '@contracts/component';
import { ILabelProps, IValidateProps, ValueEmit, ValueProps } from '@renderer/hooks';

export type CronPickerType = {
    start: string;
    end: string;
};

export interface CronPickerEmits extends ValueEmit<CronPickerType> {}
export interface CronPickerProps extends ValueProps<CronPickerType>, Partial<ILabelProps>, IValidateProps {
    size?: TCSize;
    disabled?: boolean;
}

export const cronOptions = { all: 0, day: 1 } as const;
export type CronOption = (typeof cronOptions)[keyof typeof cronOptions];
