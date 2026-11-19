import { useCallback } from 'react'

/** Measures an element when its ref attaches and observes subsequent size changes. */
export function useResizeObserver<Element extends HTMLElement>(
  measure: (element: Element) => void,
) {
  return useCallback(
    (element: Element | null) => {
      if (!element) return

      const observer = new ResizeObserver(() => measure(element))
      observer.observe(element)
      measure(element)

      return () => observer.disconnect()
    },
    [measure],
  )
}
