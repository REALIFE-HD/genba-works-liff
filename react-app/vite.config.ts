import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/** GitHub Pages: https://toyama2026.github.io/genba-works-liff/app/ */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/genba-works-liff/app/",
  build: {
    outDir: "../app",
    emptyOutDir: true,
  },
});
