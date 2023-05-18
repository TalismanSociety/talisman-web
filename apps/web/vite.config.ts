import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgrPlugin from 'vite-plugin-svgr'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    viteTsconfigPaths(),
    svgrPlugin(),
  ],
  envPrefix: 'REACT_APP_',
  build: {
    outDir: 'build',
  },
  worker: {
    // https://github.com/vitejs/vite/pull/12629
    format: 'es',
  },
})
