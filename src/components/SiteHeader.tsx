import { Anchor, Box } from '@mantine/core'
import { useRef } from 'react'

import { useActiveSection } from '../hooks/useActiveSection'
import type { ResumeSection } from '../Resume'
import { ColorModeControl } from './ColorModeControl'
import { SectionNavigation } from './SectionNavigation'

type HeaderLabelProps = {
  readonly label: string | undefined
  readonly wordmark: string
}

function HeaderLabel({ label, wordmark }: HeaderLabelProps) {
  return label === undefined ? (
    <Box component="span" className="wordmark">
      {wordmark}
      <Box component="span">.</Box>
    </Box>
  ) : (
    <Box component="span" className="active-section-label">
      {label}
    </Box>
  )
}

export type SiteHeaderProps = {
  readonly name: string
  readonly wordmark: string
  readonly sections: readonly ResumeSection[]
}

export function SiteHeader({ name, wordmark, sections }: SiteHeaderProps) {
  const header = useRef<HTMLElement>(null)
  const { current, previous } = useActiveSection(header, sections)
  const changing = current !== previous

  return (
    <Box component="header" className="site-header" ref={header}>
      <Anchor className="header-title" href="#top" aria-label={`${name}, back to top`}>
        {changing && (
          <Box
            component="span"
            key={`out-${previous}`}
            className="header-title-out"
            aria-hidden="true"
          >
            <HeaderLabel
              wordmark={wordmark}
              label={sections.find(({ id }) => id === previous)?.label}
            />
          </Box>
        )}
        <Box
          component="span"
          key={`in-${current}`}
          className={changing ? 'header-title-in' : undefined}
          aria-hidden="true"
        >
          <HeaderLabel
            wordmark={wordmark}
            label={sections.find(({ id }) => id === current)?.label}
          />
        </Box>
      </Anchor>
      <SectionNavigation sections={sections} activeId={current} />
      <ColorModeControl />
    </Box>
  )
}
