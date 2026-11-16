import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { buildApp } from './app.js';

const port = z.coerce
  .number()
  .int()
  .min(1)
  .max(65535)
  .parse(process.env['PORT'] ?? 3000);
const production = import.meta.url.includes('/dist/server/');
const app = buildApp({
  logger: true,
  ...(production ? { staticRoot: fileURLToPath(new URL('../../client/', import.meta.url)) } : {}),
});
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    app.close().catch((error: unknown) => {
      app.log.error(error);
      process.exitCode = 1;
    });
  });
}
try {
  await app.listen({ port, host: process.env['HOST'] ?? '127.0.0.1' });
} catch (error: unknown) {
  app.log.error(error);
  process.exitCode = 1;
}
