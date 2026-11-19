import { Anchor, Box, Container, MantineProvider } from '@mantine/core'

import { CodeBackground } from './components/CodeBackground'
import { PrintContact } from './components/PrintContact'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { Toolkit } from './components/Toolkit'
import { AboutSection } from './sections/AboutSection'
import { ExperienceSection } from './sections/ExperienceSection'
import { HeroSection } from './sections/HeroSection'
import { WorkSection } from './sections/WorkSection'
import { cssVariablesResolver, theme } from './theme'
import { resolveTools } from './util/resolveTools'
import type { Resume } from './util/Resume'

import styles from './App.module.css'

export type AppProps = Resume

export function App({ basics, experience, work, about, tools, toolkit }: AppProps) {
  const featuredTools = resolveTools(tools, toolkit.featuredToolIds)

  return (
    <MantineProvider
      theme={theme}
      cssVariablesResolver={cssVariablesResolver}
      defaultColorScheme="auto"
    >
      <CodeBackground />
      <Anchor className={styles['skip-link']} href="#main">
        Skip to content
      </Anchor>

      <Container size="var(--site-page-width)" className={styles['page-shell']} id="top">
        <SiteHeader
          name={basics.name}
          linkedinUrl={basics.linkedinUrl}
          siteRepositoryUrl={basics.siteRepositoryUrl}
          sections={[experience.section, work.section, about.section]}
        />

        <Box component="main" id="main">
          <HeroSection basics={basics} />

          <PrintContact websiteUrl={basics.websiteUrl} linkedinUrl={basics.linkedinUrl} />

          <Toolkit toolkit={toolkit} tools={tools} featuredTools={featuredTools} />

          <ExperienceSection experience={experience} />

          <WorkSection work={work} positions={experience.positions} />

          <AboutSection
            about={about}
            location={basics.location}
            technologyLabels={featuredTools.map(({ label }) => label)}
          />
        </Box>

        <SiteFooter name={basics.name} role={basics.role} />
      </Container>
    </MantineProvider>
  )
}
