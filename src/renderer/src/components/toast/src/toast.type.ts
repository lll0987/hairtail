import type { InjectionKey } from 'vue';
import type { TCStatus } from '@contracts/component';

export interface ToastApi {
    info: (message: string) => void;
    success: (message: string) => void;
    warning: (message: string) => void;
    error: (message: string) => void;
}
export const ToastApiInjectionKey: InjectionKey<ToastApi> = Symbol('toast-api');

export type MessageType = Extract<TCStatus, 'error' | 'success' | 'warning'>;
export interface MessageProps {
    message: string;
    status?: MessageType;
    duration?: number;
}
