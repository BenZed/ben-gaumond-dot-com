import { useEffect, useRef } from 'react'

export type WriteOnAnimation = {
  readonly from: 0 | 1
  readonly to: 0 | 1
  readonly duration: number
  readonly steps: number
  readonly delay?: number
}

export function useWriteOn<Element extends HTMLElement>(animation?: WriteOnAnimation) {
  const ref = useRef<Element>(null)

  useEffect(() => {
    const element = ref.current
    if (!animation || !element) return

    const { from, to, duration, steps, delay = 0 } = animation
    const write = (progress: number) =>
      element.style.setProperty('--write-on-column', `${progress * 100}%`)
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
  }, [animation])

  return { ref }
}
