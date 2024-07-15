import { inject } from 'vue';
import { ToastApi } from './types';

export const useToast = () => {
    const api = inject<ToastApi>('toast-api');
    console.log(api);
    if (api) return api;
    throw new Error('[useToast]: No outer <toast-provider /> founded.');
};

export { default as ToastProvider } from './provider.vue';
