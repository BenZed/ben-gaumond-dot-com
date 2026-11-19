import { ActionIcon, Anchor, Box, Group } from '@mantine/core'
import { IconBrandLinkedin, IconDownload } from '@tabler/icons-react'
import { useRef } from 'react'

import { useActiveSection } from '../hooks/useActiveSection'
import { useWriteOn, type WriteOnAnimation } from '../hooks/useWriteOn'
import type { Resume, ResumeSection } from '../Resume'
import { ColorModeControl } from './ColorModeControl'
import { ExternalLink } from './ExternalLink'
import { HeaderTooltip } from './HeaderTooltip'
import { ProfileMark } from './ProfileMark'
import { SectionNavigation } from './SectionNavigation'
import { SiteIcon } from './SiteIcon'

import styles from './SiteHeader.module.css'

const LINKED_IN_LABEL = 'See what programming taught me about B2B Sales'
const DOWNLOAD_LABEL = 'Download My Resume'
const WRITE_IN: WriteOnAnimation = { from: 0, to: 1, delay: 150, duration: 260, steps: 14 } as const
const WRITE_OUT: WriteOnAnimation = { from: 1, to: 0, duration: 150, steps: 10 } as const

export type SiteHeaderProps = {
  readonly name: string
  readonly linkedinUrl: Resume['basics']['linkedinUrl']
  readonly siteRepositoryUrl: Resume['basics']['siteRepositoryUrl']
  readonly sections: readonly ResumeSection[]
}

export function SiteHeader({ name, linkedinUrl, siteRepositoryUrl, sections }: SiteHeaderProps) {
  const header = useRef<HTMLElement>(null)
  const { current, previous } = useActiveSection(header, sections)
  const changing = current !== previous
  const currentLabel = sections.find(({ id }) => id === current)?.label
  const previousLabel = changing ? sections.find(({ id }) => id === previous)?.label : undefined

  const title = (
    <Box component="span" className={styles['header-title']}>
      <ProfileMark size="var(--header-title-size)" />
      {(currentLabel || previousLabel) && (
        <Box component="span" className={styles['header-label']} aria-hidden="true">
          {previousLabel && (
            <HeaderLabel key={`out-${previous}`} label={previousLabel} motion="out" />
          )}
          {currentLabel && (
            <HeaderLabel
              key={`in-${current}`}
              label={currentLabel}
              motion={changing ? 'in' : undefined}
            />
          )}
        </Box>
      )}
    </Box>
  )

  return (
    <Box component="header" className={styles['site-header']} ref={header}>
      <Anchor className={styles['home-link']} href="#top" aria-label={`${name}, back to top`}>
        {title}
      </Anchor>

      <SectionNavigation sections={sections} activeId={current} compactTitle={title} />

      <Group className={styles['header-actions']} gap={4} wrap="nowrap">
        <ColorModeControl />

        <HeaderTooltip label={LINKED_IN_LABEL}>
          <ActionIcon
            component="a"
            href={linkedinUrl}
            aria-label={LINKED_IN_LABEL}
            variant="subtle"
            size={36}
          >
            <SiteIcon icon={IconBrandLinkedin} />
          </ActionIcon>
        </HeaderTooltip>

        <ExternalLink href={siteRepositoryUrl} label="View on GitHub" iconOnly />

        <HeaderTooltip label={DOWNLOAD_LABEL}>
          <ActionIcon
            component="a"
            href="./resume.pdf"
            download="ben-gaumond-resume.pdf"
            aria-label={DOWNLOAD_LABEL}
            variant="subtle"
            size={36}
          >
            <SiteIcon icon={IconDownload} />
          </ActionIcon>
        </HeaderTooltip>
      </Group>
    </Box>
  )
}

// Internal

type HeaderLabelProps = {
  readonly label: string
  readonly motion?: 'in' | 'out' | undefined
}

function HeaderLabel({ label, motion }: HeaderLabelProps) {
  const writeOn = useWriteOn<HTMLSpanElement>(
    motion === 'in' ? WRITE_IN : motion === 'out' ? WRITE_OUT : undefined,
  )

  return (
    <Box component="span" {...writeOn}>
      {label}
    </Box>
  )
}
