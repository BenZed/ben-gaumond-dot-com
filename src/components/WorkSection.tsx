import { Anchor, Box, Text, Title } from '@mantine/core'
import { IconArrowUpRight } from '@tabler/icons-react'

import type { Position } from '../Resume'
import { Section } from './Section'
import { SiteIcon } from './SiteIcon'

export function WorkSection({ experience }: { readonly experience: readonly Position[] }) {
  const projects = experience.filter((position) => position.projectTitle !== undefined)
  return (
    <Section
      id="work"
      className="section work-section"
      eyebrow="02 / Selected work"
      title="Code with a creative side."
    >
      <Section.Header aside="Interactive drawing for PBS Kids" />
      <Box className="project-grid">
        {projects.map((project, index) => (
          <Box component="article" className="project-card" key={project.id}>
            <Box className={`project-art project-art-${String(index)}`} aria-hidden="true">
              <Box component="span" className="drawing-line" />
              <Box component="span" className="drawing-circle" />
              <Box component="span" className="drawing-square" />
              <Box component="span" className="art-label">
                scribbles
                <br />
                <em>& ink.</em>
              </Box>
              <Box component="span" className="art-number">
                0{index + 1}
              </Box>
            </Box>
            <Box className="project-copy">
              <Text component="p" className="eyebrow">
                PBS / {project.start.slice(0, 4)}
              </Text>
              <Title order={3}>{project.projectTitle}</Title>
              <Text component="p">{project.highlights[0]}</Text>
              {project.url && (
                <Anchor href={project.url} className="text-link">
                  Explore the project <SiteIcon icon={IconArrowUpRight} />
                </Anchor>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Section>
  )
}
