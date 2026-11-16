import {
  Anchor,
  Badge,
  Button,
  Container,
  Group,
  MantineProvider,
  Text,
  Title,
  createTheme,
} from '@mantine/core'

import { formatMonth } from './resume'
import type { Position, Resume } from './resume'

const theme = createTheme({
  primaryColor: 'forest',
  colors: {
    forest: [
      '#eef5f0',
      '#dce8df',
      '#b9d0c0',
      '#93b79f',
      '#73a283',
      '#5e946f',
      '#4f8560',
      '#40734f',
      '#315f41',
      '#244b3d',
    ],
  },
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  headings: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: '400' },
  defaultRadius: 'sm',
})

function Experience({ position }: { readonly position: Position }) {
  return (
    <article className="experience-row" id={position.id}>
      <div className="experience-date">
        <span>
          {formatMonth(position.start)} —{' '}
          {position.end === null ? 'Present' : formatMonth(position.end)}
        </span>
        {position.end === null && (
          <Badge variant="light" color="forest.9" size="sm">
            Current
          </Badge>
        )}
      </div>
      <div>
        <Title order={3} className="company">
          {position.company}
        </Title>
        <Text className="position-title">{position.title}</Text>
        <Text className="position-location">
          {position.location} <span aria-hidden="true">/</span> {position.employmentType}
        </Text>
        <ul className="highlights">
          {position.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <details className="role-details">
          <summary>
            More about this role <span aria-hidden="true">+</span>
          </summary>
          <div className="role-description">
            {position.description
              .filter((paragraph) => !paragraph.startsWith('https://'))
              .map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            {position.url && (
              <Anchor href={position.url} className="text-link">
                Visit {position.projectTitle !== undefined ? 'the project' : position.company}{' '}
                <span aria-hidden="true">↗</span>
              </Anchor>
            )}
          </div>
        </details>
      </div>
    </article>
  )
}

export function App({ resume }: { readonly resume: Resume }) {
  const projects = resume.experience.filter((position) => position.projectTitle !== undefined)
  return (
    <MantineProvider theme={theme} forceColorScheme="light">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Container size={1120} className="page-shell">
        <header className="site-header" id="top">
          <a className="wordmark" href="#top" aria-label="Ben Gaumond, back to top">
            bg<span>.</span>
          </a>
          <nav aria-label="Main navigation">
            <a href="#experience">Experience</a>
            <a href="#work">Selected work</a>
            <a href="#about">About</a>
          </nav>
          <a className="header-contact" href="#contact">
            Let’s connect <span aria-hidden="true">↗</span>
          </a>
        </header>
        <main id="main">
          <section className="hero" aria-labelledby="intro-title">
            <div>
              <p className="eyebrow">
                <span className="status-dot" aria-hidden="true" /> Software developer · Vancouver,
                BC
              </p>
              <Title order={1} id="intro-title">
                Ben
                <br />
                <span>Gaumond.</span>
              </Title>
              <p className="hero-summary">{resume.basics.summary}</p>
              <Group gap="sm" className="hero-actions">
                <Button
                  component="a"
                  href="#experience"
                  color="forest.9"
                  size="md"
                  rightSection={<span aria-hidden="true">↓</span>}
                >
                  Explore my experience
                </Button>
                <Button variant="subtle" color="forest.9" size="md" onClick={() => window.print()}>
                  Print resume{' '}
                  <span className="print-arrow" aria-hidden="true">
                    ↗
                  </span>
                </Button>
              </Group>
            </div>
            <aside className="hero-note" aria-label="Areas of work">
              <span className="note-index">
                A creative foundation.
                <br />
                An engineering practice.
              </span>
              <div className="craft-diagram" aria-hidden="true">
                <span className="orbit orbit-one" />
                <span className="orbit orbit-two" />
                <span className="orbit orbit-three" />
                <span className="diagram-center">bg.</span>
                <span className="orbit-dot" />
              </div>
              <div className="note-bottom">
                <span>Animation → interaction → systems</span>
                <span aria-hidden="true">↗</span>
              </div>
            </aside>
          </section>
          <div className="print-contact">
            {resume.basics.profiles.map((profile) => (
              <p key={profile.network}>
                {profile.network}: {profile.url}
              </p>
            ))}
          </div>
          <div className="technology-strip">
            <span className="eyebrow">Core toolkit</span>
            <Group gap="xl">
              {resume.technologies.map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </Group>
            <span className="strip-note">From the interface to the infrastructure.</span>
          </div>
          <section id="experience" className="section" aria-labelledby="experience-title">
            <div className="section-heading">
              <div>
                <p className="eyebrow">01 / Experience</p>
                <Title order={2} id="experience-title">
                  A history of making things work.
                </Title>
              </div>
              <span className="section-aside">
                Software. Creative tools.
                <br />
                Interactive experiences.
              </span>
            </div>
            <div>
              {resume.experience.map((position) => (
                <Experience key={position.id} position={position} />
              ))}
            </div>
          </section>
          <section id="work" className="section work-section" aria-labelledby="work-title">
            <div className="section-heading">
              <div>
                <p className="eyebrow">02 / Selected work</p>
                <Title order={2} id="work-title">
                  Code with a creative side.
                </Title>
              </div>
              <span className="section-aside">Interactive drawing for PBS Kids</span>
            </div>
            <div className="project-grid">
              {projects.map((project, index) => (
                <article className="project-card" key={project.id}>
                  <div className={`project-art project-art-${String(index)}`} aria-hidden="true">
                    <span className="drawing-line" />
                    <span className="drawing-circle" />
                    <span className="drawing-square" />
                    <span className="art-label">
                      scribbles
                      <br />
                      <em>& ink.</em>
                    </span>
                    <span className="art-number">0{index + 1}</span>
                  </div>
                  <div className="project-copy">
                    <p className="eyebrow">PBS / {project.start.slice(0, 4)}</p>
                    <Title order={3}>{project.projectTitle}</Title>
                    <p>{project.highlights[0]}</p>
                    {project.url && (
                      <Anchor href={project.url} className="text-link">
                        Explore the project <span aria-hidden="true">↗</span>
                      </Anchor>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section id="about" className="section about-section" aria-labelledby="about-title">
            <div>
              <p className="eyebrow">03 / Approach</p>
              <Title order={2} id="about-title">
                Creative roots.
                <br />
                Practical engineering.
              </Title>
            </div>
            <div className="about-copy">
              <p>{resume.basics.about[0]}</p>
              <p>{resume.basics.approach}</p>
              <p className="about-footnote">
                TypeScript, React, and Node.js · {resume.basics.location}
              </p>
            </div>
          </section>
          <section id="contact" className="contact-section" aria-labelledby="contact-title">
            <p className="eyebrow">Keep in touch</p>
            <Title order={2} id="contact-title">
              Let’s talk about
              <br />
              <em>what comes next.</em>
            </Title>
            <Group>
              {resume.basics.profiles.map((profile) => (
                <Button
                  key={profile.network}
                  component="a"
                  href={profile.url}
                  color="forest.9"
                  size="lg"
                  rightSection={<span aria-hidden="true">↗</span>}
                >
                  Connect on {profile.network}
                </Button>
              ))}
            </Group>
          </section>
        </main>
        <footer className="site-footer">
          <span>
            {resume.basics.name} <span aria-hidden="true">/</span> Software developer
          </span>
          <a href="#top">Back to top ↑</a>
        </footer>
      </Container>
    </MantineProvider>
  )
}
