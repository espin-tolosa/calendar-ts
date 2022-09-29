/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_HTML_PROTOCOL: string;
    readonly VITE_TARGET_HOST: string;
    readonly VITE_TARGET_PORT: string;
    readonly VITE_TARGET_USER: string;
    readonly VITE_API_PREFIX: string;
    readonly VITE_EVENT_RESOURCE: string;
    readonly VITE_USER_RESOURCE: string;
    readonly VITE_STYLE_RESOURCE: string;
}
