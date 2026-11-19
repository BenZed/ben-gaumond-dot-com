import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import type { Plugin } from 'vite'

import type { App as ResumeApp } from '../client/App'
import type { Resume } from '../client/Resume'

const appPlaceholder = '<div id="root"><!--app-html--></div>'
const dataPlaceholder = '<!--resume-data-->'

export function renderResumePage(template: string, resume: Resume, App: typeof ResumeApp) {
  if (!template.includes(appPlaceholder)) throw new Error('Missing resume HTML placeholder')
  if (!template.includes(dataPlaceholder)) throw new Error('Missing resume data placeholder')
  const markup = renderToString(createElement(App, resume))
  // Escape tag openers so a value cannot close the script element.
  const snapshot = JSON.stringify(resume).replaceAll('<', '\\u003c')
  return template
    .replace(
      dataPlaceholder,
      () => `<script type="application/json" id="resume-data">${snapshot}</script>`,
    )
    .replace(appPlaceholder, () => `<div id="root">${markup}</div>`)
}

export function resumePrerenderPlugin(resume: Resume): Plugin {
  let App: typeof ResumeApp | undefined

  return {
    name: 'resume-prerender',
    apply: 'build',
    config: () => ({
      builder: { sharedConfigBuild: true },
      environments: {
        ssr: {
          build: {
            ssr: fileURLToPath(new URL('../client/App.tsx', import.meta.url)),
            write: false,
            rolldownOptions: { output: { codeSplitting: false } },
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

      // Keep the temporary entry under the project so Node can resolve its package imports.
      const directory = await mkdtemp(join(builder.config.root, 'node_modules', '.resume-ssr-'))
      try {
        const entryPath = join(directory, 'App.mjs')
        await writeFile(entryPath, entry.code)
        // The bundled config loader leaves this import to Node.
        const module = (await import(/* @vite-ignore */ pathToFileURL(entryPath).href)) as {
          readonly App: typeof ResumeApp
        }
        App = module.App
        await builder.build(client)
      } finally {
        await rm(directory, { recursive: true, force: true })
      }
    },
    transformIndexHtml(html) {
      if (!App) throw new Error('The resume SSR entry must be built before transforming HTML')
      return renderResumePage(html, resume, App)
    },
  }
}
