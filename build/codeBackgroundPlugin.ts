import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { createCssVariablesTheme, createHighlighter } from 'shiki'
import type { CodeBackgroundFile } from 'virtual:resume-code-background'
import type { Plugin } from 'vite'

const GRAPHEMES = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
const MODULE_ID = 'virtual:resume-code-background'
const RESOLVED_ID = `\0${MODULE_ID}`

// Only these public client files are included in the browser bundle.
const SOURCE_PATHS = [
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
      return id === MODULE_ID ? RESOLVED_ID : undefined
    },
    async load(id, options) {
      if (id !== RESOLVED_ID) return
      if (options?.ssr) return 'export const files = []'

      const tokenizer = await (highlighter ??= createHighlighter({
        langs: ['tsx'],
        themes: [theme],
      }))
      const files: CodeBackgroundFile[] = await Promise.all(
        SOURCE_PATHS.map(async (path) => {
          const filename = resolve(this.environment.config.root, path)
          this.addWatchFile(filename)
          const source = await readFile(filename, 'utf8')
          const lines = tokenizer.codeToTokensBase(source.trimEnd(), {
            lang: 'tsx',
            theme,
          })
          return {
            path,
            lines: lines.map((line) => {
              const text = line.map(({ content }) => content).join('')
              let cells = 0
              for (const { segment } of GRAPHEMES.segment(text)) {
                cells += segment === '\t' ? 2 - (cells % 2) : 1
              }

              return {
                cells,
                tokens: line.map(({ content, offset, color }) =>
                  color === undefined ? { content, offset } : { content, offset, color },
                ),
              }
            }),
          }
        }),
      )

      return `export const files = ${JSON.stringify(files)}`
    },
    hotUpdate({ file, modules, timestamp }) {
      const root = this.environment.config.root
      if (!SOURCE_PATHS.some((path) => resolve(root, path) === file)) return

      const graph = this.environment.moduleGraph
      const background = graph.getModuleById(RESOLVED_ID)
      if (!background || modules.includes(background)) return

      graph.invalidateModule(background, new Set(), timestamp, true)
      return [...modules, background]
    },
  }
}
