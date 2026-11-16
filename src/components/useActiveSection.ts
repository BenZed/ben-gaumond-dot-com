import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

import sectionLabels from '../../content/sections.json' with { type: 'json' }

type SectionId = keyof typeof sectionLabels
const sections = Object.keys(sectionLabels)
  .filter((id): id is SectionId => Object.hasOwn(sectionLabels, id))
  .map((id) => ({ id, label: sectionLabels[id] }))

export type ActiveSection = SectionId | null

export function useActiveSection(header: RefObject<HTMLElement | null>) {
  const [active, setActive] = useState<{ current: ActiveSection; previous: ActiveSection }>({
    current: null,
    previous: null,
  })

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const boundary = (header.current?.getBoundingClientRect().bottom ?? 0) + 25
      const current = sections.findLast(({ id }) => {
        const section = document.getElementById(id)
        return section && section.getBoundingClientRect().top <= boundary
      })
      const { scrollHeight, clientHeight } = document.documentElement
      // The final section can be shorter than the space below the bar.
      const atBottom = window.scrollY > 0 && window.scrollY + clientHeight >= scrollHeight - 1
      const next = atBottom ? 'contact' : (current?.id ?? null)

      setActive((state) =>
        state.current === next ? state : { current: next, previous: state.current },
      )
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    const layout = new ResizeObserver(schedule)
    layout.observe(document.body)
    if (header.current) layout.observe(header.current)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()
    return () => {
      window.cancelAnimationFrame(frame)
      layout.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [header])

  return active
}

export { sections }
