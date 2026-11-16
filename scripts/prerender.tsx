import { readFile, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

import { renderToString } from 'react-dom/server'

import { App } from '../src/App'
import type { Resume } from '../src/Resume'

const appPlaceholder = '<div id="root"><!--app-html--></div>'

export function prerender(template: string, resume: Resume) {
  if (!template.includes(appPlaceholder)) throw new Error('Missing resume HTML placeholder')
  const markup = renderToString(<App resume={resume} />)
  // Escape tag openers so a value cannot close the script element.
  const snapshot = JSON.stringify(resume).replaceAll('<', '\\u003c')
  return template.replace(
    appPlaceholder,
    () =>
      `<div id="root">${markup}</div><script type="application/json" id="resume-data">${snapshot}</script>`,
  )
}

const entry = process.argv[1]
if (entry && pathToFileURL(entry).href === import.meta.url) {
  const { default: resume } = await import('../content/resume.json', { with: { type: 'json' } })
  const output = new URL('../dist/index.html', import.meta.url)
  const template = await readFile(output, 'utf8')
  await writeFile(output, prerender(template, resume))
}
