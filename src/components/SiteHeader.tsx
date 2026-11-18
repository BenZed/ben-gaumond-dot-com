import { ActionIcon, Anchor, Box, Group } from '@mantine/core'
import { IconBrandLinkedin, IconDownload } from '@tabler/icons-react'
import { useRef } from 'react'

import { useActiveSection } from '../hooks/useActiveSection'
import type { Resume, ResumeSection } from '../Resume'
import { ColorModeControl } from './ColorModeControl'
import { ProfileMark } from './ProfileMark'
import { SectionNavigation } from './SectionNavigation'
import { SiteIcon } from './SiteIcon'

import styles from './SiteHeader.module.css'

type HeaderLabelProps = {
  readonly label: string | undefined
}

function HeaderLabel({ label }: HeaderLabelProps) {
  return label === undefined ? (
    <ProfileMark size="var(--header-title-size)" />
  ) : (
    <Box component="span" className={styles['active-section-label']}>
      {label}
    </Box>
  )
}

export type SiteHeaderProps = {
  readonly name: string
  readonly linkedinUrl: Resume['basics']['linkedinUrl']
  readonly sections: readonly ResumeSection[]
}

export function SiteHeader({ name, linkedinUrl, sections }: SiteHeaderProps) {
  const header = useRef<HTMLElement>(null)
  const { current, previous } = useActiveSection(header, sections)
  const changing = current !== previous

  return (
    <Box component="header" className={styles['site-header']} ref={header}>
      <Anchor className={styles['header-title']} href="#top" aria-label={`${name}, back to top`}>
        {changing && (
          <Box
            component="span"
            key={`out-${previous}`}
            className={styles['header-title-out']}
            aria-hidden="true"
          >
            <HeaderLabel label={sections.find(({ id }) => id === previous)?.label} />
          </Box>
        )}
        <Box
          component="span"
          key={`in-${current}`}
          className={changing ? styles['header-title-in'] : undefined}
          aria-hidden="true"
        >
          <HeaderLabel label={sections.find(({ id }) => id === current)?.label} />
        </Box>
      </Anchor>
      <SectionNavigation sections={sections} activeId={current} />
      <Group className={styles['header-actions']} gap={4} wrap="nowrap">
        <ColorModeControl />
        <ActionIcon
          component="a"
          href={linkedinUrl}
          aria-label="LinkedIn"
          title="LinkedIn"
          variant="subtle"
          size={36}
        >
          <SiteIcon icon={IconBrandLinkedin} />
        </ActionIcon>
        <ActionIcon
          component="a"
          href="./ben-gaumond-resume.pdf"
          download
          aria-label="Download resume"
          title="Download resume"
          variant="subtle"
          size={36}
        >
          <SiteIcon icon={IconDownload} />
        </ActionIcon>
      </Group>
    </Box>
  )
}
