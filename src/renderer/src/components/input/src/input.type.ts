import { ItemProps } from '@renderer/components';
import { ValueProps } from '@renderer/hooks';

export interface StateProps {
    readonly?: boolean;
    disabled?: boolean;
}

export interface InputProps extends ValueProps<string>, StateProps, ItemProps {}
