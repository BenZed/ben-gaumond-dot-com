import { Anchor, Box, Group, SimpleGrid, Stack, Text } from '@mantine/core'
import { Fragment } from 'react'

import { resolveTools } from '../resolveTools'
import type { Resume, Tool } from '../Resume'

import typography from '../Typography.module.css'
import styles from './Toolkit.module.css'

export type ToolkitProps = {
  readonly toolkit: Resume['toolkit']
  readonly tools: readonly Tool[]
  readonly featuredTools: readonly Tool[]
}

export function Toolkit({ toolkit, tools, featuredTools }: ToolkitProps) {
  return (
    <>
      <Box className={styles['technology-strip']}>

        <Box
          component="span"
          className={[typography['eyebrow'], styles['toolkit-eyebrow']].join(' ')}
        >
          {toolkit.label}
        </Box>

        <Group className={styles['tools']} gap="xl">
          {featuredTools.map(({ id, label, url }) => (
            <Anchor key={id} href={url} inherit c="inherit" underline="always">
              {label}
            </Anchor>
          ))}
        </Group>

        <Box component="span" className={styles['strip-note']}>
          {toolkit.note}
        </Box>

      </Box>

      {toolkit.areas.length > 0 && (
        <SimpleGrid className={styles['areas']} cols={{ base: 1, sm: 3 }} spacing="lg">
          {toolkit.areas.map((area) => (
            <Stack key={area.label} gap="xs">
              <Text fw={700}>{area.label}</Text>
              <Text size="sm">{area.summary}</Text>
              <Text size="xs" className={styles['area-tools']}>
                {resolveTools(tools, area.toolIds).map(({ id, label, url }, index) => (
                  <Fragment key={id}>
                    {index > 0 && ' · '}
                    <Anchor href={url} inherit c="inherit" underline="always">
                      {label}
                    </Anchor>
                  </Fragment>
                ))}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>
      )}
    </>
  )
}
