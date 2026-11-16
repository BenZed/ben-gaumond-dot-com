import type source from '../content/resume.json'

export type Resume = typeof source
export type Position = Resume['experience'][number]
