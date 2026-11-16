import { readFile, writeFile } from 'node:fs/promises'

import source from '../content/resume.json' with { type: 'json' }
import { resumeSchema } from '../src/resumeSchema'
import { renderResume } from './renderResume'

const resume = resumeSchema.parse(source)
const output = new URL('../dist/index.html', import.meta.url)
const template = await readFile(output, 'utf8')
await writeFile(output, renderResume(template, resume))
