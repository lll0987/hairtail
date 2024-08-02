export interface ItemProps {
    legend?: string;
    label?: string;
}

export type ItemStatus = 'error' | 'warning' | 'success' | 'default';

export interface FieldProps extends Pick<ItemProps, 'legend'> {
    borderWidth?: 0 | 1 | 2;
    borderColor?: string;
    msg?: string;
    status?: ItemStatus;
}

export interface ValueProps<T> {
    modelValue?: T;
    defaultValue?: T;
}

export interface StateProps {
    readonly?: boolean;
    disabled?: boolean;
}

export interface InputProps extends ValueProps<string>, StateProps, ItemProps {}
