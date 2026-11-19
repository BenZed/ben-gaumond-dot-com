import { useCallback } from 'react'

/**
 * Measures the primary element on attachment and when any observed element resizes.
 *
 * @typeParam Element - The primary element passed to the measurement callback.
 * @param measure - A stable callback that reads the primary element.
 * @returns A callback ref. When calling it directly with additional targets,
 * call its returned cleanup function to disconnect the observer.
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
