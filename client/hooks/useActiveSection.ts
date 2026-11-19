import { useCallback, useEffect, useState } from 'react'
import type { RefObject } from 'react'

import type { ResumeSection } from '../util/Resume'
import { useResizeObserver } from './useResizeObserver'
import { useScrollFrame } from './useScrollFrame'

const HEADER_OFFSET = 25
const BOTTOM_TOLERANCE = 1

export type ActiveSection = ResumeSection['id'] | undefined

/**
 * Tracks the active page section on scroll and layout changes.
 *
 * @param header - Ref to the header used to locate the activation boundary.
 * @param sections - Navigable sections in page order.
 * @returns The current ID and the previous distinct ID for transitions.
 */
export function useActiveSection(
  header: RefObject<HTMLElement | null>,
  sections: readonly ResumeSection[],
) {
  const [active, setActive] = useState<{ current: ActiveSection; previous: ActiveSection }>({
    current: undefined,
    previous: undefined,
  })
  const update = useCallback(() => {
    const next = readActiveSection(header.current, sections)
    setActive((state) =>
      state.current === next ? state : { current: next, previous: state.current },
    )
  }, [header, sections])
  const schedule = useScrollFrame(update)
  const observeLayout = useResizeObserver(schedule)

  useEffect(() => {
    const stopObserving = observeLayout(document.body, header.current)
    window.addEventListener('resize', schedule)
    return () => {
      stopObserving?.()
      window.removeEventListener('resize', schedule)
    }
  }, [header, observeLayout, schedule])

  return active
}

// Internal

function readActiveSection(
  header: HTMLElement | null,
  sections: readonly ResumeSection[],
): ActiveSection {
  const boundary = (header?.getBoundingClientRect().bottom ?? 0) + HEADER_OFFSET
  const current = sections.findLast(({ id }) => {
    const section = document.getElementById(id)
    return section && section.getBoundingClientRect().top <= boundary
  })
  const { scrollHeight, clientHeight } = document.documentElement
  // The final section can be shorter than the space below the bar.
  const atBottom =
    window.scrollY > 0 && window.scrollY + clientHeight >= scrollHeight - BOTTOM_TOLERANCE
  return (atBottom ? sections.at(-1) : current)?.id
}
