import { useRef } from 'react'
import type { CSSProperties } from 'react'

import styles from './useWriteOn.module.css'

export type WriteOnAnimation = {
  readonly from: 0 | 1
  readonly to: 0 | 1
  readonly duration: number
  readonly steps: number
  readonly delay?: number
  readonly axis?: 'inline' | 'block'
}

/**
 * Returns props for a stepped reveal or erase. Spread them onto the element
 * to animate. Omit the animation to show the element normally. CSS handles
 * playback and reduced motion. Timing is in milliseconds.
 */
export function useWriteOn<E extends HTMLElement>(animation?: WriteOnAnimation) {
  const ref = useRef<E>(null)

  return {
    ref,
    className: animation ? styles['write-on'] : undefined,
    style: animation ? animationStyle(animation) : undefined,
    'data-write': animation ? (animation.to === 1 ? 'in' : 'out') : undefined,
    'data-write-axis': animation?.axis,
  } as const
}

// Internal

type WriteOnStyle = CSSProperties & {
  readonly '--write-on-from': string
  readonly '--write-on-to': string
  readonly '--write-on-steps': number
}

function animationStyle({ from, to, duration, steps, delay = 0 }: WriteOnAnimation): WriteOnStyle {
  return {
    '--write-on-from': `${from * 100}%`,
    '--write-on-to': `${to * 100}%`,
    '--write-on-steps': steps,
    animationDuration: `${duration}ms`,
    animationDelay: `${delay}ms`,
  }
}
