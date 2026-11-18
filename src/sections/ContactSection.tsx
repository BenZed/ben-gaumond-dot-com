import { Button, Group } from '@mantine/core'
import { IconArrowUpRight } from '@tabler/icons-react'

import { Section } from '../components/Section'
import { SiteIcon } from '../components/SiteIcon'
import type { Resume } from '../Resume'

export type ContactSectionProps = {
  readonly contact: Resume['contact']
}

export function ContactSection({ contact }: ContactSectionProps) {
  return (
    <Section
      id={contact.section.id}
      className="contact-section"
      eyebrow={contact.section.eyebrow}
      title={contact.section.title}
    >
      <Section.Header className="contact-heading" />
      <Group>
        {contact.profiles.map((profile) => (
          <Button
            key={profile.network}
            component="a"
            href={profile.url}
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
