import { ItemProps, StateProps, ValueProps } from '@renderer/components';

export interface InputNumberProps extends ValueProps<number | null>, StateProps, ItemProps {
    max?: number;
    min?: number;
}
