import source from '../content/resume.json' with { type: 'json' }
import { resumeSchema } from '../src/resume'

export const resume = resumeSchema.parse(source)
