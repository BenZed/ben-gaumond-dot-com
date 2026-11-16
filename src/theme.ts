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
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  headings: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: '400' },
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
