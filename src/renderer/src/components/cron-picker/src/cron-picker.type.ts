import { ILabelProps, IValidateProps, ValueEmit, ValueProps } from '@renderer/hooks';
import { FieldProps } from '@renderer/components';

export type CronPickerType = {
    start: string;
    end: string;
};

export interface CronPickerEmits extends ValueEmit<CronPickerType> {}
export interface CronPickerProps
    extends ValueProps<CronPickerType>,
        Pick<FieldProps, 'disabled' | 'size'>,
        Partial<ILabelProps>,
        IValidateProps {}

export const cronOptions = { all: 0, day: 1 } as const;
export type CronOption = (typeof cronOptions)[keyof typeof cronOptions];
