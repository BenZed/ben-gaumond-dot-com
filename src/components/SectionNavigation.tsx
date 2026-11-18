import { Anchor, Group } from '@mantine/core'

import type { ResumeSection } from '../Resume'

import styles from './SectionNavigation.module.css'

export type SectionNavigationProps = {
  readonly sections: readonly ResumeSection[]
  readonly activeId: ResumeSection['id'] | null
}

export function SectionNavigation({ sections, activeId }: SectionNavigationProps) {
  return (
    <Group
      className={styles['section-nav']}
      component="nav"
      aria-label="Main navigation"
      wrap="nowrap"
    >
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
  )
}
