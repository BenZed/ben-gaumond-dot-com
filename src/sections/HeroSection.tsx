import { Box, Button, Group, Text } from '@mantine/core'
import { IconArrowDown, IconMapPin, IconPrinter } from '@tabler/icons-react'

import { HeroNote } from '../components/HeroNote'
import { Section } from '../components/Section'
import { SiteIcon } from '../components/SiteIcon'
import type { Resume } from '../Resume'

import styles from './HeroSection.module.css'

export type HeroSectionProps = {
  readonly basics: Pick<
    Resume['basics'],
    'section' | 'summary' | 'role' | 'shortLocation' | 'wordmark'
  >
  readonly note: Resume['heroNote']
  readonly experienceId: string
}

export function HeroSection({ basics, experienceId, note }: HeroSectionProps) {
  return (
    <Section
      id={basics.section.id}
      className={styles['hero']}
      headingOrder={1}
      eyebrow={
        <>
          <SiteIcon icon={IconMapPin} size={14} /> {basics.role} · {basics.shortLocation}
        </>
      }
      title={basics.section.title}
    >
      <Section.Header
        className={styles['hero-heading']}
        classNames={{ eyebrow: styles['hero-eyebrow'] }}
      />
      <Box className={styles['hero-copy']}>
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
            variant="subtle"
            classNames={{ root: styles['hero-button'] }}
            color="ember.9"
            size="md"
            onClick={() => window.print()}
          >
            Print resume <SiteIcon icon={IconPrinter} className={styles['print-icon']} />
          </Button>
        </Group>
      </Box>
      <HeroNote note={note} wordmark={basics.wordmark} />
    </Section>
  )
}
