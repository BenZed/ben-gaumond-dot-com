import { ActionIcon, Anchor, Box, Group } from '@mantine/core'
import { IconBrandLinkedin, IconDownload } from '@tabler/icons-react'
import { useRef } from 'react'

import { useActiveSection } from '../hooks/useActiveSection'
import type { Resume, ResumeSection } from '../Resume'
import { ColorModeControl } from './ColorModeControl'
import { ExternalLink } from './ExternalLink'
import { HeaderTooltip } from './HeaderTooltip'
import { ProfileMark } from './ProfileMark'
import { SectionNavigation } from './SectionNavigation'
import { SiteIcon } from './SiteIcon'

import styles from './SiteHeader.module.css'

const linkedinLabel = 'LinkedIn'
const downloadLabel = 'Download resume'

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
            <Box component="span" key={`out-${previous}`} className={styles['header-title-out']}>
              {previousLabel}
            </Box>
          )}
          {currentLabel && (
            <Box
              component="span"
              key={`in-${current}`}
              className={changing ? styles['header-title-in'] : undefined}
            >
              {currentLabel}
            </Box>
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
        <HeaderTooltip label={linkedinLabel}>
          <ActionIcon
            component="a"
            href={linkedinUrl}
            aria-label={linkedinLabel}
            variant="subtle"
            size={36}
          >
            <SiteIcon icon={IconBrandLinkedin} />
          </ActionIcon>
        </HeaderTooltip>
        <ExternalLink href={siteRepositoryUrl} label="Site source on GitHub" iconOnly />
        <HeaderTooltip label={downloadLabel}>
          <ActionIcon
            component="a"
            href="./ben-gaumond-resume.pdf"
            download
            aria-label={downloadLabel}
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
