import type { ComputedRef, InjectionKey, Ref } from 'vue';
import type { ILabelProps, IValidateProps, ValueEmit, ValueProps } from '@renderer/hooks';

export type SelectValue = string | string[];

export interface SelectItem {
    label: string;
    value: string;
    [k: string]: string;
}

export interface SelectEmits extends ValueEmit<SelectValue> {}
export interface SelectProps extends ValueProps<SelectValue>, Partial<ILabelProps>, IValidateProps {
    readonly?: boolean;
    disabled?: boolean;
    options?: SelectItem[];
    loading?: boolean;
    'label-field'?: string;
    'value-field'?: string;
    multiple?: boolean;
    match?: string;
}

export interface SelectApi {
    loading: Ref<boolean>;
    matchOptions: ComputedRef<SelectItem[]>;
    updateShow: (state: boolean) => void;
    updateFoucus: (index?: number) => void;
    isFocus: (index: number) => boolean;
    handleItemSelected: (item?: SelectItem) => void;
}

export const SelectApiKey: InjectionKey<SelectApi> = Symbol('select-api');
