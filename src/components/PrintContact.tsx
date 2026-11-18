import { Anchor, Text } from '@mantine/core'

import type { Resume } from '../Resume'

import styles from './PrintContact.module.css'

export type PrintContactProps = {
  readonly linkedinUrl: Resume['basics']['linkedinUrl']
}

export function PrintContact({ linkedinUrl }: PrintContactProps) {
  return (
    <Text component="p" className={styles['print-contact']} size="xs">
      LinkedIn:{' '}
      <Anchor href={linkedinUrl} inherit>
        {linkedinUrl}
      </Anchor>
    </Text>
  )
}
