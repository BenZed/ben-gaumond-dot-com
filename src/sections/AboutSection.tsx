import { Box, Text } from '@mantine/core'
import { useMemo } from 'react'

import { Section } from '../components/Section'
import type { Resume } from '../Resume'

import sectionStyles from '../components/Section.module.css'
import styles from './AboutSection.module.css'

export type AboutSectionProps = {
  readonly about: Resume['about']
  readonly location: Resume['basics']['location']
  readonly technologies: Resume['technologies']
}

export function AboutSection({ about, location, technologies }: AboutSectionProps) {
  const technologyList = useMemo(
    () => new Intl.ListFormat('en-US').format(technologies),
    [technologies],
  )

  return (
    <Section
      id={about.section.id}
      className={[sectionStyles['section'], styles['about-section']].join(' ')}
      eyebrow={about.section.eyebrow}
      title={about.section.title}
    >
      <Section.Header className={styles['about-header']} />
      <Box className={styles['about-copy']}>
        <Text component="p">{about.paragraphs[0]}</Text>
        <Text component="p">{about.approach}</Text>
        <Text component="p" className={styles['about-footnote']}>
          {technologyList} · {location}
        </Text>
      </Box>
    </Section>
  )
}
