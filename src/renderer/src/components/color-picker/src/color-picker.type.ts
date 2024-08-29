import { TCSize } from '@contracts/component';
import { ValueEmit, ValueProps } from '@renderer/hooks';

export interface ColorPickerEmits extends ValueEmit<string> {}
export interface ColorPickerProps extends ValueProps<string> {
    size?: TCSize;
    readonly?: boolean;
}
