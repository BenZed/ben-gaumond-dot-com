import { useCallback, useEffect, useRef } from 'react'

/**
 * Coalesces scroll events and manual update requests into one update per frame.
 *
 * @remarks
 * The hook cancels queued work when disabled, when the update callback changes,
 * or when the caller unmounts. Callers choose when to perform their first update.
 *
 * @param update - The callback to run in the next animation frame.
 * @param enabled - Whether scroll events and manual requests may queue updates.
 * @returns A scheduler that resize observers and other layout events can share.
 */
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
