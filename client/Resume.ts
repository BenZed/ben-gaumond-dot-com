import type source from '../content/resume.json'

type ResumeSource = typeof source

export type Position = ResumeSource['experience']['positions'][number] & { embedUrl?: string }
export type Resume = Omit<ResumeSource, 'experience'> & {
  experience: Omit<ResumeSource['experience'], 'positions'> & { positions: Position[] }
}
export type Tool = Resume['tools'][number]
export type ResumeSection = Resume['experience' | 'work' | 'about']['section']
