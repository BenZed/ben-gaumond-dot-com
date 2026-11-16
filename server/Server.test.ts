import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

import type { InjectOptions } from 'fastify'

import { resumeSchema } from '../src/resumeSchema'
import { resume } from './resume'
import { Server } from './Server'

class TestServer extends Server {
  inject(options: InjectOptions | string) {
    return this.app.inject(options)
  }
}

await test('the resume negotiates JSON and unknown routes return 404', async () => {
  const app = new TestServer({})
  try {
    const response = await app.inject({ url: '/', headers: { accept: 'application/json' } })
    assert.equal(response.statusCode, 200)
    assert.match(response.headers['content-type'] ?? '', /^application\/json\b/u)
    assert.equal(response.headers.vary, 'Accept')
    const payload: unknown = response.json()
    assert.equal(resumeSchema.parse(payload).basics.name, 'Ben Gaumond')
    assert.equal((await app.inject({ url: '/', headers: { accept: 'image/png' } })).statusCode, 406)
    assert.equal((await app.inject('/missing')).statusCode, 404)
    for (const url of ['/api', '/api/resume', '/api/health']) {
      assert.equal(
        (await app.inject({ url, headers: { accept: 'application/json' } })).statusCode,
        404,
      )
    }
    assert.equal((await app.inject('/workbench/linkedin-import.json')).statusCode, 404)
    const health = await app.inject('/health')
    assert.equal(health.statusCode, 200)
    assert.deepEqual(health.json<unknown>(), { status: 'ok' })
  } finally {
    await app.close()
  }
})

await test('the same URL selects rendered HTML or JSON by Accept preference', async () => {
  const staticRoot = await mkdtemp(join(tmpdir(), 'resume-site-'))
  await writeFile(
    join(staticRoot, 'index.html'),
    '<!doctype html><div id="root"><!--app-html--></div>',
  )
  const app = new TestServer({ staticRoot })
  try {
    for (const accept of [undefined, '*/*', 'text/*', 'text/html, application/json;q=0.8']) {
      const headers = accept === undefined ? {} : { accept }
      const response = await app.inject({ url: '/', headers })
      assert.equal(response.statusCode, 200)
      assert.match(response.headers['content-type'] ?? '', /^text\/html\b/u)
      assert.equal(response.headers.vary, 'Accept')
      assert.match(response.body, /<main\b/u)
      assert.ok(response.body.includes(resume.basics.summary))
      const snapshot = /<script type="application\/json" id="resume-data">(.*?)<\/script>/u.exec(
        response.body,
      )?.[1]
      assert.ok(snapshot)
      const payload: unknown = JSON.parse(snapshot)
      assert.deepEqual(payload, resume)
    }

    for (const accept of ['text/html;q=0.4, application/json;q=0.8', 'text/html;q=0, */*;q=0.8']) {
      const response = await app.inject({ url: '/', headers: { accept } })
      assert.equal(response.statusCode, 200)
      assert.match(response.headers['content-type'] ?? '', /^application\/json\b/u)
      assert.equal(response.headers.vary, 'Accept')
    }

    const head = await app.inject({
      method: 'HEAD',
      url: '/',
      headers: { accept: 'application/json' },
    })
    assert.equal(head.statusCode, 200)
    assert.match(head.headers['content-type'] ?? '', /^application\/json\b/u)
    assert.equal(head.body, '')

    const index = await app.inject('/index.html')
    assert.equal(index.statusCode, 308)
    assert.equal(index.headers.location, '/')
  } finally {
    await app.close()
    await rm(staticRoot, { recursive: true, force: true })
  }
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
