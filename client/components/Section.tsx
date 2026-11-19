import { Box, Text, Title } from '@mantine/core'
import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

import typography from '../Typography.module.css'
import styles from './Section.module.css'

type SectionHeading = {
  readonly title: ReactNode
  readonly eyebrow?: ReactNode
  readonly headingOrder?: 1 | 2
}

export type SectionProps = SectionHeading & {
  readonly id: string
  readonly className?: string | undefined
  readonly children: ReactNode
}

type SectionContextValue = SectionHeading & { readonly headingId: string }
const SectionContext = createContext<SectionContextValue | null>(null)

function SectionRoot({ id, title, eyebrow, headingOrder = 2, className, children }: SectionProps) {
  return (
    <SectionContext.Provider value={{ title, eyebrow, headingOrder, headingId: `${id}-title` }}>
      <Box component="section" id={id} aria-labelledby={`${id}-title`} className={className}>
        {children}
      </Box>
    </SectionContext.Provider>
  )
}

export type SectionHeaderProps = {
  readonly aside?: ReactNode
  readonly classNames?: { readonly eyebrow?: string | undefined }
  readonly className?: string | undefined
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

/**
 * A named page region. Render one Section.Header inside it; the header may be nested
 * to suit the layout. Section owns heading IDs and levels so callers cannot drift
 * out of sync with aria-labelledby. Layout and content stay with the composing section.
 */
export const Section = Object.assign(SectionRoot, { Header: SectionHeader })
