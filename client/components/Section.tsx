import { Box, Text, Title } from '@mantine/core'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

import typography from '../Typography.module.css'
import styles from './Section.module.css'

const SectionContext = createContext<SectionContextValue | undefined>(undefined)
const SECTION_MOTION = 'screen and (prefers-reduced-motion: no-preference)'

export type SectionProps = SectionHeading & {
  readonly id: string
  readonly className?: string | undefined
  readonly children: ReactNode
}

export type SectionHeaderProps = {
  readonly aside?: ReactNode
  readonly classNames?: { readonly eyebrow?: string | undefined }
  readonly className?: string | undefined
}

/**
 * A named page region. Render one {@link Section.Header} inside it; the header may be nested
 * to suit the layout. Section owns heading IDs and levels so callers cannot drift
 * out of sync with aria-labelledby. Layout and content stay with the composing section.
 */
export const Section = Object.assign(SectionRoot, { Header: SectionHeader })

// Internal

type SectionHeading = {
  readonly title: ReactNode
  readonly eyebrow?: ReactNode
  readonly headingOrder?: 1 | 2
}

type SectionContextValue = SectionHeading & { readonly headingId: string }

function SectionRoot({ id, title, eyebrow, headingOrder = 2, className, children }: SectionProps) {
  const { ref, phase, show } = useSectionFade()

  return (
    <SectionContext.Provider value={{ title, eyebrow, headingOrder, headingId: `${id}-title` }}>
      <Box
        component="section"
        ref={ref}
        id={id}
        aria-labelledby={`${id}-title`}
        className={[styles['region'], className].filter(Boolean).join(' ')}
        data-section-fade={phase}
        onFocusCapture={show}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget) show()
        }}
      >
        {children}
      </Box>
    </SectionContext.Provider>
  )
}

function SectionHeader({
  aside,
  classNames,
  className = styles['section-heading'],
}: SectionHeaderProps) {
  const section = useContext(SectionContext)
  if (!section) throw new Error('Section.Header must be rendered inside Section')

  return (
    <Box
      component="header"
      className={[styles['section-header'], className].filter(Boolean).join(' ')}
    >
      <Box>
        {section.eyebrow && (
          <Text
            component="p"
            className={[typography['eyebrow'], styles['eyebrow'], classNames?.eyebrow]
              .filter(Boolean)
              .join(' ')}
          >
            {section.eyebrow}
          </Text>
        )}
        <Title order={section.headingOrder ?? 2} id={section.headingId}>
          {section.title}
        </Title>
      </Box>
      {aside && (
        <Box component="span" className={styles['section-aside']}>
          {aside}
        </Box>
      )}
    </Box>
  )
}

type FadePhase = 'initial' | 'waiting' | 'fading' | 'shown'

function useSectionFade() {
  const wasOffscreen = useRef(false)
  const skipFade = useRef(false)
  const [phase, setPhase] = useState<FadePhase>('initial')
  const show = useCallback(() => {
    skipFade.current = true
    setPhase('shown')
  }, [])

  const onIntersection = useCallback(
    (entry: IntersectionObserverEntry, element: HTMLElement, observer: IntersectionObserver) => {
      const linkedTarget = document.getElementById(window.location.hash.slice(1))
      if (
        skipFade.current ||
        !window.matchMedia(SECTION_MOTION).matches ||
        (!wasOffscreen.current && linkedTarget && element.contains(linkedTarget))
      ) {
        observer.disconnect()
        return
      }

      if (entry.isIntersecting) {
        observer.disconnect()
        if (wasOffscreen.current) setPhase('fading')
      } else {
        wasOffscreen.current = true
        setPhase('waiting')
      }
    },
    [],
  )
  const ref = useIntersectionObserver(onIntersection)

  useEffect(() => {
    const motion = window.matchMedia(SECTION_MOTION)
    const showImmediately = () => {
      if (!motion.matches) show()
    }
    motion.addEventListener('change', showImmediately)
    return () => motion.removeEventListener('change', showImmediately)
  }, [show])

  return { ref, phase, show }
}
