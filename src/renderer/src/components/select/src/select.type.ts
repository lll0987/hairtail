import { ItemProps, StateProps, SelectMenuProps, SelectValue } from '@renderer/components';
import { ValueEmit } from '@renderer/hooks';

export interface SelectProps extends Omit<SelectMenuProps, 'show' | 'filter'>, StateProps, ItemProps {
    inline?: boolean;
}

export interface SelectEmits extends ValueEmit<SelectValue> {}
