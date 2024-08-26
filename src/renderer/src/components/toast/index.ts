import { inject } from 'vue';
import { ToastApiInjectionKey } from './src/toast.type';

export * from './src/toast.type';

export const useToast = () => {
    const api = inject(ToastApiInjectionKey);
    if (api) return api;
    throw new Error('[useToast]: No outer <toast-provider /> founded.');
};

export { default as ToastProvider } from './src/provider.vue';
