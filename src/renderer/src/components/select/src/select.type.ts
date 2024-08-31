import type { ComputedRef, InjectionKey, Ref } from 'vue';
import type { ILabelProps, IValidateProps, ValueEmit, ValueProps } from '@renderer/hooks';
import type { FieldProps } from '@renderer/components';

export type SelectValue = string | string[];

export interface SelectItem {
    label: string;
    value: string;
    [k: string]: string | number | boolean | null;
}

export interface SelectEmits extends ValueEmit<SelectValue> {}
export interface SelectProps
    extends ValueProps<SelectValue>,
        Pick<FieldProps, 'disabled' | 'size'>,
        Partial<ILabelProps>,
        IValidateProps {
    options?: SelectItem[];
    loading?: boolean;
    multiple?: boolean;
    match?: string;
}

export interface SelectApi {
    loading: Ref<boolean>;
    matchOptions: ComputedRef<SelectItem[]>;
    updateShow: (state: boolean) => void;
    updateFoucus: (index?: number) => void;
    isFocus: (index: number) => boolean;
    isSelected: (item: SelectItem) => boolean;
    handleItemSelected: (item?: SelectItem) => void;
}

export const SelectApiKey: InjectionKey<SelectApi> = Symbol('select-api');
