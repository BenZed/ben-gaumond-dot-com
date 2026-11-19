import { Anchor, Box, Group, Menu, UnstyledButton } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import type { ReactNode } from 'react'

import type { ResumeSection } from '../types/Resume'
import { SiteIcon } from './SiteIcon'

import styles from './SectionNavigation.module.css'

export type SectionNavigationProps = {
  readonly sections: readonly ResumeSection[]
  readonly activeId: ResumeSection['id'] | null
  readonly compactTitle: ReactNode
}

export function SectionNavigation({ sections, activeId, compactTitle }: SectionNavigationProps) {
  return (
    <Box component="nav" className={styles['section-nav']} aria-label="Main navigation">
      <Group className={styles['section-links']} wrap="nowrap">
        {sections.map((section) => (
          <Anchor
            key={section.id}
            href={`#${section.id}`}
            aria-current={activeId === section.id ? 'location' : undefined}
          >
            {section.label}
          </Anchor>
        ))}
      </Group>
      <Box className={styles['compact-nav']}>
        <Menu
          position="bottom-start"
          floatingStrategy="fixed"
          offset={8}
          shadow="sm"
          withinPortal={false}
        >
          <Menu.Target>
            <UnstyledButton className={styles['section-trigger']} aria-label="Sections">
              {compactTitle}
              <SiteIcon icon={IconChevronDown} size={14} />
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown className={styles['section-menu']} aria-label="Sections">
            {sections.map((section) => (
              <Menu.Item
                component="a"
                key={section.id}
                href={`#${section.id}`}
                aria-current={activeId === section.id ? 'location' : undefined}
              >
                {section.label}
              </Menu.Item>
            ))}
            <Menu.Divider />
            <Menu.Item component="a" href="#top">
              Back to top
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>
    </Box>
  )
}
