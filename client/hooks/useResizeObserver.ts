import { useCallback } from 'react'

/**
 * Measures the primary element on attachment and when any observed element resizes.
 * Use the callback as a ref or pass additional layout targets directly.
 */
export function useResizeObserver<Element extends HTMLElement>(
  measure: (element: Element) => void,
) {
  return useCallback(
    (element: Element | null, ...additionalTargets: (HTMLElement | null)[]) => {
      if (!element) return

      const observer = new ResizeObserver(() => measure(element))
      observer.observe(element)
      for (const target of additionalTargets) {
        if (target) observer.observe(target)
      }
      measure(element)

      return () => observer.disconnect()
    },
    [measure],
  )
}
