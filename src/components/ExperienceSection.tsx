import { Box } from '@mantine/core'

import type { Resume } from '../Resume'
import { Experience } from './Experience'
import { Section } from './Section'

export type ExperienceSectionProps = {
  readonly experience: Resume['experience']
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  return (
    <Section
      id={experience.section.id}
      className="section"
      eyebrow={experience.section.eyebrow}
      title={experience.section.title}
    >
      <Section.Header aside={experience.aside} />
      <Box>
        {experience.positions.map((position) => (
          <Experience key={position.id} position={position} />
        ))}
      </Box>
    </Section>
  )
}
