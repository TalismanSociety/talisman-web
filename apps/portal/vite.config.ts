import path from 'path'

import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import svgr from 'vite-plugin-svgr'
import topLevelAwait from 'vite-plugin-top-level-await'
import wasm from 'vite-plugin-wasm'

export default defineConfig({
  optimizeDeps: {
    // getting dev error without this setting
    exclude: ['node_modules/.vite/deps'],
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    svgr(),
    nodePolyfills(),
    wasm(),
    topLevelAwait(),
  ],
  build: {
    outDir: 'build',
    rollupOptions: {
      shimMissingExports: true,
    },
  },
  worker: {
    // https://github.com/vitejs/vite/pull/12629
    format: 'es',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
