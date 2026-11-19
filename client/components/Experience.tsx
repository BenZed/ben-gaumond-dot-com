import { Badge, Box, Group, List, Stack, Text, Title } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'

import type { Position } from '../Resume'
import { ExternalLink } from './ExternalLink'
import { SiteIcon } from './SiteIcon'

import styles from './Experience.module.css'

function formatMonth(value: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}-01T00:00:00Z`))
}

export type ExperienceProps = {
  readonly position: Position
}

export function Experience({ position }: ExperienceProps) {
  const { description, skills, url } = position
  const hasDetails = description.length > 0 || skills.length > 0 || Boolean(url)

  return (
    <Box component="article" className={styles['experience-row']} id={position.id}>
      <Stack className={styles['experience-date']} gap={14} align="flex-start">
        <Box component="span">
          {formatMonth(position.start)} —{' '}
          {position.end === null ? 'Present' : formatMonth(position.end)}
        </Box>
        {position.end === null && (
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
          {position.location}{' '}
          <Box component="span" aria-hidden="true">
            /
          </Box>{' '}
          {position.employmentType}
        </Text>
        <List className={styles['highlights']}>
          {position.highlights.map((item) => (
            <List.Item key={item}>{item}</List.Item>
          ))}
        </List>
        {hasDetails && (
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
              {url && (
                <ExternalLink
                  href={url}
                  label={`Visit ${position.projectTitle !== undefined ? 'the project' : position.company}`}
                />
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}
