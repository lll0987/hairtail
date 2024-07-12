/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly MAIN_VITE_MONGO_URI: string;
    readonly MAIN_VITE_ZP_API_KEY: string;
    readonly MAIN_VITE_ZP_API_SECRET: string;
    readonly MAIN_VITE_ZP_ASSISTANT_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
