import { Box, Text } from '@mantine/core'

import type { Resume } from '../Resume'
import { Section } from './Section'

export type AboutSectionProps = {
  readonly about: Resume['about']
  readonly location: string
}

export function AboutSection({ about, location }: AboutSectionProps) {
  return (
    <Section
      id={about.section.id}
      className="section about-section"
      eyebrow="03 / Approach"
      title={about.section.title}
    >
      <Section.Header className="about-heading" />
      <Box className="about-copy">
        <Text component="p">{about.paragraphs[0]}</Text>
        <Text component="p">{about.approach}</Text>
        <Text component="p" className="about-footnote">
          TypeScript, React, and Node.js · {location}
        </Text>
      </Box>
    </Section>
  )
}
