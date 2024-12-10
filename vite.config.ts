import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import path from 'path';
import { fileURLToPath } from 'url';
import { viteStaticCopy } from "vite-plugin-static-copy";
import suidPlugin from "@suid/vite-plugin";

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default defineConfig({
  plugins: [
    solidPlugin(),
    suidPlugin(),
    viteStaticCopy({
      targets: [
        {
          src: "src/extension/manifest.json", // 需要复制的文件
          dest: "."      // 打包后的目标目录
        }
      ]
    })
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        option: path.resolve(__dirname, "./option.html"),
        popup: path.resolve(__dirname, "./popup.html"),
        service_worker: path.resolve(__dirname, "./src/extension/service_worker.ts"),
      },
      output: {
        entryFileNames: "[name].js", // JS 文件
        chunkFileNames: "[name].js", // 分块 JS 文件
      }
    },
  },
});
