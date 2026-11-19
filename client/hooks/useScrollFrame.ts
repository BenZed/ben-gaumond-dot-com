import { useCallback, useEffect, useRef } from 'react'

/** Runs scroll updates at most once per frame. The returned callback queues the same update. */
export function useScrollFrame(update: () => void, enabled = true) {
  const frame = useRef<number | undefined>(undefined)

  const schedule = useCallback(() => {
    if (!enabled || frame.current !== undefined) return
    frame.current = window.requestAnimationFrame(() => {
      frame.current = undefined
      update()
    })
  }, [enabled, update])

  useEffect(() => {
    if (!enabled) return

    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
      if (frame.current !== undefined) window.cancelAnimationFrame(frame.current)
      frame.current = undefined
    }
  }, [enabled, schedule])

  return schedule
}
