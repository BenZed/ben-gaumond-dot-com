import { Box, Text, Title } from '@mantine/core'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import typography from '../Typography.module.css'
import styles from './Section.module.css'

const SectionContext = createContext<SectionContextValue | null>(null)
const GRAPHEMES = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

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
  const heading = useRef<HTMLHeadingElement>(null)
  const [reveal, setReveal] = useState<'initial' | 'waiting' | 'writing' | 'shown'>('initial')

  useEffect(() => {
    const element = heading.current
    if (
      !element ||
      typeof title !== 'string' ||
      !title ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return
    }

    const motion = window.matchMedia('screen and (prefers-reduced-motion: no-preference)')
    if (!motion.matches) return

    const linkedTarget = document.getElementById(window.location.hash.slice(1))
    if (linkedTarget && element.closest('section')?.contains(linkedTarget)) return

    let wasOffscreen = false
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return
      if (entry.isIntersecting) {
        observer.disconnect()
        if (wasOffscreen) setReveal('writing')
      } else {
        wasOffscreen = true
        setReveal('waiting')
      }
    })
    const showImmediately = () => {
      if (motion.matches) return
      observer.disconnect()
      setReveal('shown')
    }
    motion.addEventListener('change', showImmediately)
    observer.observe(element)
    return () => {
      observer.disconnect()
      motion.removeEventListener('change', showImmediately)
    }
  }, [title])

  const writing = reveal === 'writing' && typeof title === 'string'
  const characters = writing ? Array.from(GRAPHEMES.segment(title)) : []
  const interval = Math.min(36, 560 / Math.max(1, characters.length))

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
          {characters.map(({ segment, index }, position) => (
            <span
              key={index}
              className={styles['heading-character']}
              style={{ animationDelay: `${position * interval}ms` }}
              onAnimationEnd={
                position === characters.length - 1 ? () => setReveal('shown') : undefined
              }
            >
              {segment}
            </span>
          ))}
        </span>
      ) : (
        title
      )}
    </Title>
  )
}
