import { Box, Stack, Text, Title } from '@mantine/core'

import type { ProjectPosition } from '../ProjectPosition'
import type { Resume } from '../Resume'
import { ExternalLink } from './ExternalLink'
import { IframePlayer } from './IframePlayer'
import { ProjectPreview } from './ProjectPreview'

import typography from '../Typography.module.css'
import styles from './ProjectCard.module.css'

export type ProjectCardProps = {
  readonly position: Pick<ProjectPosition, 'company' | 'dates' | 'highlights' | 'project'>
  readonly artwork: Resume['work']['artwork']
  readonly index: number
}

export function ProjectCard({ position, artwork, index }: ProjectCardProps) {
  const { title, url, embedUrl, preview } = position.project
  const projectUrl = url ?? embedUrl
  const linkedPreview = projectUrl && preview ? { href: projectUrl, preview, title } : undefined

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
          {position.company} / {position.dates.start.slice(0, 4)}
        </Text>
        <Title order={4}>{title}</Title>
        <Text component="p">{position.highlights[0]}</Text>
        {projectUrl && (embedUrl || !linkedPreview) && (
          <Stack align="flex-start" gap="xs">
            {embedUrl && <IframePlayer src={embedUrl} title={title} />}
            {!linkedPreview && <ExternalLink href={projectUrl} label="Explore the project" />}
          </Stack>
        )}
      </Box>
    </Box>
  )
}
