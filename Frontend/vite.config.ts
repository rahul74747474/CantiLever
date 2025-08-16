export default defineConfig({
  root: ".",
  base: "/",   // 👈 required for Vercel SPA deployment
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist/spa",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@swc/core": "@swc/wasm",
    },
  },
});
