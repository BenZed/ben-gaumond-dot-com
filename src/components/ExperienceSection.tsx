import { Box } from '@mantine/core'

import type { Position } from '../resumeSchema'
import { Experience } from './Experience'
import { Section } from './Section'

export function ExperienceSection({ experience }: { readonly experience: readonly Position[] }) {
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
