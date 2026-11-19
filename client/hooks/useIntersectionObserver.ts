import { useCallback } from 'react'

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
