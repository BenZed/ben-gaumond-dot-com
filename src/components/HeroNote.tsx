import { Box } from '@mantine/core'
import { IconArrowRight, IconArrowUpRight } from '@tabler/icons-react'
import { Fragment } from 'react'

import type { Resume } from '../Resume'
import { SiteIcon } from './SiteIcon'

export type HeroNoteProps = {
  readonly note: Resume['heroNote']
  readonly wordmark: string
}

export function HeroNote({ note, wordmark }: HeroNoteProps) {
  return (
    <Box component="aside" className="hero-note" aria-label={note.label}>
      <Box component="span" className="note-index">
        {note.lines.map((line, index) => (
          <Fragment key={line}>
            {index > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </Box>
      <Box className="craft-diagram" aria-hidden="true">
        <Box component="span" className="orbit orbit-one" />
        <Box component="span" className="orbit orbit-two" />
        <Box component="span" className="orbit orbit-three" />
        <Box component="span" className="diagram-center">
          {wordmark}.
        </Box>
        <Box component="span" className="orbit-dot" />
      </Box>
      <Box className="note-bottom">
        <Box component="span" className="craft-path">
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
