import assert from 'node:assert/strict'
import { test } from 'node:test'

import resume from '../content/resume.json' with { type: 'json' }
import { prerender } from './prerender'

await test('the prerendered page includes resume HTML and matching hydration data', async () => {
  const template = '<!doctype html><div id="root"><!--app-html--></div>'
  const page = await prerender(template, resume)
  assert.match(page, /<main\b/u)
  assert.ok(page.includes(resume.basics.summary))

  const snapshot = /<script type="application\/json" id="resume-data">(.*?)<\/script>/u.exec(
    page,
  )?.[1]
  assert.ok(snapshot)
  const payload: unknown = JSON.parse(snapshot)
  assert.deepEqual(payload, resume)
})
