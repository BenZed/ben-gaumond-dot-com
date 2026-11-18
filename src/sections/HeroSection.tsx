import { Text } from '@mantine/core'
import { IconMapPin } from '@tabler/icons-react'

import { Section } from '../components/Section'
import { SiteIcon } from '../components/SiteIcon'
import type { Resume } from '../Resume'

import styles from './HeroSection.module.css'

export type HeroSectionProps = {
  readonly basics: Pick<
    Resume['basics'],
    'section' | 'summary' | 'role' | 'shortLocation' | 'pronouns'
  >
}

export function HeroSection({ basics }: HeroSectionProps) {
  return (
    <Section
      id={basics.section.id}
      className={styles['hero']}
      headingOrder={1}
      eyebrow={
        <>
          <SiteIcon icon={IconMapPin} size={14} /> {basics.role} · {basics.shortLocation} ·{' '}
          {basics.pronouns}
        </>
      }
      title={basics.section.title}
    >
      <Section.Header
        className={styles['hero-heading']}
        classNames={{ eyebrow: styles['hero-eyebrow'] }}
      />
      <Text component="p" className={styles['hero-summary']}>
        {basics.summary}
      </Text>
    </Section>
  )
}
