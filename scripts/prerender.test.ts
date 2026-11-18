import { assert, expect, test } from 'vitest'

import resume from '../content/resume.json' with { type: 'json' }
import { prerender } from './prerender'

test('the prerendered page includes resume HTML and matching hydration data', async () => {
  const template = '<!doctype html><div id="root"><!--app-html--></div>'
  const page = await prerender(template, resume)
  expect(page).toMatch(/<main\b/u)
  expect(page).toContain(resume.basics.summary)
  expect(page).toMatch(/<a\b(?=[^>]*\bhref="\.\/resume\.pdf")(?=[^>]*\bdownload="")[^>]*>/u)
  expect(resume.toolkit.featuredToolIds).not.toContain('extendscript')
  expect(
    resume.toolkit.areas.find(({ toolIds }) => toolIds.includes('after-effects'))?.toolIds,
  ).toContain('extendscript')
  const extendScript = resume.tools.find(({ id }) => id === 'extendscript')
  assert.ok(extendScript)
  const extendScriptLink = `href="${extendScript.url}">${extendScript.label}</a>`
  expect(page.split(extendScriptLink)).toHaveLength(2)

  const snapshot = /<script type="application\/json" id="resume-data">(.*?)<\/script>/u.exec(
    page,
  )?.[1]
  assert.ok(snapshot)
  const payload: unknown = JSON.parse(snapshot)
  expect(payload).toEqual(resume)
})

test('renders toolkit areas, case studies, biography paragraphs and role skills', async () => {
  const fixture = structuredClone(resume)
  const area = fixture.toolkit.areas.find(({ toolIds }) => toolIds.includes('extendscript'))
  const study = fixture.work.caseStudies[0]
  const emptyRole = fixture.experience.positions[0]
  const skilledRole = fixture.experience.positions[1]
  assert.ok(area && study && emptyRole && skilledRole)

  const compiler = {
    label: 'Example compiler',
    url: 'https://example.com/tools/compiler',
  }
  const framework = { label: 'Example framework', url: 'https://example.com/tools/framework' }
  const extendScript = {
    label: 'Example ExtendScript',
    url: 'https://example.com/tools/extendscript',
  }
  fixture.tools = [
    { id: 'typescript', ...compiler },
    { id: 'react', ...framework },
    { id: 'extendscript', ...extendScript },
  ]
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
    expect(markup).toContain(text)
  }
  const toolLinks = [
    ...markup.matchAll(
      /<a\b[^>]*\bhref="(https:\/\/example\.com\/tools\/[^"]+)"[^>]*>([^<]+)<\/a>/gu,
    ),
  ].map(([, url, label]) => ({ label, url }))
  expect(toolLinks).toEqual([framework, compiler, extendScript, compiler])
  const featured = markup.split(fixture.toolkit.label)[1]?.split(fixture.toolkit.note)[0]
  assert.ok(featured)
  expect(featured).not.toMatch(/ExtendScript/u)
  const aboutMarkup = markup.split(`id="${fixture.about.section.id}"`)[1]?.split('</section>')[0]
  assert.ok(aboutMarkup)
  expect(aboutMarkup.replaceAll('<!-- -->', '')).toContain(
    `Example framework and Example compiler · ${fixture.basics.location}`,
  )
  expect(aboutMarkup).not.toContain('Example ExtendScript')
  expect(markup).toContain(`href="${study.url}"`)
  expect(markup).toContain(`href="#${skilledRole.id}"`)
  const emptyRoleMarkup = markup.split(`id="${emptyRole.id}"`)[1]?.split('</article>')[0]
  assert.ok(emptyRoleMarkup)
  expect(emptyRoleMarkup).not.toMatch(/<details\b/u)
})

test.each(['featured', 'grouped'] as const)(
  'rejects unknown %s tool IDs during prerendering',
  async (list) => {
    const fixture = structuredClone(resume)
    const area = fixture.toolkit.areas[0]
    assert.ok(area)
    const ids = list === 'featured' ? fixture.toolkit.featuredToolIds : area.toolIds
    ids.push('missing-tool')

    await expect(prerender('<div id="root"><!--app-html--></div>', fixture)).rejects.toThrow(
      /Unknown toolkit tool ID: "missing-tool"/u,
    )
  },
)
