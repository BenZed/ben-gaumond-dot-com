import { Box, Button, Group, Text } from '@mantine/core'
import {
  IconArrowDown,
  IconArrowUpRight,
  IconArrowRight,
  IconMapPin,
  IconPrinter,
} from '@tabler/icons-react'

import { Section } from './Section'
import { SiteIcon } from './SiteIcon'

export type HeroSectionProps = {
  readonly summary: string
}

export function HeroSection({ summary }: HeroSectionProps) {
  return (
    <Section
      id="intro"
      className="hero"
      headingOrder={1}
      eyebrow={
        <>
          <SiteIcon icon={IconMapPin} size={14} /> Software developer · Vancouver, BC
        </>
      }
      title={
        <>
          Ben
          <br />
          <Box component="span">Gaumond.</Box>
        </>
      }
    >
      <Section.Header className="hero-heading" />
      <Box className="hero-copy">
        <Text component="p" className="hero-summary">
          {summary}
        </Text>
        <Group gap="sm" className="hero-actions">
          <Button
            component="a"
            href="#experience"
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
      <Box component="aside" className="hero-note" aria-label="Areas of work">
        <Box component="span" className="note-index">
          A creative foundation.
          <br />
          An engineering practice.
        </Box>
        <Box className="craft-diagram" aria-hidden="true">
          <Box component="span" className="orbit orbit-one" />
          <Box component="span" className="orbit orbit-two" />
          <Box component="span" className="orbit orbit-three" />
          <Box component="span" className="diagram-center">
            bg.
          </Box>
          <Box component="span" className="orbit-dot" />
        </Box>
        <Box className="note-bottom">
          <Box component="span" className="craft-path">
            Animation <SiteIcon icon={IconArrowRight} size={12} /> interaction{' '}
            <SiteIcon icon={IconArrowRight} size={12} /> systems
          </Box>
          <SiteIcon icon={IconArrowUpRight} />
        </Box>
      </Box>
    </Section>
  )
}
