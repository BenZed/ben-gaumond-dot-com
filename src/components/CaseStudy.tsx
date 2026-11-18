import { Anchor, Box, Group, Stack, Text, Title } from '@mantine/core'
import { IconArrowUpRight } from '@tabler/icons-react'

import type { Position, Resume } from '../Resume'
import { ProjectCard } from './ProjectCard'
import { SiteIcon } from './SiteIcon'

import typography from '../Typography.module.css'
import styles from './CaseStudy.module.css'

export type CaseStudyProps = {
  readonly study: Resume['work']['caseStudies'][number]
  readonly positions: readonly Position[]
  readonly artwork: Resume['work']['artwork']
}

export function CaseStudy({ study, positions, artwork }: CaseStudyProps) {
  const projectPositions = positions.filter(({ projectTitle }) => projectTitle !== undefined)
  const relatedRoles = positions.filter(({ projectTitle }) => projectTitle === undefined)
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
          ) : null,
        )}
      </Box>
      {study.url && (
        <Anchor href={study.url} className={typography['text-link']}>
          View project <SiteIcon icon={IconArrowUpRight} />
        </Anchor>
      )}
      {relatedRoles.length > 0 && (
        <Group className={styles['related-roles']} gap="sm">
          {relatedRoles.map((position) => (
            <Anchor key={position.id} href={`#${position.id}`} className={typography['text-link']}>
              {position.company} experience
            </Anchor>
          ))}
        </Group>
      )}
      {projectPositions.some(({ url }) => url) && (
        <Group className={styles['print-project-links']} gap="xs">
          {projectPositions.map(({ id, projectTitle, url }) =>
            url ? (
              <Anchor key={id} href={url} inherit>
                {projectTitle}
              </Anchor>
            ) : null,
          )}
        </Group>
      )}
      {projectPositions.length > 0 && (
        <Box className={styles['project-grid']}>
          {projectPositions.map((project, index) => (
            <ProjectCard key={project.id} project={project} artwork={artwork} index={index} />
          ))}
        </Box>
      )}
    </Stack>
  )
}
