import type { ILabelProps, IValidateProps, ValueEmit, ValueProps } from '@renderer/hooks';
import type { FieldProps } from '@renderer/components';
import type { InputParseType } from './use-input-value';

export interface InputEmits extends ValueEmit<string> {}
export interface InputProps
    extends ValueProps<string>,
        Pick<FieldProps, 'disabled' | 'size'>,
        Partial<ILabelProps>,
        IValidateProps {
    parse?: InputParseType;
}
