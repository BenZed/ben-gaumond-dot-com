import { Box, Text } from '@mantine/core'
import { useMemo } from 'react'

import type { Resume } from '../Resume'
import { Section } from './Section'

const technologyListFormatter = new Intl.ListFormat('en-US')

export type AboutSectionProps = {
  readonly about: Resume['about']
  readonly location: Resume['basics']['location']
  readonly technologies: Resume['technologies']
}

export function AboutSection({ about, location, technologies }: AboutSectionProps) {
  const technologyList = useMemo(() => technologyListFormatter.format(technologies), [technologies])

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
          {technologyList} · {location}
        </Text>
      </Box>
    </Section>
  )
}
