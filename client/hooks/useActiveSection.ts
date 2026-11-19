import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

import type { ResumeSection } from '../Resume'
import { useResizeObserver } from './useResizeObserver'

export type ActiveSection = ResumeSection['id'] | null

export function useActiveSection(
  header: RefObject<HTMLElement | null>,
  sections: readonly ResumeSection[],
) {
  const [active, setActive] = useState<{ current: ActiveSection; previous: ActiveSection }>({
    current: null,
    previous: null,
  })
  const frame = useRef(0)

  const schedule = useCallback(() => {
    if (frame.current) return
    frame.current = window.requestAnimationFrame(() => {
      frame.current = 0
      const boundary = (header.current?.getBoundingClientRect().bottom ?? 0) + 25
      const current = sections.findLast(({ id }) => {
        const section = document.getElementById(id)
        return section && section.getBoundingClientRect().top <= boundary
      })
      const { scrollHeight, clientHeight } = document.documentElement
      // The final section can be shorter than the space below the bar.
      const atBottom = window.scrollY > 0 && window.scrollY + clientHeight >= scrollHeight - 1
      const next = (atBottom ? sections.at(-1) : current)?.id ?? null

      setActive((state) =>
        state.current === next ? state : { current: next, previous: state.current },
      )
    })
  }, [header, sections])
  const observeLayout = useResizeObserver(schedule)

  useEffect(() => {
    const stopObserving = observeLayout(document.body, header.current)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.cancelAnimationFrame(frame.current)
      frame.current = 0
      stopObserving?.()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [header, observeLayout, schedule])

  return active
}
