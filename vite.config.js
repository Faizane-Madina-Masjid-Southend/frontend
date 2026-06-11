import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    headers: {
      "Content-Security-Policy": "frame-ancestors 'self' https://yqwebstudio.com https://*.yqwebstudio.com;",
    },
  },
  preview: {
    headers: {
      "Content-Security-Policy": "frame-ancestors 'self' https://yqwebstudio.com https://*.yqwebstudio.com;",
    },
  },
});
