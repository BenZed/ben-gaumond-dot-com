import { join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import type { Plugin } from 'vite'

import type * as Client from '../client'

const APP_PLACEHOLDER = '<!--app-html-->'
const DATA_PLACEHOLDER = '<!--resume-data-->'

export function resumePrerenderPlugin(resume: Client.Resume): Plugin {
  let App: typeof Client.App | undefined

  return {
    name: 'resume-prerender',
    apply: 'build',
    config: ({ cacheDir = 'node_modules/.vite' }) => ({
      builder: { sharedConfigBuild: true },
      environments: {
        ssr: {
          build: {
            ssr: fileURLToPath(new URL('../client/App.tsx', import.meta.url)),
            outDir: join(cacheDir, 'resume-ssr'),
            copyPublicDir: false,
            write: true,
            rolldownOptions: {
              output: {
                entryFileNames: '[name]-[hash].mjs',
                chunkFileNames: '[name]-[hash].mjs',
              },
            },
          },
        },
      },
    }),
    async buildApp(builder) {
      const { client, ssr } = builder.environments
      if (!client || !ssr) throw new Error('Resume prerendering requires client and SSR builds')

      const build = await builder.build(ssr)
      if (!('output' in build)) throw new Error('Expected one SSR build output')

      const entry = build.output.find((chunk) => chunk.type === 'chunk' && chunk.isEntry)
      if (entry?.type !== 'chunk') throw new Error('The SSR build did not produce a resume entry')

      const entryPath = resolve(ssr.config.root, ssr.config.build.outDir, entry.fileName)
      // The bundled config loader leaves this import to Node.
      const ssrModule = (await import(
        /* @vite-ignore */ pathToFileURL(entryPath).href
      )) as typeof Client
      App = ssrModule.App

      await builder.build(client)
    },
    transformIndexHtml(html) {
      if (!App) throw new Error('The resume SSR entry must be built before transforming HTML')
      return renderResumePage(html, resume, App)
    },
  }
}

export function renderResumePage(template: string, resume: Client.Resume, App: typeof Client.App) {
  if (!template.includes(APP_PLACEHOLDER)) throw new Error('Missing resume HTML placeholder')
  if (!template.includes(DATA_PLACEHOLDER)) throw new Error('Missing resume JSON placeholder')
  const markup = renderToString(createElement(App, resume))

  // Escape tag openers so a value cannot close the script element.
  const snapshot = JSON.stringify(resume).replaceAll('<', '\\u003c')
  return template
    .replace(
      DATA_PLACEHOLDER,
      () => `<script type="application/json" id="resume-data">${snapshot}</script>`,
    )
    .replace(APP_PLACEHOLDER, () => markup)
}

// Internal
