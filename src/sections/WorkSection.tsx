import { Box } from '@mantine/core'

import { ProjectCard } from '../components/ProjectCard'
import { Section } from '../components/Section'
import type { Position, Resume } from '../Resume'

import sectionStyles from '../components/Section.module.css'
import styles from './WorkSection.module.css'

export type WorkSectionProps = {
  readonly work: Resume['work']
  readonly positions: readonly Position[]
}

export function WorkSection({ work, positions }: WorkSectionProps) {
  const projects = positions.filter((position) => position.projectTitle !== undefined)
  return (
    <Section
      id={work.section.id}
      className={[sectionStyles['section'], styles['work-section']].join(' ')}
      eyebrow={work.section.eyebrow}
      title={work.section.title}
    >
      <Section.Header aside={work.aside} />
      <Box className={styles['project-grid']}>
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} artwork={work.artwork} index={index} />
        ))}
      </Box>
    </Section>
  )
}
