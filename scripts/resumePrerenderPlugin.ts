import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Plugin } from 'vite'

import type { Resume } from '../src/Resume'
import type { prerender } from './prerender'

export function resumePrerenderPlugin(resume: Resume): Plugin {
  let renderPage: typeof prerender | undefined

  return {
    name: 'resume-prerender',
    apply: 'build',
    config: () => ({
      builder: { sharedConfigBuild: true },
      environments: {
        ssr: {
          build: {
            ssr: fileURLToPath(new URL('prerender.tsx', import.meta.url)),
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
        const entryPath = join(directory, 'prerender.mjs')
        await writeFile(entryPath, entry.code)
        const renderer = createRequire(import.meta.url)(entryPath) as {
          readonly prerender: typeof prerender
        }
        renderPage = renderer.prerender
        await builder.build(client)
      } finally {
        await rm(directory, { recursive: true, force: true })
      }
    },
    transformIndexHtml(html) {
      if (!renderPage)
        throw new Error('The resume SSR entry must be built before transforming HTML')
      return renderPage(html, resume)
    },
  }
}
