import type { InjectionKey } from 'vue';

export interface ToastApi {
    info: (message: string) => void;
    success: (message: string) => void;
    warning: (message: string) => void;
    error: (message: string) => void;
}
export const ToastApiInjectionKey: InjectionKey<ToastApi> = Symbol('toast-api');

export type MessageType = 'info' | 'success' | 'warning' | 'error';

export interface MessageProps {
    message: string;
    type?: MessageType;
    duration?: number;
}
