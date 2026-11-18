import { Box, Group, SimpleGrid, Stack, Text } from '@mantine/core'

import type { Resume } from '../Resume'

import typography from '../Typography.module.css'
import styles from './Toolkit.module.css'

export type ToolkitProps = {
  readonly toolkit: Resume['toolkit']
  readonly technologies: Resume['technologies']
}

export function Toolkit({ toolkit, technologies }: ToolkitProps) {
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
          {technologies.map((technology) => (
            <Box component="span" key={technology}>
              {technology}
            </Box>
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
                {area.tools.join(' · ')}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>
      )}
    </>
  )
}
