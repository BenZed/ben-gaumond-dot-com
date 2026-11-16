import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import fastifyStatic from '@fastify/static'
import Fastify from 'fastify'
import type { FastifyInstance, FastifyListenOptions, InjectOptions } from 'fastify'

import { appPlaceholder, renderResume } from './render-resume'
import { html, json, negotiate, resumeRepresentation } from './representations'
import { resume } from './resume'

export class Server {
  readonly #app: FastifyInstance

  constructor(options: { readonly staticRoot?: string; readonly logger?: boolean } = {}) {
    this.#app = Fastify({ logger: options.logger ?? false })
    const template =
      options.staticRoot && readFileSync(join(options.staticRoot, 'index.html'), 'utf8')
    if (template !== undefined && !template.includes(appPlaceholder)) {
      throw new Error('Missing resume HTML placeholder')
    }
    if (options.staticRoot) {
      this.#app.register(fastifyStatic, { root: options.staticRoot, index: false })
      this.#app.get('/index.html', (_request, reply) => reply.redirect('/', 308))
    }

    this.#app.get('/', (request, reply) => {
      reply.header('Vary', 'Accept')
      const representation = resumeRepresentation(request.headers.accept)
      if (representation === undefined) return reply.code(406).send()
      if (representation === json) return reply.type(json).send(resume)
      if (template === undefined) return reply.callNotFound()
      return reply.type(html).send(renderResume(template, resume))
    })

    this.#app.get('/health', (request, reply) => {
      reply.header('Vary', 'Accept')
      if (!negotiate(request.headers.accept, [json])) return reply.code(406).send()
      return reply.type(json).send({ status: 'ok' })
    })
  }

  get log() {
    return this.#app.log
  }

  listen(options: FastifyListenOptions) {
    return this.#app.listen(options)
  }

  close() {
    return this.#app.close()
  }

  inject(options: InjectOptions | string) {
    return this.#app.inject(options)
  }
}
