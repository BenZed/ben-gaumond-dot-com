import { useCallback } from 'react'

/**
 * Observes an element while its callback ref is attached.
 *
 * @typeParam Element - The observed element type.
 * @param onEntry - Receives the entry, element, and observer. The callback
 * can disconnect the observer when it has enough information.
 * @param options - Native observer options. Keep the reference stable to reuse the observer.
 * @returns A callback ref that disconnects on cleanup.
 */
export function useIntersectionObserver<Element extends HTMLElement>(
  onEntry: (
    entry: IntersectionObserverEntry,
    element: Element,
    observer: IntersectionObserver,
  ) => void,
  options?: IntersectionObserverInit,
) {
  return useCallback(
    (element: Element | null) => {
      if (!element || typeof IntersectionObserver === 'undefined') return

      const observer = new IntersectionObserver(([entry]) => {
        if (entry) onEntry(entry, element, observer)
      }, options)
      observer.observe(element)
      return () => observer.disconnect()
    },
    [onEntry, options],
  )
}
