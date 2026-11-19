import { useRef } from 'react'
import type { CSSProperties, RefObject } from 'react'

import styles from './useWriteOn.module.css'

const GRAPHEMES = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

/** Timing and direction for a stepped clipping animation. */
export type WriteOnAnimation = {
  readonly from: 0 | 1
  readonly to: 0 | 1
  readonly duration: number
  readonly steps: number
  readonly delay?: number
  readonly axis?: 'inline' | 'block'
}

/** Timing and completion callback for revealing text one grapheme at a time. */
export type CharacterWriteOnAnimation = {
  readonly mode: 'characters'
  readonly text: string | undefined
  readonly duration: number
  readonly maxInterval: number
  readonly onComplete: () => void
}

/**
 * Splits text into graphemes and staggers their CSS reveal.
 *
 * @typeParam E - The element type attached to the returned ref.
 * @param animation - Text and timing in milliseconds. Omit the text to skip the reveal.
 * @returns The element ref and per-character props to spread onto aria-hidden spans.
 */
export function useWriteOn<E extends HTMLElement>(
  animation: CharacterWriteOnAnimation,
): { readonly ref: RefObject<E | null>; readonly characters: ReturnType<typeof characterBindings> }

/**
 * Binds a stepped clipping animation to an element. The companion CSS module
 * handles playback, the final state, and reduced motion.
 *
 * @typeParam E - The element type attached to the returned ref.
 * @param animation - Timing in milliseconds, step count, axis, and endpoints.
 * Omit it to render the element without animation.
 * @returns Props to spread onto the element, including its ref.
 */
export function useWriteOn<E extends HTMLElement>(
  animation?: WriteOnAnimation,
): { readonly ref: RefObject<E | null> } & ReturnType<typeof clipBindings>
export function useWriteOn<E extends HTMLElement>(
  animation?: WriteOnAnimation | CharacterWriteOnAnimation,
) {
  const ref = useRef<E>(null)

  if (animation && 'mode' in animation) {
    return { ref, characters: characterBindings(animation) } as const
  }

  return { ref, ...clipBindings(animation) } as const
}

// Internal

function clipBindings(animation?: WriteOnAnimation) {
  return {
    className: animation ? styles['write-on'] : undefined,
    style: animation ? animationStyle(animation) : undefined,
    'data-write': animation ? (animation.to === 1 ? 'in' : 'out') : undefined,
    'data-write-axis': animation?.axis,
  } as const
}

function characterBindings({ text, duration, maxInterval, onComplete }: CharacterWriteOnAnimation) {
  if (!text) return []

  const characters = Array.from(GRAPHEMES.segment(text))
  const interval = Math.min(maxInterval, duration / characters.length)
  return characters.map(({ segment, index }, position) => ({
    key: index,
    text: segment,
    props: {
      className: styles['character'],
      style: { animationDelay: `${position * interval}ms` },
      onAnimationEnd: position === characters.length - 1 ? onComplete : undefined,
    },
  }))
}

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
