import { Anchor, Box, Text } from '@mantine/core'

import type { Resume } from '../Resume'

import styles from './PrintContact.module.css'

export type PrintContactProps = {
  readonly profiles: Resume['contact']['profiles']
}

export function PrintContact({ profiles }: PrintContactProps) {
  if (profiles.length === 0) return null

  return (
    <Box className={styles['profiles']}>
      {profiles.map(({ network, url }) => (
        <Text component="p" key={network} size="xs">
          {network}:{' '}
          <Anchor href={url} inherit>
            {url}
          </Anchor>
        </Text>
      ))}
    </Box>
  )
}
