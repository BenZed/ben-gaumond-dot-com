import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { html, resumeRepresentation } from './server/representations'

const serverTarget = `http://127.0.0.1:${process.env['PORT'] ?? 3000}`

const clientConfig = defineConfig({
  appType: 'mpa',
  plugins: [react()],
  build: { outDir: 'dist/client' },
  server: {
    fs: {
      deny: [
        '.env',
        '.env.*',
        '*.{crt,pem,key,p12,pfx,cer,der}',
        '.npmrc',
        '.yarnrc.yml',
        '**/.git/**',
        '**/content/resume.json',
      ],
    },
    proxy: {
      '^/(?:\\?|$)': {
        target: serverTarget,
        bypass(request, response) {
          if (request.headers.accept === 'text/x-vite-ping') return request.url
          if (
            (request.method === 'GET' || request.method === 'HEAD') &&
            resumeRepresentation(request.headers.accept) === html
          ) {
            response?.appendHeader('Vary', 'Accept')
            return '/index.html'
          }
          return undefined
        },
      },
      '^/health(?:\\?|$)': serverTarget,
    },
  },
})

export default defineConfig(({ isSsrBuild }) =>
  isSsrBuild
    ? { build: { outDir: 'dist/server', copyPublicDir: false, target: 'node22' } }
    : clientConfig,
)
