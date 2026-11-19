import { useMemo } from 'react'

import { CaseStudy } from '../components/CaseStudy'
import { Section } from '../components/Section'
import type { Position, Resume } from '../util/Resume'

import sectionStyles from '../components/Section.module.css'
import styles from './WorkSection.module.css'

export type WorkSectionProps = {
  readonly work: Resume['work']
  readonly positions: readonly Position[]
}

export function WorkSection({ work, positions }: WorkSectionProps) {
  const caseStudies = useCaseStudyPositions(work.caseStudies, positions)

  return (
    <Section
      id={work.section.id}
      className={[sectionStyles['section'], styles['work-section']].join(' ')}
      eyebrow={work.section.eyebrow}
      title={work.section.title}
    >
      <Section.Header aside={work.aside} />
      {caseStudies.map(({ study, relatedPositions }) => (
        <CaseStudy
          key={study.title}
          study={study}
          positions={relatedPositions}
          artwork={work.artwork}
        />
      ))}
    </Section>
  )
}

// Internal

/** Resolves each study's position IDs in their configured order. */
function useCaseStudyPositions(
  caseStudies: Resume['work']['caseStudies'],
  positions: readonly Position[],
) {
  return useMemo(() => {
    const positionsById = new Map(positions.map((position) => [position.id, position]))

    return caseStudies.map((study) => {
      const relatedPositions = study.positionIds.map((id) => {
        const position = positionsById.get(id)
        if (!position) {
          throw new Error(`Case study "${study.title}" references unknown position "${id}"`)
        }
        return position
      })

      return { study, relatedPositions }
    })
  }, [caseStudies, positions])
}
