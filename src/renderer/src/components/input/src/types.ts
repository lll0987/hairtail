export interface FieldProps {
    borderWidth?: 0 | 1 | 2;
    borderColor?: string;
    label?: string;
    errorMsg?: string;
    warnMsg?: string;
    succMsg?: string;
    msg?: string;
}

export interface InputProps {
    modelValue?: string;
    label?: string;
}
