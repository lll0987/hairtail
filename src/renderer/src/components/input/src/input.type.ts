import type { ILabelProps, IValidateProps, ValueEmit, ValueProps } from '@renderer/hooks';
import type { InputParseType } from './use-input-value';

export interface InputEmits extends ValueEmit<string> {}
export interface InputProps extends ValueProps<string>, Partial<ILabelProps>, IValidateProps {
    readonly?: boolean;
    disabled?: boolean;
    parse?: InputParseType;
}
