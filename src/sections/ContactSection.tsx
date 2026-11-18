import { Button, Group } from '@mantine/core'
import { IconArrowUpRight } from '@tabler/icons-react'

import { Section } from '../components/Section'
import { SiteIcon } from '../components/SiteIcon'
import type { Resume } from '../Resume'

import styles from './ContactSection.module.css'

export type ContactSectionProps = {
  readonly contact: Resume['contact']
}

export function ContactSection({ contact }: ContactSectionProps) {
  return (
    <Section
      id={contact.section.id}
      className={styles['contact-section']}
      eyebrow={contact.section.eyebrow}
      title={contact.section.title}
    >
      <Section.Header className={styles['contact-header']} />
      <Group>
        {contact.profiles.map((profile) => (
          <Button
            key={profile.network}
            component="a"
            href={profile.url}
            classNames={{ root: styles['contact-button'] }}
            color="ember.9"
            size="lg"
            rightSection={<SiteIcon icon={IconArrowUpRight} />}
          >
            Connect on {profile.network}
          </Button>
        ))}
      </Group>
    </Section>
  )
}
