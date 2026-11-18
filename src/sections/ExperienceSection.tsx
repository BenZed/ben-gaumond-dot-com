import { Box } from '@mantine/core'

import { Experience } from '../components/Experience'
import { Section } from '../components/Section'
import type { Resume } from '../Resume'

import styles from '../components/Section.module.css'

export type ExperienceSectionProps = {
  readonly experience: Resume['experience']
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  return (
    <Section
      id={experience.section.id}
      className={styles['section']}
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
