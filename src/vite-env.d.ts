/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_LOGIN: string;
  readonly VITE_API_EVENT: string;
  readonly VITE_API_TEST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
