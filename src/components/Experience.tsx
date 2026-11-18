import { Anchor, Badge, Box, List, Stack, Text, Title } from '@mantine/core'
import { IconArrowUpRight, IconChevronDown } from '@tabler/icons-react'

import type { Position } from '../Resume'
import { SiteIcon } from './SiteIcon'

import typography from '../Typography.module.css'
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
        <Box component="details" className={styles['role-details']}>
          <Box component="summary">
            More about this role{' '}
            <SiteIcon icon={IconChevronDown} className={styles['disclosure-icon']} />
          </Box>
          <Box className={styles['role-description']}>
            {position.description
              .filter((paragraph) => !paragraph.startsWith('https://'))
              .map((paragraph) => (
                <Text component="p" key={paragraph}>
                  {paragraph}
                </Text>
              ))}
            {position.url && (
              <Anchor href={position.url} className={typography['text-link']}>
                Visit {position.projectTitle !== undefined ? 'the project' : position.company}{' '}
                <SiteIcon icon={IconArrowUpRight} />
              </Anchor>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
