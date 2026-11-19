import type source from '../content/resume.json'
import type { Immutable } from './types/Immutable'

type ResumeSource = typeof source

type SourcePosition = ResumeSource['experience']['positions'][number]
type SourceProject = NonNullable<SourcePosition['project']>
type PositionSource = Omit<SourcePosition, 'description' | 'skills' | 'project'> & {
  description: string[]
  skills: string[]
  project?: {
    title: SourceProject['title']
    url?: SourceProject['url']
    embedUrl?: string
    preview?: SourceProject['preview']
  }
}

export type Resume = Immutable<
  Omit<ResumeSource, 'experience'> & {
    experience: Omit<ResumeSource['experience'], 'positions'> & { positions: PositionSource[] }
  }
>

export type Position = Resume['experience']['positions'][number]

export type Tool = Resume['tools'][number]

export type ResumeSection = Resume['experience' | 'work' | 'about']['section']
