import { Box } from '@mantine/core'

import type { Position } from '../Resume'
import { Experience } from './Experience'
import { Section } from './Section'

export type ExperienceSectionProps = {
  readonly experience: readonly Position[]
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  return (
    <Section
      id="experience"
      className="section"
      eyebrow="01 / Experience"
      title="A history of making things work."
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
        {experience.map((position) => (
          <Experience key={position.id} position={position} />
        ))}
      </Box>
    </Section>
  )
}
