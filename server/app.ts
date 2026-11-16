import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { resume } from '../src/resume.js';

export function buildApp(
  options: { readonly staticRoot?: string; readonly logger?: boolean } = {},
) {
  const app = Fastify({ logger: options.logger ?? false });
  app.get('/api/health', () => ({ status: 'ok' }));
  app.get('/api/resume', () => resume);
  if (options.staticRoot) {
    app.register(fastifyStatic, { root: options.staticRoot, index: ['index.html'] });
  }
  return app;
}
