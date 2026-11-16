# Ben Gaumond

A resume website for bengaumond.com, built with React, Mantine, strict TypeScript, Vite, and Fastify.

## Development

Use Node.js 22.12 or newer and npm.

```sh
npm ci
npm run dev
```

Use http://127.0.0.1:5173 during development. Vite serves the HTML shell with hot reload, and the browser fetches the resume from `/` with `Accept: application/json`. Vite forwards that request and requests for `/health` to Fastify at http://127.0.0.1:3000. Both processes stop together. `HOST` configures the Fastify bind address, and `PORT` configures both the Fastify port and Vite's proxy target port.

## Checks and production

```sh
npm run check
npm run build
npm start
```

`check` runs TypeScript, type-aware Oxlint, Oxfmt verification, and server and content validation tests. `npm run fmt` formats source files and sorts imports while preserving side-effect import order.

Vite builds the browser assets and HTML shell in `dist/client` and bundles the server in `dist/server`. Use extensionless imports for local TypeScript modules. `npm start` serves the full site on port 3000. Deploy the full `dist` directory, `package.json`, and lockfile to a Node host with production dependencies installed. For containers, set `HOST=0.0.0.0`. Domain/DNS and hosting are not configured yet.

Fastify renders the resume on each HTML request so it reads before JavaScript loads. React hydrates from the resume data included in that response. The Print resume button uses the browser print dialog and a dedicated print stylesheet. Choose Save as PDF for a PDF copy.

## Content

Edit `content/resume.json` first. It is the source of truth for the website and future LinkedIn updates. See `content/README.md` for provenance and unresolved content questions. The build includes the source in the server bundle, and Fastify validates it at startup. Both HTTP representations use that validated data.

- `basics.summary` and `basics.approach`: concise website copy derived from the imported biography.
- `experience[].highlights`: concise website bullets derived from the role descriptions.
- `experience[].description`: preserved source paragraphs, available in expandable role details.

The initial project artwork is decorative typography and CSS, not a screenshot of the games. External project links came from the profile and may depend on third-party availability.

## Server conventions

Each resource has one canonical URL. Use the HTTP `Accept` header to select among the representations at that URL. Routes that negotiate send `Vary: Accept` and return `406 Not Acceptable` when the client accepts none of the available representations. For requests without a preference, use the resource's default representation.

`GET /` defaults to HTML and also offers `application/json`. `GET /health` serves a JSON health status.

```sh
curl -H 'Accept: application/json' http://127.0.0.1:3000/
```

## Source filenames

Match a source file’s name and casing to its primary export. For example, `Server.ts` exports `Server`, and `useActiveSection.ts` exports `useActiveSection`. Name colocated tests after the module they cover, such as `Server.test.ts`.

## Type safety

Both browser and server use `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`, `noImplicitOverride`, `noImplicitReturns`, unused-code checks, and unreachable-code checks. Oxlint rejects explicit `any`, non-null and redundant type assertions, unsafe type flows, non-exhaustive switches, and unhandled or misused promises. It also flags duplicate imports and unused lint suppressions. Runtime JSON validation complements compile-time checks.

`workbench/` is local-only and ignored, including imported reference material. Do not publish or commit it.

`skipLibCheck` is enabled because Mantine’s dependency declarations conflict with `exactOptionalPropertyTypes`. Application code retains all strict checks; third-party `.d.ts` internals are excluded from declaration checking.

## UI organization

`src/App.tsx` composes page sections and providers. `src/components/` contains the header/footer, resume sections, experience entries, shared Tabler icon wrapper, and appearance control. `src/theme.ts` owns Mantine theme configuration; `src/styles.css` owns the visual palette and editorial layout.

Prefer Mantine components and hooks, including polymorphic semantic elements. Native details/summary semantics are intentionally preserved through `Box` for disclosure behavior without JavaScript. Keep career content in `content/resume.json` rather than in component files.

Each page section composes `Section` and one `Section.Header`. `Section` owns the semantic region, stable ID, heading ID, and heading level; the header consumes that context for its title, eyebrow, and optional aside. Keep layout-specific content in the composing section. The hero uses heading level 1, and subsequent sections default to level 2. The top navigation stays visible during scrolling and displays the active section on the left. URL synchronization during manual scrolling and scene animations remain future work.
