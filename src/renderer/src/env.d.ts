/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

import type { AttributifyAttributes } from '@unocss/preset-attributify';

declare module '@vue/runtime-dom' {
    interface HTMLAttributes extends AttributifyAttributes {}
}
