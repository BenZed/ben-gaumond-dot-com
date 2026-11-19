import { Box } from '@mantine/core'
import { useMergedRef, useReducedMotion } from '@mantine/hooks'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, RefObject } from 'react'
import { files } from 'virtual:resume-code-background'
import type { CodeBackgroundFile } from 'virtual:resume-code-background'

import { useResizeObserver } from '../hooks/useResizeObserver'
import { useScrollFrame } from '../hooks/useScrollFrame'

import styles from './CodeBackgroundScene.module.css'

const PARALLAX = 0.2
const COLUMN_WIDTH = 360
const INTRO_DURATION = 2200
const MAX_LINE_DURATION = 660

export function CodeBackgroundScene() {
  const { viewport, resizeRef } = useCodeViewport()
  const scene = useRef<HTMLDivElement>(null)
  const ref = useMergedRef(scene, resizeRef)
  const [introFinished, setIntroFinished] = useState(false)
  const intro = introFinished ? null : viewport.intro
  useCodeParallax(scene)

  useEffect(() => {
    if (!intro) return
    const timer = window.setTimeout(() => setIntroFinished(true), INTRO_DURATION)
    return () => window.clearTimeout(timer)
  }, [intro])

  if (!files.length) return null

  return (
    <Box className={styles['background']} aria-hidden="true">
      <Box ref={ref} className={styles['scene']}>
        {Array.from({ length: viewport.columns }, (_, index) => {
          const file = files[index % files.length]
          return file ? (
            <CodeColumn
              key={`${file.path}-${index}`}
              file={file}
              viewportLines={viewport.lines}
              intro={intro && index < intro.columns ? intro : null}
            />
          ) : undefined
        })}
      </Box>
    </Box>
  )
}

// Internal

type CodeIntro = {
  readonly columns: number
  readonly lines: number
  readonly offset: number
}

type CodeViewport = {
  readonly columns: number
  readonly lines: number
  readonly intro: CodeIntro | null
}

function useCodeViewport() {
  const [viewport, setViewport] = useState<CodeViewport>({ columns: 0, lines: 0, intro: null })
  const measure = useCallback((scene: HTMLDivElement) => {
    const lineHeight = Number.parseFloat(getComputedStyle(scene).lineHeight)
    const columns = Math.max(1, Math.floor(scene.clientWidth / COLUMN_WIDTH))
    const lines = Math.ceil(scene.clientHeight / lineHeight)
    const offset = (Math.max(0, window.scrollY) * PARALLAX) / lineHeight
    const playIntro = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setViewport((current) => {
      if (current.columns === columns && current.lines === lines) return current
      // Capture the starting rows once. A resize can end the intro but never restart it.
      const intro =
        current.columns === 0 && playIntro ? { columns, lines: lines + 1, offset } : null
      return { columns, lines, intro }
    })
  }, [])
  const resizeRef = useResizeObserver(measure)

  return { viewport, resizeRef }
}

function useCodeParallax(ref: RefObject<HTMLDivElement | null>) {
  const reducedMotion = useReducedMotion()

  const update = useCallback(() => {
    const scene = ref.current
    if (!scene) return

    const scroll = reducedMotion ? 0 : Math.max(0, window.scrollY)
    scene.style.setProperty('--code-travel', `${PARALLAX * scroll}px`)
  }, [reducedMotion, ref])

  useScrollFrame(update, !reducedMotion && files.length > 0)
  useEffect(update, [update])
}

type CodeColumnProps = {
  readonly file: CodeBackgroundFile
  readonly viewportLines: number
  readonly intro: CodeIntro | null
}

function CodeColumn({ file, viewportLines, intro }: CodeColumnProps) {
  const { lines } = file
  if (!lines.length) return null

  // Keep one extra copy above the viewport so a loop can wrap at any scroll position.
  const copies = Math.ceil(viewportLines / lines.length) + 1
  const firstRow = intro ? Math.floor(intro.offset % lines.length) : 0

  return (
    <Box className={styles['column']}>
      <Box className={styles['track']} style={{ '--code-file-lines': lines.length }}>
        {Array.from({ length: copies }, (_, copy) => (
          <Box component="pre" key={copy} className={styles['file']}>
            <code>
              {lines.map((line, index) => {
                const row = copy * lines.length + index - firstRow
                const typing = intro && line.cells > 0 && row >= 0 && row < intro.lines
                return (
                  <span
                    key={index}
                    className={typing ? styles['typing-line'] : styles['line']}
                    style={typing ? typingStyle(line.cells, row, intro.lines) : undefined}
                  >
                    {line.tokens.map(({ content, color, offset }) => (
                      <span key={offset} style={{ color }}>
                        {content}
                      </span>
                    ))}
                  </span>
                )
              })}
            </code>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

type TypingStyle = CSSProperties & {
  readonly '--code-line-cells': number
}

function typingStyle(cells: number, row: number, rows: number): TypingStyle {
  return {
    '--code-line-cells': cells,
    animationDelay: `${(row / Math.max(1, rows - 1)) * (INTRO_DURATION - MAX_LINE_DURATION)}ms`,
    animationDuration: `${Math.min(MAX_LINE_DURATION, cells * 14)}ms`,
  }
}
