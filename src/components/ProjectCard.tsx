import { Anchor, Box, Text, Title } from '@mantine/core'
import { IconArrowUpRight } from '@tabler/icons-react'

import type { Position, Resume } from '../Resume'
import { SiteIcon } from './SiteIcon'

import typography from '../Typography.module.css'
import styles from './ProjectCard.module.css'

export type ProjectCardProps = {
  readonly project: Pick<Position, 'company' | 'start' | 'projectTitle' | 'highlights' | 'url'>
  readonly artwork: Resume['work']['artwork']
  readonly index: number
}

export function ProjectCard({ project, artwork, index }: ProjectCardProps) {
  return (
    <Box component="article" className={styles['project-card']}>
      <Box
        className={[styles['project-art'], index === 1 && styles['project-art-1']]
          .filter(Boolean)
          .join(' ')}
        aria-hidden="true"
      >
        <Box component="span" className={styles['drawing-line']} />
        <Box component="span" className={styles['drawing-circle']} />
        <Box component="span" className={styles['drawing-square']} />
        <Box component="span" className={styles['art-label']}>
          {artwork.label}
          <br />
          <em>{artwork.accent}</em>
        </Box>
        <Box component="span" className={styles['art-number']}>
          0{index + 1}
        </Box>
      </Box>
      <Box className={styles['project-copy']}>
        <Text
          component="p"
          className={[typography['eyebrow'], styles['project-eyebrow']].join(' ')}
        >
          {project.company} / {project.start.slice(0, 4)}
        </Text>
        <Title order={3}>{project.projectTitle}</Title>
        <Text component="p">{project.highlights[0]}</Text>
        {project.url && (
          <Anchor href={project.url} className={typography['text-link']}>
            Explore the project <SiteIcon icon={IconArrowUpRight} />
          </Anchor>
        )}
      </Box>
    </Box>
  )
}
