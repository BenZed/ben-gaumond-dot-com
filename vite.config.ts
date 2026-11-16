import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const clientConfig = defineConfig({
  plugins: [react()],
  build: { outDir: 'dist/client' },
  server: { proxy: { '/api': 'http://127.0.0.1:3000' } },
})

export default defineConfig(({ isSsrBuild }) =>
  isSsrBuild
    ? { build: { outDir: 'dist/server', copyPublicDir: false, target: 'node22' } }
    : clientConfig,
)
