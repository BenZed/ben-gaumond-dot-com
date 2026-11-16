import { Button, Group } from '@mantine/core'
import { IconArrowUpRight } from '@tabler/icons-react'

import type { Resume } from '../Resume'
import { Section } from './Section'
import { SiteIcon } from './SiteIcon'

export type ContactSectionProps = {
  readonly profiles: Resume['basics']['profiles']
}

export function ContactSection({ profiles }: ContactSectionProps) {
  return (
    <Section
      id="contact"
      className="contact-section"
      eyebrow="Keep in touch"
      title={
        <>
          Let’s talk about
          <br />
          <em>what comes next.</em>
        </>
      }
    >
      <Section.Header className="contact-heading" />
      <Group>
        {profiles.map((profile) => (
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
