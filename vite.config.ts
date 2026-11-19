import { ColorSchemeScript } from '@mantine/core'
import react from '@vitejs/plugin-react'
import { createElement, Fragment } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { defineConfig } from 'vite'

import resume from './content/resume.json' with { type: 'json' }
import { resumePrerenderPlugin } from './scripts/resumePrerenderPlugin'

function renderResumeMetadata({ name, role, headline, summary }: (typeof resume)['basics']) {
  const title = `${name} — ${role}`
  return renderToStaticMarkup(
    createElement(
      Fragment,
      null,
      createElement('title', null, title),
      createElement('meta', { name: 'description', content: headline }),
      createElement('meta', { property: 'og:title', content: title }),
      createElement('meta', { property: 'og:description', content: summary }),
    ),
  )
}

export default defineConfig({
  appType: 'mpa',
  base: './',
  plugins: [
    react(),
    resumePrerenderPlugin(resume),
    {
      name: 'resume-metadata',
      transformIndexHtml: (html) =>
        html.replace('<!--resume-metadata-->', () => renderResumeMetadata(resume.basics)),
    },
    {
      name: 'initial-color-scheme',
      transformIndexHtml: {
        order: 'pre',
        handler: (html) =>
          html.replace(
            '<head>',
            `<head>${renderToStaticMarkup(createElement(ColorSchemeScript, { defaultColorScheme: 'auto' }))}`,
          ),
      },
    },
  ],
})
