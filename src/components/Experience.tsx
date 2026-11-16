import { Anchor, Badge, Box, List, Stack, Text, Title } from '@mantine/core'
import { IconArrowUpRight, IconChevronDown } from '@tabler/icons-react'

import { formatMonth } from '../resumeSchema'
import type { Position } from '../resumeSchema'
import { SiteIcon } from './SiteIcon'

export function Experience({ position }: { readonly position: Position }) {
  return (
    <Box component="article" className="experience-row" id={position.id}>
      <Stack className="experience-date" gap={14} align="flex-start">
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
        <Title order={3} className="company">
          {position.company}
        </Title>
        <Text className="position-title">{position.title}</Text>
        <Text className="position-location">
          {position.location}{' '}
          <Box component="span" aria-hidden="true">
            /
          </Box>{' '}
          {position.employmentType}
        </Text>
        <List className="highlights">
          {position.highlights.map((item) => (
            <List.Item key={item}>{item}</List.Item>
          ))}
        </List>
        <Box component="details" className="role-details">
          <Box component="summary">
            More about this role <SiteIcon icon={IconChevronDown} className="disclosure-icon" />
          </Box>
          <Box className="role-description">
            {position.description
              .filter((paragraph) => !paragraph.startsWith('https://'))
              .map((paragraph) => (
                <Text component="p" key={paragraph}>
                  {paragraph}
                </Text>
              ))}
            {position.url && (
              <Anchor href={position.url} className="text-link">
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
