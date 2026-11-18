import assert from 'node:assert/strict'
import { test } from 'node:test'

import resume from '../content/resume.json' with { type: 'json' }
import { prerender } from './prerender'

await test('the prerendered page includes resume HTML and matching hydration data', async () => {
  const template = '<!doctype html><div id="root"><!--app-html--></div>'
  const page = await prerender(template, resume)
  assert.match(page, /<main\b/u)
  assert.ok(page.includes(resume.basics.summary))
  assert.match(page, /<a\b(?=[^>]*\bhref="\.\/resume\.pdf")(?=[^>]*\bdownload="")[^>]*>/u)

  const snapshot = /<script type="application\/json" id="resume-data">(.*?)<\/script>/u.exec(
    page,
  )?.[1]
  assert.ok(snapshot)
  const payload: unknown = JSON.parse(snapshot)
  assert.deepEqual(payload, resume)
})

await test('renders toolkit areas, case studies, biography paragraphs and role skills', async () => {
  const fixture = structuredClone(resume)
  const area = fixture.toolkit.areas[0]
  const study = fixture.work.caseStudies[0]
  const emptyRole = fixture.experience.positions[0]
  const skilledRole = fixture.experience.positions[1]
  assert.ok(area && study && emptyRole && skilledRole)

  area.tools = ['Example toolkit entry']
  area.summary = 'Example toolkit summary'
  study.positionIds = [skilledRole.id]
  study.challenge = 'Example project challenge'
  study.contribution = 'Example project contribution'
  study.outcome = 'Example project outcome'
  study.url = 'https://example.com/project'
  fixture.about.paragraphs = ['Example first paragraph', 'Example second paragraph']
  skilledRole.skills = ['Example role skill']
  emptyRole.description = []
  emptyRole.skills = []
  delete emptyRole.url

  const template = '<div id="root"><!--app-html--></div>'
  const page = await prerender(template, fixture)
  const [markup = ''] = page.split('<script type="application/json"')
  for (const text of [
    fixture.basics.pronouns,
    ...area.tools,
    area.summary,
    study.challenge,
    study.contribution,
    study.outcome,
    ...fixture.about.paragraphs,
    ...skilledRole.skills,
  ]) {
    assert.ok(markup.includes(text), text)
  }
  assert.ok(markup.includes(`href="${study.url}"`))
  assert.ok(markup.includes(`href="#${skilledRole.id}"`))
  const emptyRoleMarkup = markup.split(`id="${emptyRole.id}"`)[1]?.split('</article>')[0]
  assert.ok(emptyRoleMarkup)
  assert.doesNotMatch(emptyRoleMarkup, /<details\b/u)
})
