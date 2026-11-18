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
  const area = fixture.toolkit.areas.find(({ toolIds }) => toolIds.includes('extendscript'))
  const study = fixture.work.caseStudies[0]
  const emptyRole = fixture.experience.positions[0]
  const skilledRole = fixture.experience.positions[1]
  assert.ok(area && study && emptyRole && skilledRole)

  fixture.tools.typescript = {
    label: 'Example compiler',
    url: 'https://example.com/tools/compiler',
  }
  fixture.tools.react = { label: 'Example framework', url: 'https://example.com/tools/framework' }
  fixture.tools.extendscript = {
    label: 'Example ExtendScript',
    url: 'https://example.com/tools/extendscript',
  }
  fixture.toolkit.featuredToolIds = ['react', 'typescript']
  fixture.toolkit.areas = [area]
  area.toolIds = ['extendscript', 'typescript']
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
    area.summary,
    study.challenge,
    study.contribution,
    study.outcome,
    ...fixture.about.paragraphs,
    ...skilledRole.skills,
  ]) {
    assert.ok(markup.includes(text), text)
  }
  const toolLinks = [
    ...markup.matchAll(
      /<a\b[^>]*\bhref="(https:\/\/example\.com\/tools\/[^"]+)"[^>]*>([^<]+)<\/a>/gu,
    ),
  ].map(([, url, label]) => ({ label, url }))
  assert.deepEqual(toolLinks, [
    fixture.tools.react,
    fixture.tools.typescript,
    fixture.tools.extendscript,
    fixture.tools.typescript,
  ])
  const featured = markup.split(fixture.toolkit.label)[1]?.split(fixture.toolkit.note)[0]
  assert.ok(featured)
  assert.doesNotMatch(featured, /ExtendScript/u)
  assert.match(markup, /Example framework and Example compiler/u)
  assert.ok(markup.includes(`href="${study.url}"`))
  assert.ok(markup.includes(`href="#${skilledRole.id}"`))
  const emptyRoleMarkup = markup.split(`id="${emptyRole.id}"`)[1]?.split('</article>')[0]
  assert.ok(emptyRoleMarkup)
  assert.doesNotMatch(emptyRoleMarkup, /<details\b/u)
})

await test('rejects unknown tool IDs during prerendering', async () => {
  const fixture = structuredClone(resume)
  fixture.toolkit.featuredToolIds = ['missing-tool']
  await assert.rejects(
    prerender('<div id="root"><!--app-html--></div>', fixture),
    /Unknown toolkit tool ID: "missing-tool"/u,
  )
})
