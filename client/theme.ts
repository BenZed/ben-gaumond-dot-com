import { Badge, Button, Title, createTheme } from '@mantine/core'
import type { CSSVariablesResolver } from '@mantine/core'

import typography from './Typography.module.css'

export const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {
    '--site-background': 'light-dark(#faf4eb, #191613)',
    '--site-text': 'light-dark(#29221c, #f5e9da)',
    '--site-secondary': 'light-dark(#61554b, #d1bdab)',
    '--site-muted': 'light-dark(#706154, #bea791)',
    '--site-heading': 'light-dark(#b34300, #ff8a38)',
    '--site-accent': 'light-dark(#a33d00, #ff8a38)',
    '--site-panel': 'light-dark(#f1e4d4, #2b211a)',
    '--site-border': 'light-dark(#ddcbbb, #514031)',
    '--site-copper': 'light-dark(#d95000, #ff690a)',
    '--site-focus': 'light-dark(#a33d00, #ffad6c)',
    '--site-action': 'light-dark(#ff690a, #ff8a38)',
    '--site-action-hover': 'light-dark(#ed5b00, #ffa15b)',
    '--site-on-action': '#241409',
    '--site-art-warm': 'light-dark(#f2b47e, #643114)',
    '--site-art-cool': 'light-dark(#e9d8c3, #382b20)',
    '--site-art-ink': 'light-dark(#472a18, #ffe4c6)',
    '--site-code-foreground': 'var(--site-text)',
    '--site-code-token-comment': 'var(--site-muted)',
    '--site-code-token-constant': 'light-dark(#715083, #cf9be9)',
    '--site-code-token-function': 'light-dark(#275c83, #8cc9f5)',
    '--site-code-token-keyword': 'var(--site-accent)',
    '--site-code-token-parameter': 'var(--site-secondary)',
    '--site-code-token-punctuation': 'var(--site-muted)',
    '--site-code-token-string': 'light-dark(#356445, #a4ce9f)',
    '--site-code-token-string-expression': 'var(--site-code-token-string)',
  },
  light: { '--site-code-opacity': '0.13' },
  dark: { '--site-code-opacity': '0.16' },
})

export const theme = createTheme({
  primaryColor: 'ember',
  colors: {
    ember: [
      '#fff2e8',
      '#ffdfc6',
      '#ffbd91',
      '#ff995b',
      '#ff7c2e',
      '#ff690a',
      '#eb5900',
      '#c44800',
      '#a23900',
      '#842f00',
    ],
  },
  fontFamily: '"Instrument Sans Variable", Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: '"Archivo Variable", "Arial Black", Impact, sans-serif',
    fontWeight: '900',
  },
  defaultRadius: 'sm',
  components: {
    Title: Title.extend({ classNames: { root: typography['title'] ?? '' } }),
    Button: Button.extend({
      vars: (_theme, props) => ({
        root:
          props.variant === 'subtle'
            ? { '--button-color': 'var(--site-accent)', '--button-hover': 'var(--site-panel)' }
            : {
                '--button-bg': 'var(--site-action)',
                '--button-hover': 'var(--site-action-hover)',
                '--button-color': 'var(--site-on-action)',
              },
      }),
    }),
    Badge: Badge.extend({
      vars: () => ({
        root: { '--badge-color': 'var(--site-accent)', '--badge-bg': 'var(--site-panel)' },
      }),
    }),
  },
})
