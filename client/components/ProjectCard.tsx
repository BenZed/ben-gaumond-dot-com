import { Box, Stack, Text, Title } from '@mantine/core'

import type { Position, Resume } from '../Resume'
import { ExternalLink } from './ExternalLink'
import { IframePlayer } from './IframePlayer'
import { ProjectPreview } from './ProjectPreview'

import typography from '../Typography.module.css'
import styles from './ProjectCard.module.css'

export type ProjectCardProps = {
  readonly project: Pick<
    Position,
    'company' | 'start' | 'projectTitle' | 'highlights' | 'url' | 'embedUrl' | 'preview'
  >
  readonly artwork: Resume['work']['artwork']
  readonly index: number
}

export function ProjectCard({ project, artwork, index }: ProjectCardProps) {
  const projectUrl = project.url ?? project.embedUrl
  const linkedPreview =
    projectUrl && project.preview && project.projectTitle
      ? { href: projectUrl, preview: project.preview, title: project.projectTitle }
      : undefined

  return (
    <Box component="article" className={styles['project-card']}>
      {linkedPreview ? (
        <ProjectPreview {...linkedPreview} />
      ) : (
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
      )}
      <Box className={styles['project-copy']}>
        <Text
          component="p"
          className={[typography['eyebrow'], styles['project-eyebrow']].join(' ')}
        >
          {project.company} / {project.start.slice(0, 4)}
        </Text>
        <Title order={4}>{project.projectTitle}</Title>
        <Text component="p">{project.highlights[0]}</Text>
        {projectUrl && (project.embedUrl || !linkedPreview) && (
          <Stack align="flex-start" gap="xs">
            {project.embedUrl && project.projectTitle && (
              <IframePlayer src={project.embedUrl} title={project.projectTitle} />
            )}
            {!linkedPreview && <ExternalLink href={projectUrl} label="Explore the project" />}
          </Stack>
        )}
      </Box>
    </Box>
  )
}
