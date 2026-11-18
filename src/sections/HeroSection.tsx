import { Button, Group, Text } from '@mantine/core'
import { IconArrowDown, IconDownload, IconMapPin } from '@tabler/icons-react'

import { Section } from '../components/Section'
import { SiteIcon } from '../components/SiteIcon'
import type { Resume } from '../Resume'

import styles from './HeroSection.module.css'

export type HeroSectionProps = {
  readonly basics: Pick<
    Resume['basics'],
    'section' | 'summary' | 'role' | 'shortLocation' | 'pronouns'
  >
  readonly experienceId: string
}

export function HeroSection({ basics, experienceId }: HeroSectionProps) {
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
      <Group gap="sm" className={styles['hero-actions']}>
        <Button
          component="a"
          href={`#${experienceId}`}
          classNames={{ root: styles['hero-button'] }}
          color="ember.9"
          size="md"
          rightSection={<SiteIcon icon={IconArrowDown} />}
        >
          Explore my experience
        </Button>
        <Button
          component="a"
          href="./resume.pdf"
          download
          variant="subtle"
          classNames={{ root: styles['hero-button'] }}
          color="ember.9"
          size="md"
          rightSection={<SiteIcon icon={IconDownload} />}
        >
          Download resume
        </Button>
      </Group>
    </Section>
  )
}
