import source from '../content/resume.json' with { type: 'json' }
import { resumeSchema } from '../src/resumeSchema'

export const resume = resumeSchema.parse(source)
