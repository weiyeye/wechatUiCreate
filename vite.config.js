import { defineConfig, loadEnv } from "vite";
import vue from '@vitejs/plugin-vue'
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const { VITE_BASE_PATH } = loadEnv(mode, process.cwd());
  const tauriDevHost = process.env.TAURI_DEV_HOST;
  const isTauri = Boolean(process.env.TAURI_ENV_PLATFORM);

  return {
    // 保留网页端子路径部署，同时确保桌面端从应用根路径加载资源
    base: isTauri ? "/" : VITE_BASE_PATH,
    clearScreen: false,
    plugins: [vue()],
    resolve: {
      // ↓路径别名，主要是这部分
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    server: {
      host: tauriDevHost || "127.0.0.1",
      // Tauri 依赖固定端口，端口占用时应立即报错而不是自动切换
      strictPort: true,
      open: !isTauri,
      port: 9527,
      watch: {
        // Rust 构建产物不需要触发 Vite 热更新
        ignored: ["**/src-tauri/**"],
      },
    },
    envPrefix: ["VITE_", "TAURI_ENV_*"],
    build: {
      // 桌面端依据系统 WebView 设置兼容目标
      target: isTauri
        ? (process.env.TAURI_ENV_PLATFORM === "windows" ? "chrome105" : "safari13")
        : "modules",
      minify: process.env.TAURI_ENV_DEBUG ? false : "esbuild",
      sourcemap: Boolean(process.env.TAURI_ENV_DEBUG),
      chunkSizeWarningLimit: 5000, // 设置你希望的块大小警告限制，单位是字节
    },
  };
});
