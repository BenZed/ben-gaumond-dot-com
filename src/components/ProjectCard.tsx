import { Anchor, Box, Text, Title } from '@mantine/core'
import { IconArrowUpRight } from '@tabler/icons-react'

import type { Position, Resume } from '../Resume'
import { SiteIcon } from './SiteIcon'

export type ProjectCardProps = {
  readonly project: Pick<Position, 'company' | 'start' | 'projectTitle' | 'highlights' | 'url'>
  readonly artwork: Resume['work']['artwork']
  readonly index: number
}

export function ProjectCard({ project, artwork, index }: ProjectCardProps) {
  return (
    <Box component="article" className="project-card">
      <Box className={`project-art project-art-${String(index)}`} aria-hidden="true">
        <Box component="span" className="drawing-line" />
        <Box component="span" className="drawing-circle" />
        <Box component="span" className="drawing-square" />
        <Box component="span" className="art-label">
          {artwork.label}
          <br />
          <em>{artwork.accent}</em>
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
  )
}
