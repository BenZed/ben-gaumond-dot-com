import { fileURLToPath } from 'node:url'

import { z } from 'zod'

import { Server } from './app'

const port = z.coerce
  .number()
  .int()
  .min(1)
  .max(65535)
  .parse(process.env['PORT'] ?? 3000)
const production = import.meta.url.includes('/dist/server/')
const server = new Server({
  logger: true,
  ...(production ? { staticRoot: fileURLToPath(new URL('../client/', import.meta.url)) } : {}),
})
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    server.close().catch((error: unknown) => {
      server.log.error(error)
      process.exitCode = 1
    })
  })
}
try {
  await server.listen({ port, host: process.env['HOST'] ?? '127.0.0.1' })
} catch (error: unknown) {
  server.log.error(error)
  process.exitCode = 1
}
