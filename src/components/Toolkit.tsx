import { Box, Group, Text } from '@mantine/core'

import type { Resume } from '../Resume'

import typography from '../Typography.module.css'
import styles from './Toolkit.module.css'

export type ToolkitProps = {
  readonly toolkit: Resume['toolkit']
  readonly profiles: Resume['contact']['profiles']
  readonly technologies: Resume['technologies']
}

export function Toolkit({ toolkit, profiles, technologies }: ToolkitProps) {
  return (
    <>
      <Box className={styles['print-contact']}>
        {profiles.map((profile) => (
          <Text component="p" key={profile.network}>
            {profile.network}: {profile.url}
          </Text>
        ))}
      </Box>

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
    </>
  )
}
