import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'
import { visualizer } from "rollup-plugin-visualizer";


import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


const INVALID_CHAR_REGEX = /[\x00-\x1F\x7F<>*#"{}|^[\]`;?:&=+$,]/g;
const DRIVE_LETTER_REGEX = /^[a-z]:/i;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/extension/manifest.json', // 需要复制的文件
          dest: '.', // 打包后的目标目录
        },
      ],
    }),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      emitFile: false,
      filename: "test.html", //分析图生成的文件名
      open: false //如果存在本地服务端口，将在打包后自动展示
    }),
    // ElementPlus(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  // esbuild: {
  //   format: 'iife',
  // },
  build: {
    target: 'esnext',

    rollupOptions: {
      input: {
        option: path.resolve(__dirname, './option.html'),
        popup: path.resolve(__dirname, './popup.html'),
        service_worker: path.resolve(__dirname, './src/extension/service_worker.ts'),
      },
      output: {
        entryFileNames: '[name].js', // JS 文件
        chunkFileNames: '[name].js', // 分块 JS 文件
        sanitizeFileName(name: string){
          const match = DRIVE_LETTER_REGEX.exec(name);
          const driveLetter = match ? match[0] : '';
          return (
            driveLetter +
            name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, "")
          );
        }
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
