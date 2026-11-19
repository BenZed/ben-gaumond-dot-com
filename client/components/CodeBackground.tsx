import { lazy, Suspense, useEffect, useState } from 'react'

// Load the animated scene and highlighted source on demand to keep the initial bundle smaller.
// Suspense leaves the background blank while it loads because the scene is decorative.
const CodeBackgroundScene = lazy(() =>
  import('./CodeBackgroundScene').then(({ CodeBackgroundScene }) => ({
    default: CodeBackgroundScene,
  })),
)

export function CodeBackground() {
  const [seenOnScreen, setSeenOnScreen] = useState(false)

  // A print-only render skips the scene. Opening print from the site keeps the intro state.
  useEffect(() => {
    const screen = window.matchMedia('screen')
    const show = () => {
      if (!screen.matches) return
      setSeenOnScreen(true)
      screen.removeEventListener('change', show)
    }

    screen.addEventListener('change', show)
    const frame = requestAnimationFrame(show)
    return () => {
      cancelAnimationFrame(frame)
      screen.removeEventListener('change', show)
    }
  }, [])

  if (import.meta.env.SSR || !seenOnScreen) return undefined

  return (
    <Suspense>
      <CodeBackgroundScene />
    </Suspense>
  )
}
