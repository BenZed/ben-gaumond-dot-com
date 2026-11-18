import { Anchor, Box, Container, MantineProvider } from '@mantine/core'
import { Fragment } from 'react'

import { AboutSection } from './components/AboutSection'
import { ContactSection } from './components/ContactSection'
import { ExperienceSection } from './components/ExperienceSection'
import { HeroSection } from './components/HeroSection'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { Toolkit } from './components/Toolkit'
import { WorkSection } from './components/WorkSection'
import type { Resume } from './Resume'
import { theme } from './theme'

export function App({ resume }: { readonly resume: Resume }) {
  const { basics, experience, work, about, contact, technologies } = resume
  const sections = [
    { section: experience.section, content: <ExperienceSection experience={experience} /> },
    {
      section: work.section,
      content: <WorkSection work={work} positions={experience.positions} />,
    },
    { section: about.section, content: <AboutSection about={about} location={basics.location} /> },
    { section: contact.section, content: <ContactSection contact={contact} /> },
  ]
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Anchor className="skip-link" href="#main">
        Skip to content
      </Anchor>
      <Container size={1120} className="page-shell" id="top">
        <SiteHeader sections={sections.map(({ section }) => section)} />
        <Box component="main" id="main">
          <HeroSection basics={basics} experienceId={experience.section.id} />
          <Toolkit profiles={contact.profiles} technologies={technologies} />
          {sections.map(({ section, content }) => (
            <Fragment key={section.id}>{content}</Fragment>
          ))}
        </Box>
        <SiteFooter name={basics.name} />
      </Container>
    </MantineProvider>
  )
}
