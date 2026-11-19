import { useCallback, useEffect, useRef } from 'react'

type WriteOnAnimation = {
  readonly from: 0 | 1
  readonly to: 0 | 1
  readonly duration: number
  readonly steps: number
  readonly delay?: number
}

export function useWriteOn<Element extends HTMLElement>(animation?: WriteOnAnimation) {
  const ref = useRef<Element>(null)

  // The same reveal coordinates describe one header label or a column of code.
  const write = useCallback((progress: number, lines = 1) => {
    const element = ref.current
    if (!element) return

    const position = Math.min(1, Math.max(0, progress)) * lines
    const completed = Math.min(lines - 1, Math.floor(position))
    element.style.setProperty('--write-on-lines', `${completed}`)
    element.style.setProperty('--write-on-column', `${(position - completed) * 100}%`)
  }, [])

  useEffect(() => {
    const element = ref.current
    if (!animation || !element) return

    const { from, to, duration, steps, delay = 0 } = animation
    const finish = () => {
      write(to)
      element.setAttribute('data-write-complete', '')
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish()
      return
    }

    element.removeAttribute('data-write-complete')
    write(from)
    const start = performance.now() + delay
    let frame: number
    const tick = (time: number) => {
      if (time >= start + duration) {
        finish()
        return
      }

      const elapsed = Math.max(0, (time - start) / duration)
      const stepped = Math.floor(elapsed * steps) / steps
      write(from + (to - from) * stepped)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [animation, write])

  return { ref, write }
}
