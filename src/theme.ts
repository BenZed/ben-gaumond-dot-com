import { Badge, Button, createTheme } from '@mantine/core'

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
