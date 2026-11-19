import { Anchor, Text } from '@mantine/core'

import type { Resume } from '../util/Resume'

import styles from './PrintContact.module.css'

export type PrintContactProps = {
  readonly websiteUrl: Resume['basics']['websiteUrl']
  readonly linkedinUrl: Resume['basics']['linkedinUrl']
}

export function PrintContact({ websiteUrl, linkedinUrl }: PrintContactProps) {
  return (
    <Text component="p" className={styles['print-contact']} size="xs">
      <Anchor href={websiteUrl} inherit>
        {new URL(websiteUrl).hostname}
      </Anchor>
      {' · '}
      <Anchor href={linkedinUrl} inherit>
        LinkedIn
      </Anchor>
    </Text>
  )
}
