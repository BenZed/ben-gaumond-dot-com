import { Box } from '@mantine/core'
import { useReducedMotion } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import { files } from 'virtual:resume-code-background'
import type { CodeBackgroundFile } from 'virtual:resume-code-background'

import { useWriteOn, type WriteOnAnimation } from '../hooks/useWriteOn'

import styles from './CodeBackgroundScene.module.css'

const parallax = 0.2
const columnWidth = 360
const intro: WriteOnAnimation = { from: 0, to: 1, duration: 2200, steps: 60, axis: 'block' }

export function CodeBackgroundScene() {
  const reducedMotion = useReducedMotion()
  const [viewport, setViewport] = useState({ columns: 0, lines: 0 })
  const writeOn = useWriteOn<HTMLDivElement>(viewport.columns > 0 ? intro : undefined)
  const { ref } = writeOn

  useEffect(() => {
    const scene = ref.current
    if (!scene || !files.length) return

    let frame = 0

    const update = () => {
      frame = 0
      const scroll = reducedMotion ? 0 : Math.max(0, window.scrollY)
      scene.style.setProperty('--code-travel', `${parallax * scroll}px`)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    const measure = () => {
      const lineHeight = Number.parseFloat(getComputedStyle(scene).lineHeight)
      const columns = Math.max(1, Math.floor(scene.clientWidth / columnWidth))
      const lines = Math.ceil(scene.clientHeight / lineHeight)
      setViewport((current) =>
        current.columns === columns && current.lines === lines ? current : { columns, lines },
      )
    }

    const resize = new ResizeObserver(measure)
    resize.observe(scene)
    if (!reducedMotion) window.addEventListener('scroll', schedule, { passive: true })
    measure()
    update()
    return () => {
      resize.disconnect()
      window.removeEventListener('scroll', schedule)
      cancelAnimationFrame(frame)
    }
  }, [reducedMotion, ref])

  if (!files.length) return null

  return (
    <Box className={styles['background']} aria-hidden="true">
      <Box {...writeOn} className={[styles['scene'], writeOn.className].filter(Boolean).join(' ')}>
        {Array.from({ length: viewport.columns }, (_, index) => {
          const file = files[index % files.length]
          return file ? (
            <CodeColumn key={`${file.path}-${index}`} file={file} viewportLines={viewport.lines} />
          ) : null
        })}
      </Box>
    </Box>
  )
}

// Internal

type CodeColumnProps = {
  readonly file: CodeBackgroundFile
  readonly viewportLines: number
}

function CodeColumn({ file, viewportLines }: CodeColumnProps) {
  const { lines } = file
  if (!lines.length) return null

  // Keep one extra copy above the viewport so a loop can wrap at any scroll position.
  const copies = Math.ceil(viewportLines / lines.length) + 1
  const code = (
    <code>
      {lines.map((line, index) => (
        <span key={index} className={styles['line']}>
          {line.map(({ content, color, offset }) => (
            <span key={offset} style={{ color }}>
              {content}
            </span>
          ))}
        </span>
      ))}
    </code>
  )

  return (
    <Box className={styles['column']}>
      <Box className={styles['track']} style={{ '--code-file-lines': lines.length }}>
        {Array.from({ length: copies }, (_, index) => (
          <Box component="pre" key={index} className={styles['file']}>
            {code}
          </Box>
        ))}
      </Box>
    </Box>
  )
}
