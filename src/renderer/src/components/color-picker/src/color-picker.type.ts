import { FieldProps } from '@renderer/components';
import { ValueEmit, ValueProps } from '@renderer/hooks';

export interface ColorPickerEmits extends ValueEmit<string> {}
export interface ColorPickerProps extends ValueProps<string>, Pick<FieldProps, 'disabled' | 'size'> {}
