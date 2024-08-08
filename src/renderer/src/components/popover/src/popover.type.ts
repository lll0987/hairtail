import { InjectionKey, Reactive } from 'vue';

export interface PopoverProps {
    show: boolean;
}

export interface PopoverApi {
    contentRef?: HTMLElement | null;
    top?: number;
    left?: number;
}

export const PopoverApiKey: InjectionKey<Reactive<PopoverApi>> = Symbol('popover-api');
