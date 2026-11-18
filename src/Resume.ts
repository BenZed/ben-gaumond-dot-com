import type source from '../content/resume.json'

export type Resume = typeof source
export type Position = Resume['experience']['positions'][number]
export type ResumeSection = Resume['experience' | 'work' | 'about' | 'contact']['section']
