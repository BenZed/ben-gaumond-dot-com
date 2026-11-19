import type source from '../content/resume.json'
import type { Immutable } from './types/Immutable'

type ResumeSource = typeof source

type PositionSource = ResumeSource['experience']['positions'][number] & { embedUrl?: string }

export type Resume = Immutable<
  Omit<ResumeSource, 'experience'> & {
    experience: Omit<ResumeSource['experience'], 'positions'> & { positions: PositionSource[] }
  }
>

export type Position = Resume['experience']['positions'][number]

export type Tool = Resume['tools'][number]

export type ResumeSection = Resume['experience' | 'work' | 'about']['section']
