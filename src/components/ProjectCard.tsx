import { Anchor, Box, Stack, Text, Title } from '@mantine/core'
import { IconArrowUpRight } from '@tabler/icons-react'

import type { Position, Resume } from '../Resume'
import { IframePlayer } from './IframePlayer'
import { SiteIcon } from './SiteIcon'

import typography from '../Typography.module.css'
import styles from './ProjectCard.module.css'

export type ProjectCardProps = {
  readonly project: Pick<
    Position,
    'company' | 'start' | 'projectTitle' | 'highlights' | 'url' | 'embedUrl'
  >
  readonly artwork: Resume['work']['artwork']
  readonly index: number
}

export function ProjectCard({ project, artwork, index }: ProjectCardProps) {
  const projectUrl = project.url ?? project.embedUrl

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
        <Title order={4}>{project.projectTitle}</Title>
        <Text component="p">{project.highlights[0]}</Text>
        {projectUrl && (
          <Stack align="flex-start" gap="xs">
            {project.embedUrl && project.projectTitle && (
              <IframePlayer src={project.embedUrl} title={project.projectTitle} />
            )}
            <Anchor href={projectUrl} className={typography['text-link']}>
              Explore the project <SiteIcon icon={IconArrowUpRight} />
            </Anchor>
          </Stack>
        )}
      </Box>
    </Box>
  )
}
