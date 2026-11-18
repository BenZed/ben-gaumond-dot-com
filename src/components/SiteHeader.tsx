import { Anchor, Box, Group } from '@mantine/core'
import { IconArrowUpRight } from '@tabler/icons-react'
import { useRef } from 'react'

import type { ResumeSection } from '../Resume'
import { ColorModeControl } from './ColorModeControl'
import { SiteIcon } from './SiteIcon'
import { useActiveSection } from './useActiveSection'

type HeaderLabelProps = {
  readonly label: string | undefined
}

function HeaderLabel({ label }: HeaderLabelProps) {
  return label === undefined ? (
    <Box component="span" className="wordmark">
      bg<Box component="span">.</Box>
    </Box>
  ) : (
    <Box component="span" className="active-section-label">
      {label}
    </Box>
  )
}

export type SiteHeaderProps = {
  readonly sections: readonly ResumeSection[]
}

export function SiteHeader({ sections }: SiteHeaderProps) {
  const header = useRef<HTMLElement>(null)
  const { current, previous } = useActiveSection(header, sections)
  const changing = current !== previous

  return (
    <Box component="header" className="site-header" ref={header}>
      <Anchor className="header-title" href="#top" aria-label="Ben Gaumond, back to top">
        {changing && (
          <Box
            component="span"
            key={`out-${previous}`}
            className="header-title-out"
            aria-hidden="true"
          >
            <HeaderLabel label={sections.find(({ id }) => id === previous)?.label} />
          </Box>
        )}
        <Box
          component="span"
          key={`in-${current}`}
          className={changing ? 'header-title-in' : undefined}
          aria-hidden="true"
        >
          <HeaderLabel label={sections.find(({ id }) => id === current)?.label} />
        </Box>
      </Anchor>
      <Group component="nav" aria-label="Main navigation" wrap="nowrap">
        {sections.map((section) => (
          <Anchor
            key={section.id}
            href={`#${section.id}`}
            aria-current={current === section.id ? 'location' : undefined}
            className={'wideLabel' in section ? 'header-contact' : undefined}
          >
            {'wideLabel' in section ? (
              <>
                <Box component="span" className="contact-label-wide">
                  {section.wideLabel}
                </Box>
                <Box component="span" className="contact-label-compact">
                  {section.label}
                </Box>
                <SiteIcon icon={IconArrowUpRight} />
              </>
            ) : (
              section.label
            )}
          </Anchor>
        ))}
      </Group>
      <ColorModeControl />
    </Box>
  )
}
