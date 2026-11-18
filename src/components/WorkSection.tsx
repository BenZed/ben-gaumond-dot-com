import { Anchor, Box, Text, Title } from '@mantine/core'
import { IconArrowUpRight } from '@tabler/icons-react'

import type { Position, Resume } from '../Resume'
import { Section } from './Section'
import { SiteIcon } from './SiteIcon'

export type WorkSectionProps = {
  readonly work: Resume['work']
  readonly positions: readonly Position[]
}

export function WorkSection({ work, positions }: WorkSectionProps) {
  const projects = positions.filter((position) => position.projectTitle !== undefined)
  return (
    <Section
      id={work.section.id}
      className="section work-section"
      eyebrow={work.section.eyebrow}
      title={work.section.title}
    >
      <Section.Header aside={work.aside} />
      <Box className="project-grid">
        {projects.map((project, index) => (
          <Box component="article" className="project-card" key={project.id}>
            <Box className={`project-art project-art-${String(index)}`} aria-hidden="true">
              <Box component="span" className="drawing-line" />
              <Box component="span" className="drawing-circle" />
              <Box component="span" className="drawing-square" />
              <Box component="span" className="art-label">
                {work.artwork.label}
                <br />
                <em>{work.artwork.accent}</em>
              </Box>
              <Box component="span" className="art-number">
                0{index + 1}
              </Box>
            </Box>
            <Box className="project-copy">
              <Text component="p" className="eyebrow">
                {project.company} / {project.start.slice(0, 4)}
              </Text>
              <Title order={3}>{project.projectTitle}</Title>
              <Text component="p">{project.highlights[0]}</Text>
              {project.url && (
                <Anchor href={project.url} className="text-link">
                  Explore the project <SiteIcon icon={IconArrowUpRight} />
                </Anchor>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Section>
  )
}
