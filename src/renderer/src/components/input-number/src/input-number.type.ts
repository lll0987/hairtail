import { ValueProps } from '@renderer/hooks';
import { ItemProps, StateProps } from '../..';

export type InputNumberType = number | null;

export interface InputNumberProps extends ValueProps<InputNumberType>, StateProps, ItemProps {
    max?: number;
    min?: number;
}
