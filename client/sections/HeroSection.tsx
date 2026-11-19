import { Box, Image, Text } from '@mantine/core'
import { IconMapPin } from '@tabler/icons-react'

import { Section } from '../components/Section'
import { SiteIcon } from '../components/SiteIcon'
import type { Resume } from '../util/Resume'

import styles from './HeroSection.module.css'

const LOCATION_ICON_SIZE = 14

export type HeroSectionProps = {
  readonly basics: Pick<
    Resume['basics'],
    'name' | 'section' | 'summary' | 'role' | 'shortLocation' | 'portrait'
  >
}

export function HeroSection({ basics }: HeroSectionProps) {
  return (
    <Section
      id={basics.section.id}
      className={styles['hero']}
      headingOrder={1}
      eyebrow={
        <>
          <SiteIcon icon={IconMapPin} size={LOCATION_ICON_SIZE} /> {basics.role} ·{' '}
          {basics.shortLocation}
        </>
      }
      title={basics.section.title}
    >
      <Box>
        <Section.Header
          className={styles['hero-heading']}
          classNames={{ eyebrow: styles['hero-eyebrow'] }}
        />
        <Text component="p" className={styles['hero-summary']}>
          {basics.summary}
        </Text>
      </Box>
      <Box className={styles['portrait']}>
        <Image src={basics.portrait} alt={basics.name} width={399} height={400} />
      </Box>
    </Section>
  )
}
