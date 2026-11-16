import assert from 'node:assert/strict'
import { test } from 'node:test'

import source from '../content/resume.json' with { type: 'json' }
import { resumeSchema } from '../src/resumeSchema'
import { renderResume } from './renderResume'

const resume = resumeSchema.parse(source)

await test('the prerendered page includes resume HTML and matching hydration data', () => {
  const template = '<!doctype html><div id="root"><!--app-html--></div>'
  const page = renderResume(template, resume)
  assert.match(page, /<main\b/u)
  assert.ok(page.includes(resume.basics.summary))

  const snapshot = /<script type="application\/json" id="resume-data">(.*?)<\/script>/u.exec(
    page,
  )?.[1]
  assert.ok(snapshot)
  const payload: unknown = JSON.parse(snapshot)
  assert.deepEqual(payload, resume)
})

await test('invalid resume dates and duplicate positions fail validation', () => {
  assert.equal(
    resumeSchema.safeParse({ ...resume, experience: [...resume.experience, ...resume.experience] })
      .success,
    false,
  )
  assert.equal(
    resumeSchema.safeParse({
      ...resume,
      experience: resume.experience.map((role) => ({ ...role, end: '2000-01' })),
    }).success,
    false,
  )
})
