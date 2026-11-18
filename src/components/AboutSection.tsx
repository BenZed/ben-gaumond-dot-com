import { Box, Text } from '@mantine/core'

import type { Resume } from '../Resume'
import { Section } from './Section'

export type AboutSectionProps = {
  readonly about: Resume['about']
  readonly location: Resume['basics']['location']
  readonly technologies: Resume['technologies']
}

export function AboutSection({ about, location, technologies }: AboutSectionProps) {
  return (
    <Section
      id={about.section.id}
      className="section about-section"
      eyebrow={about.section.eyebrow}
      title={about.section.title}
    >
      <Section.Header className="about-heading" />
      <Box className="about-copy">
        <Text component="p">{about.paragraphs[0]}</Text>
        <Text component="p">{about.approach}</Text>
        <Text component="p" className="about-footnote">
          {new Intl.ListFormat('en-US').format(technologies)} · {location}
        </Text>
      </Box>
    </Section>
  )
}
