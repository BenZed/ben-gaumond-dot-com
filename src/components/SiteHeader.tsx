import { Anchor, Box, Group } from '@mantine/core'
import { IconArrowUpRight } from '@tabler/icons-react'
import { useRef } from 'react'

import { ColorModeControl } from './ColorModeControl'
import { SiteIcon } from './SiteIcon'
import { sections, useActiveSection } from './useActiveSection'

function HeaderLabel({ section }: { readonly section: (typeof sections)[number]['id'] | null }) {
  return section === null ? (
    <Box component="span" className="wordmark">
      bg<Box component="span">.</Box>
    </Box>
  ) : (
    <Box component="span" className="active-section-label">
      {sections.find(({ id }) => id === section)?.label}
    </Box>
  )
}

export function SiteHeader() {
  const header = useRef<HTMLElement>(null)
  const { current, previous } = useActiveSection(header)
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
            <HeaderLabel section={previous} />
          </Box>
        )}
        <Box
          component="span"
          key={`in-${current}`}
          className={changing ? 'header-title-in' : undefined}
          aria-hidden="true"
        >
          <HeaderLabel section={current} />
        </Box>
      </Anchor>
      <Group component="nav" aria-label="Main navigation" wrap="nowrap">
        {sections.map(({ id, label }) => (
          <Anchor
            key={id}
            href={`#${id}`}
            aria-current={current === id ? 'location' : undefined}
            className={id === 'contact' ? 'header-contact' : undefined}
          >
            {id === 'contact' ? (
              <>
                <Box component="span" className="contact-label-wide">
                  Let’s connect
                </Box>
                <Box component="span" className="contact-label-compact">
                  Contact
                </Box>
                <SiteIcon icon={IconArrowUpRight} />
              </>
            ) : (
              label
            )}
          </Anchor>
        ))}
      </Group>
      <ColorModeControl />
    </Box>
  )
}
