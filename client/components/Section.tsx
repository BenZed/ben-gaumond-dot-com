import { Box, Text, Title } from '@mantine/core'
import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { useWriteOn, type WriteOnAnimation } from '../hooks/useWriteOn'

import typography from '../Typography.module.css'
import styles from './Section.module.css'

const SectionContext = createContext<SectionContextValue | null>(null)
const sectionReveal: WriteOnAnimation = { from: 0, to: 1, duration: 560, steps: 28 }

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
  const [reveal, setReveal] = useState<'initial' | 'waiting' | 'writing'>('initial')
  const writeOn = useWriteOn<HTMLElement>(reveal === 'writing' ? sectionReveal : undefined)
  const { ref } = writeOn

  useEffect(() => {
    const element = ref.current
    if (
      !element ||
      typeof IntersectionObserver === 'undefined' ||
      !window.matchMedia('screen and (prefers-reduced-motion: no-preference)').matches
    ) {
      return
    }

    const linkedTarget = document.getElementById(window.location.hash.slice(1))
    if (linkedTarget && element.contains(linkedTarget)) return

    let wasOffscreen = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (entry.isIntersecting) {
          observer.disconnect()
          if (wasOffscreen) setReveal('writing')
        } else {
          wasOffscreen = true
          setReveal('waiting')
        }
      },
      // Let the section move past its leading padding before the reveal starts.
      { rootMargin: '0px 0px -48px 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  return (
    <SectionContext.Provider value={{ title, eyebrow, headingOrder, headingId: `${id}-title` }}>
      <Box
        {...writeOn}
        component="section"
        id={id}
        aria-labelledby={`${id}-title`}
        data-section-waiting={reveal === 'waiting' || undefined}
        className={[styles['region'], className, writeOn.className].filter(Boolean).join(' ')}
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
