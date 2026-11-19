import { useEffect, useRef } from 'react'

import styles from './useWriteOn.module.css'

const PROGRESS_PROPERTY = '--write-on-column'
const COMPLETE_ATTRIBUTE = 'data-write-complete'

export type WriteOnAnimation = {
  readonly from: 0 | 1
  readonly to: 0 | 1
  readonly duration: number
  readonly steps: number
  readonly delay?: number
}

/**
 * Returns the ref and style bindings for a stepped text reveal or erase.
 * Spread the returned props onto the element to animate. Omit the animation
 * to show the element normally. Timing is in milliseconds.
 */
export function useWriteOn<E extends HTMLElement>(animation?: WriteOnAnimation) {
  const ref = useRef<E>(null)

  useEffect(() => {
    const element = ref.current
    if (!animation || !element) return
    return animateWriteOn(element, animation)
  }, [animation])

  return {
    ref,
    className: animation ? styles['write-on'] : undefined,
    'data-write': animation ? (animation.to === 1 ? 'in' : 'out') : undefined,
  } as const
}

// Internal

function animateWriteOn(
  element: HTMLElement,
  { from, to, duration, steps, delay = 0 }: WriteOnAnimation,
) {

  const write = (progress: number) =>
    element.style.setProperty(PROGRESS_PROPERTY, `${progress * 100}%`)

  const finish = () => {
    write(to)
    element.setAttribute(COMPLETE_ATTRIBUTE, '')
  }

  let frame: number | undefined

  const cleanup = () => {
    if (frame !== undefined) cancelAnimationFrame(frame)
    element.style.removeProperty(PROGRESS_PROPERTY)
    element.removeAttribute(COMPLETE_ATTRIBUTE)
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finish()
    return cleanup
  }

  write(from)

  const start = performance.now() + delay

  const tick = (time: number) => {
    if (time >= start + duration) {
      finish()
      return
    }

    const elapsed = Math.max(0, (time - start) / duration)
    // Quantize progress so the clip edge moves in steps.
    const stepped = Math.floor(elapsed * steps) / steps
    write(from + (to - from) * stepped)
    frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)
  return cleanup
}
