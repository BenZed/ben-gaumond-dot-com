import { Anchor, Box, Container, MantineProvider } from '@mantine/core'

import { PrintContact } from './components/PrintContact'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { Toolkit } from './components/Toolkit'
import { resolveTools } from './resolveTools'
import type { Resume } from './Resume'
import { AboutSection } from './sections/AboutSection'
import { ContactSection } from './sections/ContactSection'
import { ExperienceSection } from './sections/ExperienceSection'
import { HeroSection } from './sections/HeroSection'
import { WorkSection } from './sections/WorkSection'
import { cssVariablesResolver, theme } from './theme'

import styles from './App.module.css'

export type AppProps = Resume

export function App({ basics, experience, work, about, contact, tools, toolkit }: AppProps) {
  const featuredTools = resolveTools(tools, toolkit.featuredToolIds)

  return (
    <MantineProvider
      theme={theme}
      cssVariablesResolver={cssVariablesResolver}
      defaultColorScheme="auto"
    >
      <Anchor className={styles['skip-link']} href="#main">
        Skip to content
      </Anchor>

      <Container size={1120} className={styles['page-shell']} id="top">
        <SiteHeader
          name={basics.name}
          sections={[experience.section, work.section, about.section, contact.section]}
        />

        <Box component="main" id="main">
          <HeroSection basics={basics} />

          <PrintContact profiles={contact.profiles} />

          <Toolkit toolkit={toolkit} tools={tools} featuredTools={featuredTools} />

          <ExperienceSection experience={experience} />

          <WorkSection work={work} positions={experience.positions} />

          <AboutSection
            about={about}
            location={basics.location}
            technologyLabels={featuredTools.map(({ label }) => label)}
          />

          <ContactSection contact={contact} />
        </Box>

        <SiteFooter name={basics.name} role={basics.role} />
      </Container>
    </MantineProvider>
  )
}
