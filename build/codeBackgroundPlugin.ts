import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { createCssVariablesTheme, createHighlighter } from 'shiki'
import type { CodeBackgroundFile } from 'virtual:resume-code-background'
import type { Plugin } from 'vite'

const moduleId = 'virtual:resume-code-background'
const resolvedId = `\0${moduleId}`

// Only these public client files are included in the browser bundle.
const sourcePaths = [
  'client/components/SiteHeader.tsx',
  'client/components/ProjectPreview.tsx',
  'client/components/SectionNavigation.tsx',
]

export function codeBackgroundPlugin(): Plugin {
  const theme = createCssVariablesTheme({
    name: 'resume-code',
    variablePrefix: '--site-code-',
    fontStyle: false,
  })
  let highlighter: ReturnType<typeof createHighlighter> | undefined

  return {
    name: 'resume-code-background',
    resolveId(id) {
      return id === moduleId ? resolvedId : null
    },
    async load(id, options) {
      if (id !== resolvedId) return
      if (options?.ssr) return 'export const files = []'

      const tokenizer = await (highlighter ??= createHighlighter({
        langs: ['tsx'],
        themes: [theme],
      }))
      const files: CodeBackgroundFile[] = await Promise.all(
        sourcePaths.map(async (path) => {
          const filename = resolve(this.environment.config.root, path)
          this.addWatchFile(filename)
          const source = await readFile(filename, 'utf8')
          const lines = tokenizer.codeToTokensBase(source.trimEnd(), {
            lang: 'tsx',
            theme,
          })
          return {
            path,
            lines: lines.map((line) =>
              line.map(({ content, offset, color }) =>
                color === undefined ? { content, offset } : { content, offset, color },
              ),
            ),
          }
        }),
      )

      return `export const files = ${JSON.stringify(files)}`
    },
    hotUpdate({ file, modules, timestamp }) {
      const root = this.environment.config.root
      if (!sourcePaths.some((path) => resolve(root, path) === file)) return

      const graph = this.environment.moduleGraph
      const background = graph.getModuleById(resolvedId)
      if (!background || modules.includes(background)) return

      graph.invalidateModule(background, new Set(), timestamp, true)
      return [...modules, background]
    },
  }
}
