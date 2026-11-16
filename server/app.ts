import fastifyStatic from '@fastify/static'
import Fastify from 'fastify'

import { resume } from '../src/resume'

export function buildApp(
  options: { readonly staticRoot?: string; readonly logger?: boolean } = {},
) {
  const app = Fastify({ logger: options.logger ?? false })
  app.get('/api/health', () => ({ status: 'ok' }))
  app.get('/api/resume', () => resume)
  if (options.staticRoot) {
    app.register(fastifyStatic, { root: options.staticRoot, index: ['index.html'] })
  }
  return app
}
