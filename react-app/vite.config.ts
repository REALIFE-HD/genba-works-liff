import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/** GitHub Pages 本番: https://toyama2026.github.io/genba-works-liff/ */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/genba-works-liff/",
  build: {
    outDir: "..",
    emptyOutDir: false,
    assetsDir: "assets",
  },
});
