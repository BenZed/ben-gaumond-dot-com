import { Box, Button, Group, Text } from '@mantine/core'
import { IconArrowDown, IconMapPin, IconPrinter } from '@tabler/icons-react'

import { HeroNote } from '../components/HeroNote'
import { Section } from '../components/Section'
import { SiteIcon } from '../components/SiteIcon'
import type { Resume } from '../Resume'

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
      className="hero"
      headingOrder={1}
      eyebrow={
        <>
          <SiteIcon icon={IconMapPin} size={14} /> {basics.role} · {basics.shortLocation}
        </>
      }
      title={basics.section.title}
    >
      <Section.Header className="hero-heading" />
      <Box className="hero-copy">
        <Text component="p" className="hero-summary">
          {basics.summary}
        </Text>
        <Group gap="sm" className="hero-actions">
          <Button
            component="a"
            href={`#${experienceId}`}
            color="ember.9"
            size="md"
            rightSection={<SiteIcon icon={IconArrowDown} />}
          >
            Explore my experience
          </Button>
          <Button variant="subtle" color="ember.9" size="md" onClick={() => window.print()}>
            Print resume <SiteIcon icon={IconPrinter} className="print-icon" />
          </Button>
        </Group>
      </Box>
      <HeroNote note={note} wordmark={basics.wordmark} />
    </Section>
  )
}
