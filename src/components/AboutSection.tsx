import { Box, Text } from '@mantine/core'

import type { Resume } from '../Resume'
import { Section } from './Section'

export function AboutSection({
  basics,
}: {
  readonly basics: Pick<Resume['basics'], 'about' | 'approach' | 'location'>
}) {
  return (
    <Section
      id="about"
      className="section about-section"
      eyebrow="03 / Approach"
      title={
        <>
          Creative roots.
          <br />
          Practical engineering.
        </>
      }
    >
      <Section.Header className="about-heading" />
      <Box className="about-copy">
        <Text component="p">{basics.about[0]}</Text>
        <Text component="p">{basics.approach}</Text>
        <Text component="p" className="about-footnote">
          TypeScript, React, and Node.js · {basics.location}
        </Text>
      </Box>
    </Section>
  )
}
