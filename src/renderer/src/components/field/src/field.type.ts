export type ItemStatus = 'error' | 'warning' | 'success' | 'default';

export interface ItemProps {
    label?: string;
    inline?: boolean;
}

export interface FieldProps extends ItemProps {
    borderWidth?: 0 | 1 | 2;
    borderColor?: string;
    msg?: string;
    status?: ItemStatus;
}
