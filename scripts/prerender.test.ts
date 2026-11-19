import { assert, expect, test } from 'vitest'

import resume from '../content/resume.json' with { type: 'json' }
import type { Resume } from '../src/Resume'
import { prerender } from './prerender'

test('the prerendered page includes resume HTML and matching hydration data', () => {
  const template = '<!doctype html><div id="root"><!--app-html--></div>'
  const page = prerender(template, resume)
  expect(page).toMatch(/<main\b/u)
  expect(page).toContain(resume.basics.summary)
  const header = /<header\b[\s\S]*?<\/header>/u.exec(page)?.[0]
  assert.ok(header)
  expect(header).toMatch(
    /<a\b(?=[^>]*\bhref="\.\/ben-gaumond-resume\.pdf")(?=[^>]*\bdownload="")(?=[^>]*\baria-label="Download resume")[^>]*>/u,
  )
  const linkedinLink = header.match(/<a\b[^>]*\baria-label="LinkedIn"[^>]*>/u)?.[0]
  expect(linkedinLink).toContain(`href="${resume.basics.linkedinUrl}"`)
  expect(page).toContain(`href="${resume.basics.linkedinUrl}">${resume.basics.linkedinUrl}</a>`)
  expect(header).not.toContain('href="#contact"')
  expect(page).not.toContain('<section id="contact"')
  expect(resume.toolkit.featuredToolIds).not.toContain('extendscript')
  expect(
    resume.toolkit.areas.find(({ label }) => label === 'Animation and production tooling')?.toolIds,
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

test('renders toolkit areas, case studies, biography paragraphs and role skills', () => {
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
  const page = prerender(template, fixture)
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
test('offers an inline player for an embeddable project without loading the iframe', () => {
  const fixture: Resume = structuredClone(resume)
  const project = fixture.experience.positions.find(({ id }) => id === 'pbs-scribbles-ink-s1')
  assert.ok(project?.url)
  project.embedUrl = 'https://example.com/embed/in-and-out'

  const page = prerender('<div id="root"><!--app-html--></div>', fixture)
  const [markup = ''] = page.split('<script type="application/json"')
  expect(markup).toContain('Play inline')
  expect(markup).toContain(`href="${project.url}"`)
  expect(markup).not.toContain('<iframe')
  expect(markup).not.toContain(project.embedUrl)
})

test.each(['featured', 'grouped'] as const)(
  'rejects unknown %s tool IDs during prerendering',
  (list) => {
    const fixture = structuredClone(resume)
    const area = fixture.toolkit.areas[0]
    assert.ok(area)
    const ids = list === 'featured' ? fixture.toolkit.featuredToolIds : area.toolIds
    ids.push('missing-tool')

    expect(() => prerender('<div id="root"><!--app-html--></div>', fixture)).toThrow(
      /Unknown toolkit tool ID: "missing-tool"/u,
    )
  },
)
