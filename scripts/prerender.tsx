import { readFile, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

import { createServer } from 'vite'

import type { Resume } from '../src/Resume'
import type { renderResume } from './renderResume'

const appPlaceholder = '<div id="root"><!--app-html--></div>'

export async function prerender(template: string, resume: Resume) {
  if (!template.includes(appPlaceholder)) throw new Error('Missing resume HTML placeholder')
  const markup = await renderResumeMarkup(resume)
  // Escape tag openers so a value cannot close the script element.
  const snapshot = JSON.stringify(resume).replaceAll('<', '\\u003c')
  return template.replace(
    appPlaceholder,
    () =>
      `<div id="root">${markup}</div><script type="application/json" id="resume-data">${snapshot}</script>`,
  )
}

async function renderResumeMarkup(resume: Resume) {
  // Use the same CSS Modules transform as the browser build.
  const vite = await createServer({
    configLoader: 'runner',
    server: { middlewareMode: true, watch: null, ws: false, preTransformRequests: false },
  })
  try {
    const module = (await vite.ssrLoadModule('/scripts/renderResume.tsx')) as {
      readonly renderResume: typeof renderResume
    }
    return module.renderResume(resume)
  } finally {
    await vite.close()
  }
}

// CLI entry point
const entry = process.argv[1]
if (entry && pathToFileURL(entry).href === import.meta.url) {
  const { default: resume } = await import('../content/resume.json', { with: { type: 'json' } })
  const output = new URL('../dist/index.html', import.meta.url)
  const template = await readFile(output, 'utf8')
  await writeFile(output, await prerender(template, resume))
}
