import { useMediaQuery } from '@mantine/hooks'
import { lazy, Suspense } from 'react'

const CodeBackgroundScene = lazy(() =>
  import('./CodeBackgroundScene').then(({ CodeBackgroundScene }) => ({
    default: CodeBackgroundScene,
  })),
)

export function CodeBackground() {
  const screen = useMediaQuery('screen', false)

  if (import.meta.env.SSR || !screen) return null

  return (
    <Suspense fallback={null}>
      <CodeBackgroundScene />
    </Suspense>
  )
}
