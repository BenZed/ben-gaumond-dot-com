import { Box } from '@mantine/core'
import { useReducedMotion } from '@mantine/hooks'
import { useEffect } from 'react'
import { files } from 'virtual:resume-code-background'

import { useWriteOn } from '../hooks/useWriteOn'

import styles from './CodeBackgroundScene.module.css'

const parallax = 0.2

export function CodeBackgroundScene() {
  const reducedMotion = useReducedMotion()
  const { ref, write } = useWriteOn<HTMLDivElement>()

  useEffect(() => {
    const scene = ref.current
    if (!scene || !files.length) return

    const lines = Math.max(...files.map(({ lines }) => lines.length))
    let lineHeight = 0
    let frame = 0

    const update = () => {
      frame = 0
      const viewport = window.innerHeight
      const scroll = reducedMotion ? 0 : Math.max(0, window.scrollY)
      const scrollRange = Math.max(1, document.documentElement.scrollHeight - viewport)
      const travel = parallax * scroll
      // Keep the writing edge inside the viewport as the code drifts behind it.
      const reveal = travel + viewport * (0.36 + 0.4 * Math.min(1, scroll / scrollRange))
      scene.style.setProperty('--code-travel', `${-travel}px`)
      if (lineHeight > 0 && lines > 0) write(reveal / (lineHeight * lines), lines)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    const measure = () => {
      lineHeight = Number.parseFloat(getComputedStyle(scene).lineHeight)
      schedule()
    }

    const resize = new ResizeObserver(measure)
    resize.observe(document.documentElement)
    window.addEventListener('resize', measure)
    if (!reducedMotion) window.addEventListener('scroll', schedule, { passive: true })
    measure()
    return () => {
      resize.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', schedule)
      cancelAnimationFrame(frame)
    }
  }, [reducedMotion, ref, write])

  if (!files.length) return null

  return (
    <Box className={styles['background']} aria-hidden="true">
      <Box ref={ref} className={styles['scene']}>
        {files.map(({ path, lines }) => (
          <Box component="pre" key={path} className={styles['file']}>
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
          </Box>
        ))}
      </Box>
    </Box>
  )
}
