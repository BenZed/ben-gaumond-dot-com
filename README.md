# Ben Gaumond

A resume website for bengaumond.com, built with React, Mantine, strict TypeScript, Vite, and Fastify.

## Development

Use Node.js 22.12 or newer and npm.

```sh
npm ci
npm run dev
```

Vite serves the UI at http://127.0.0.1:5173 and proxies `/api` to Fastify at http://127.0.0.1:3000. Both processes stop together. Ports are local by default; `HOST` and `PORT` configure the Fastify server. If changing the API development port, update the Vite proxy too.

## Checks and production

```sh
npm run check
npm run build
npm start
```

`check` runs TypeScript, type-aware Oxlint, Oxfmt verification, and API/content validation tests. `npm run fmt` formats source files.

The build emits a Vite client in `dist/client`, pre-renders the resume into its HTML, and compiles the Fastify server into `dist/server`. `npm start` serves the full site on port 3000. Deploy the full `dist` directory, `package.json`, and lockfile to a Node host with production dependencies installed. For containers, set `HOST=0.0.0.0`. Domain/DNS and hosting are not configured yet.

The static page remains readable before JavaScript loads. React hydrates it for interactive controls. The Print resume button uses the browser print dialog and a dedicated print stylesheet; choose Save as PDF for a PDF copy.

## Content

Edit `content/resume.json` first. It is the source of truth for the website and future LinkedIn updates. See `content/README.md` for provenance and unresolved content questions. The data is validated with a strict Zod schema during builds and server startup. After changing content, rebuild production so the API and HTML use the same snapshot.

- `basics.summary` and `basics.approach`: concise website copy derived from the imported biography.
- `experience[].highlights`: concise website bullets derived from the role descriptions.
- `experience[].description`: preserved source paragraphs, available in expandable role details.
- `GET /api/resume`: canonical resume JSON.
- `GET /api/health`: server health.

The initial project artwork is decorative typography and CSS, not a screenshot of the games. External project links came from the profile and may depend on third-party availability.

## Type safety

Both browser and server use `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`, `noImplicitOverride`, `noImplicitReturns`, unused-code checks, and unreachable-code checks. Oxlint rejects explicit `any`, non-null assertions, unsafe type flows, and unhandled/misused promises. Runtime JSON validation complements compile-time checks.

`workbench/` is local-only and ignored, including imported reference material. Do not publish or commit it.

`skipLibCheck` is enabled because Mantine’s dependency declarations conflict with `exactOptionalPropertyTypes`. Application code retains all strict checks; third-party `.d.ts` internals are excluded from declaration checking.
