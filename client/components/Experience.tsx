import { Badge, Box, Group, List, Stack, Text, Title } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'

import type { Position } from '../util/Resume'
import { ExternalLink } from './ExternalLink'
import { SiteIcon } from './SiteIcon'

import styles from './Experience.module.css'

export type ExperienceProps = {
  readonly position: Position
}

export function Experience({ position }: ExperienceProps) {
  const { dates, description, project, skills, url } = position
  const location = [position.location.place, position.location.mode].filter(Boolean).join(' · ')
  const detailsUrl = project?.url ?? url
  const hasDetails = description.length > 0 || skills.length > 0
  const detailsLink = detailsUrl ? (
    <ExternalLink
      href={detailsUrl}
      label={`Visit ${project?.url ? 'the project' : position.company}`}
    />
  ) : undefined

  return (
    <Box component="article" className={styles['experience-row']} id={position.id}>
      <Stack className={styles['experience-date']} gap={14} align="flex-start">
        <Box component="span">
          {formatMonth(dates.start)} —{' '}
          {dates.end === undefined ? 'Present' : formatMonth(dates.end)}
        </Box>
        {dates.end === undefined && (
          <Badge variant="light" color="ember.9" size="sm">
            Current
          </Badge>
        )}
      </Stack>
      <Box>
        <Title order={3} className={styles['company']}>
          {position.company}
        </Title>
        <Text className={styles['position-title']}>{position.title}</Text>
        <Text className={styles['position-location']}>
          {location && (
            <>
              {location}{' '}
              <Box component="span" aria-hidden="true">
                /
              </Box>{' '}
            </>
          )}
          {`${position.employment.type} ${position.employment.schedule}`}
        </Text>
        <List className={styles['highlights']}>
          {position.highlights.map((item) => (
            <List.Item key={item}>{item}</List.Item>
          ))}
        </List>
        {hasDetails ? (
          <Box component="details" className={styles['role-details']}>
            <Box component="summary">
              More about this role{' '}
              <SiteIcon icon={IconChevronDown} className={styles['disclosure-icon']} />
            </Box>
            <Box className={styles['role-description']}>
              {description.map((paragraph) => (
                <Text component="p" key={paragraph}>
                  {paragraph}
                </Text>
              ))}
              {skills.length > 0 && (
                <Group gap="xs" component="ul" aria-label="Skills" className={styles['skills']}>
                  {skills.map((skill) => (
                    <Badge key={skill} component="li" variant="light" color="ember.9">
                      {skill}
                    </Badge>
                  ))}
                </Group>
              )}
              {detailsLink}
            </Box>
          </Box>
        ) : (
          detailsLink && <Box className={styles['role-details']}>{detailsLink}</Box>
        )}
      </Box>
    </Box>
  )
}

// Internal

function formatMonth(value: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}-01T00:00:00Z`))
}
