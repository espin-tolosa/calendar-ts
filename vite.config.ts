import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: resolve(__dirname, './dist'),
    emptyOutDir: true,
    rollupOptions: {
        input: {
            master: resolve(__dirname, 'master.blade.html'),
            partner: resolve(__dirname, 'partner.blade.html'),
            client: resolve(__dirname, 'client.blade.html'),
        }
    }
  }
});
