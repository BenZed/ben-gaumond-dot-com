import { ColorSchemeScript } from '@mantine/core'
import react from '@vitejs/plugin-react'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { defineConfig } from 'vite'

export default defineConfig({
  appType: 'mpa',
  base: './',
  plugins: [
    react(),
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
