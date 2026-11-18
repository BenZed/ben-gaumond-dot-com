import { Box } from '@mantine/core'
import { IconArrowRight, IconArrowUpRight } from '@tabler/icons-react'
import { Fragment } from 'react'

import type { Resume } from '../Resume'
import { SiteIcon } from './SiteIcon'

import styles from './HeroNote.module.css'

export type HeroNoteProps = {
  readonly note: Resume['heroNote']
  readonly wordmark: string
}

export function HeroNote({ note, wordmark }: HeroNoteProps) {
  return (
    <Box component="aside" className={styles['hero-note']} aria-label={note.label}>
      <Box component="span" className={styles['note-index']}>
        {note.lines.map((line, index) => (
          <Fragment key={line}>
            {index > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </Box>
      <Box className={styles['craft-diagram']} aria-hidden="true">
        <Box component="span" className={[styles['orbit'], styles['orbit-one']].join(' ')} />
        <Box component="span" className={[styles['orbit'], styles['orbit-two']].join(' ')} />
        <Box component="span" className={[styles['orbit'], styles['orbit-three']].join(' ')} />
        <Box component="span" className={styles['diagram-center']}>
          {wordmark}.
        </Box>
        <Box component="span" className={styles['orbit-dot']} />
      </Box>
      <Box className={styles['note-bottom']}>
        <Box component="span" className={styles['craft-path']}>
          {note.steps.map((step, index) => (
            <Fragment key={step}>
              {index > 0 && <SiteIcon icon={IconArrowRight} size={12} />}
              {step}
            </Fragment>
          ))}
        </Box>
        <SiteIcon icon={IconArrowUpRight} />
      </Box>
    </Box>
  )
}
