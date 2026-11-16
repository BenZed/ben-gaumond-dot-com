import { Anchor, Box, Container, MantineProvider } from '@mantine/core'

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
  const { basics, experience, technologies } = resume
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Anchor className="skip-link" href="#main">
        Skip to content
      </Anchor>
      <Container size={1120} className="page-shell" id="top">
        <SiteHeader />
        <Box component="main" id="main">
          <HeroSection summary={basics.summary} />
          <Toolkit profiles={basics.profiles} technologies={technologies} />
          <ExperienceSection experience={experience} />
          <WorkSection experience={experience} />
          <AboutSection basics={basics} />
          <ContactSection profiles={basics.profiles} />
        </Box>
        <SiteFooter name={basics.name} />
      </Container>
    </MantineProvider>
  )
}
