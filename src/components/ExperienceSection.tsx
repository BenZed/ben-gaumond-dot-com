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
      eyebrow="01 / Experience"
      title={experience.section.title}
    >
      <Section.Header
        aside={
          <>
            Software. Creative tools.
            <br />
            Interactive experiences.
          </>
        }
      />
      <Box>
        {experience.positions.map((position) => (
          <Experience key={position.id} position={position} />
        ))}
      </Box>
    </Section>
  )
}
