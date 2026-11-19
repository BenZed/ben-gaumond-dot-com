import { Box, Text, Title } from '@mantine/core'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { useWriteOn } from '../hooks/useWriteOn'

import typography from '../Typography.module.css'
import styles from './Section.module.css'

const SectionContext = createContext<SectionContextValue | null>(null)
const HEADING_MOTION = 'screen and (prefers-reduced-motion: no-preference)'

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
 * A named page region. Render one Section.Header inside it; the header may be nested
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
  return (
    <SectionContext.Provider value={{ title, eyebrow, headingOrder, headingId: `${id}-title` }}>
      <Box component="section" id={id} aria-labelledby={`${id}-title`} className={className}>
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
        <SectionTitle section={section} />
      </Box>
      {aside && (
        <Box component="span" className={styles['section-aside']}>
          {aside}
        </Box>
      )}
    </Box>
  )
}

type SectionTitleProps = {
  readonly section: SectionContextValue
}

function SectionTitle({ section }: SectionTitleProps) {
  const { title, headingId, headingOrder = 2 } = section
  const wasOffscreen = useRef(false)
  const skipReveal = useRef(false)
  const [reveal, setReveal] = useState<'initial' | 'waiting' | 'writing' | 'shown'>('initial')

  const onIntersection = useCallback(
    (
      entry: IntersectionObserverEntry,
      element: HTMLHeadingElement,
      observer: IntersectionObserver,
    ) => {
      const linkedTarget = document.getElementById(window.location.hash.slice(1))
      if (
        skipReveal.current ||
        typeof title !== 'string' ||
        !title ||
        !window.matchMedia(HEADING_MOTION).matches ||
        (!wasOffscreen.current &&
          linkedTarget &&
          element.closest('section')?.contains(linkedTarget))
      ) {
        observer.disconnect()
        return
      }

      if (entry.isIntersecting) {
        observer.disconnect()
        if (wasOffscreen.current) setReveal('writing')
      } else {
        wasOffscreen.current = true
        setReveal('waiting')
      }
    },
    [title],
  )
  const heading = useIntersectionObserver(onIntersection)

  useEffect(() => {
    const motion = window.matchMedia(HEADING_MOTION)
    const showImmediately = () => {
      if (motion.matches) return
      skipReveal.current = true
      setReveal('shown')
    }
    motion.addEventListener('change', showImmediately)
    return () => motion.removeEventListener('change', showImmediately)
  }, [])

  const writing = reveal === 'writing' && typeof title === 'string'
  const { characters } = useWriteOn({
    mode: 'characters',
    text: writing ? title : undefined,
    duration: 560,
    maxInterval: 36,
    onComplete: () => setReveal('shown'),
  })

  return (
    <Title
      ref={heading}
      order={headingOrder}
      id={headingId}
      className={styles['section-title']}
      data-heading-reveal={reveal}
      aria-label={writing ? title : undefined}
    >
      {writing ? (
        <span aria-hidden="true">
          {characters.map(({ key, text, props }) => (
            <span key={key} {...props}>
              {text}
            </span>
          ))}
        </span>
      ) : (
        title
      )}
    </Title>
  )
}
