import { Anchor, Box, Group, Stack, Text, Title } from '@mantine/core'

import { isProjectPosition } from '../util/ProjectPosition'
import type { Position, Resume } from '../util/Resume'
import { ExternalLink } from './ExternalLink'
import { ProjectCard } from './ProjectCard'

import typography from '../Typography.module.css'
import styles from './CaseStudy.module.css'

export type CaseStudyProps = {
  readonly study: Resume['work']['caseStudies'][number]
  readonly positions: readonly Position[]
  readonly artwork: Resume['work']['artwork']
}

export function CaseStudy({ study, positions, artwork }: CaseStudyProps) {
  const projectPositions = positions.filter(isProjectPosition)
  const relatedRoles = positions.filter((position) => !isProjectPosition(position))
  const details = [
    { label: 'Challenge', text: study.challenge },
    { label: 'Contribution', text: study.contribution },
    { label: 'Outcome', text: study.outcome },
  ]

  return (
    <Stack component="article" className={styles['study']} gap="md">
      <Stack gap="xs">
        <Title order={3}>{study.title}</Title>
        <Text>{study.summary}</Text>
      </Stack>
      <Box component="dl" className={styles['details']}>
        {details.map(({ label, text }) =>
          text ? (
            <Box key={label}>
              <Text component="dt" fw={600}>
                {label}
              </Text>
              <Text component="dd">{text}</Text>
            </Box>
          ) : undefined,
        )}
      </Box>
      {study.url && <ExternalLink href={study.url} label="View project" />}
      {relatedRoles.length > 0 && (
        <Group className={styles['related-roles']} gap="sm">
          {relatedRoles.map((position) => (
            <Anchor key={position.id} href={`#${position.id}`} className={typography['text-link']}>
              {position.company} experience
            </Anchor>
          ))}
        </Group>
      )}
      {projectPositions.some(({ project }) => project.url) && (
        <Group className={styles['print-project-links']} gap="xs">
          {projectPositions.map(({ id, project: { title, url } }) =>
            url ? (
              <Anchor key={id} href={url} inherit>
                {title}
              </Anchor>
            ) : undefined,
          )}
        </Group>
      )}
      {projectPositions.length > 0 && (
        <Box className={styles['project-grid']}>
          {projectPositions.map((position, index) => (
            <ProjectCard key={position.id} position={position} artwork={artwork} index={index} />
          ))}
        </Box>
      )}
    </Stack>
  )
}
