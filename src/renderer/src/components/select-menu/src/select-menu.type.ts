import type { ComputedRef, InjectionKey, Reactive } from 'vue';
import { EVENT_KEY } from '@renderer/constants';
import { ValueEmit, ValueProps } from '@renderer/hooks';

export type SelectValue = string | string[];

export interface SelectItem {
    label: string;
    value: string;
}

export interface SelectMenuProps extends ValueProps<SelectValue> {
    show?: boolean;
    options?: SelectItem[];
    loading?: boolean;
    multiple?: boolean;
    filter?: string;
}

export interface SelectMenuEmits extends ValueEmit<SelectValue> {
    (e: 'update:show', value: boolean): void;
}

export type ArrowKey = EVENT_KEY.DOWN | EVENT_KEY.UP;

export interface SelectState {
    focusIndex: number;
    multiple: boolean;
}

export interface SelectApi {
    state: Reactive<SelectState>;
    filterOptions: ComputedRef<SelectItem[]>;
    selectValue: ComputedRef<string[]>;
    updateValue: (value: SelectValue) => void;
    updateFoucus: (index: number) => void;
    handleAutoFocus: () => void;
    handleArrowEvent: (key: ArrowKey) => void;
    onItemSelect: (item?: SelectItem) => void;
}

export const SelectApiKey: InjectionKey<SelectApi> = Symbol('select-api');
