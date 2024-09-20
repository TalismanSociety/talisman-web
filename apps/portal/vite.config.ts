import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
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
  ],
  envPrefix: 'REACT_APP_',
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
