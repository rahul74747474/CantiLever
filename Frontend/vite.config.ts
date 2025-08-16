import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => ({
  root: "client", // app lives here
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "../dist/spa", // output goes back to Frontend/dist/spa
    emptyOutDir: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@swc/core": "@swc/wasm"
    },
  },
}));
