import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks: {
  //         // 将 React 和 React DOM 拆分到一个单独的 chunk 中
  //         "react-vendors": ["react", "react-dom"],
  //       },
  //     },
  //   },
  //   chunkSizeWarningLimit: 600,
  // },
});
