import { Anchor, Box, Container, MantineProvider } from '@mantine/core'

import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { Toolkit } from './components/Toolkit'
import type { Resume } from './Resume'
import { AboutSection } from './sections/AboutSection'
import { ContactSection } from './sections/ContactSection'
import { ExperienceSection } from './sections/ExperienceSection'
import { HeroSection } from './sections/HeroSection'
import { WorkSection } from './sections/WorkSection'
import { theme } from './theme'

export type AppProps = Resume

export function App({
  basics,
  experience,
  work,
  about,
  contact,
  technologies,
  heroNote,
  toolkit,
}: AppProps) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Anchor className="skip-link" href="#main">
        Skip to content
      </Anchor>

      <Container size={1120} className="page-shell" id="top">
        <SiteHeader
          name={basics.name}
          wordmark={basics.wordmark}
          sections={[experience.section, work.section, about.section, contact.section]}
        />

        <Box component="main" id="main">
          <HeroSection basics={basics} note={heroNote} experienceId={experience.section.id} />

          <Toolkit toolkit={toolkit} profiles={contact.profiles} technologies={technologies} />

          <ExperienceSection experience={experience} />

          <WorkSection work={work} positions={experience.positions} />

          <AboutSection about={about} location={basics.location} technologies={technologies} />

          <ContactSection contact={contact} />
        </Box>

        <SiteFooter name={basics.name} role={basics.role} />
      </Container>
    </MantineProvider>
  )
}
