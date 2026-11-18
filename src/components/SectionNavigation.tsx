import { Anchor, Box, Group } from '@mantine/core'
import { IconArrowUpRight } from '@tabler/icons-react'

import type { ResumeSection } from '../Resume'
import { SiteIcon } from './SiteIcon'

export type SectionNavigationProps = {
  readonly sections: readonly ResumeSection[]
  readonly activeId: ResumeSection['id'] | null
}

export function SectionNavigation({ sections, activeId }: SectionNavigationProps) {
  return (
    <Group component="nav" aria-label="Main navigation" wrap="nowrap">
      {sections.map((section) => (
        <Anchor
          key={section.id}
          href={`#${section.id}`}
          aria-current={activeId === section.id ? 'location' : undefined}
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
  )
}
