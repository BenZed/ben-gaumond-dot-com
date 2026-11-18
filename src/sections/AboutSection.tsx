import { Box, Text } from '@mantine/core'

import { Section } from '../components/Section'
import type { Resume } from '../Resume'

import sectionStyles from '../components/Section.module.css'
import styles from './AboutSection.module.css'

const technologyListFormatter = new Intl.ListFormat('en-US')

export type AboutSectionProps = {
  readonly about: Resume['about']
  readonly location: Resume['basics']['location']
  readonly technologyLabels: readonly string[]
}

export function AboutSection({ about, location, technologyLabels }: AboutSectionProps) {
  const technologyList = technologyListFormatter.format(technologyLabels)

  return (
    <Section
      id={about.section.id}
      className={[sectionStyles['section'], styles['about-section']].join(' ')}
      eyebrow={about.section.eyebrow}
      title={about.section.title}
    >
      <Section.Header className={styles['about-header']} />
      <Box className={styles['about-copy']}>
        {about.paragraphs.map((paragraph) => (
          <Text component="p" key={paragraph}>
            {paragraph}
          </Text>
        ))}
        <Text component="p">{about.approach}</Text>
        <Text component="p" className={styles['about-footnote']}>
          {technologyList} · {location}
        </Text>
      </Box>
    </Section>
  )
}
