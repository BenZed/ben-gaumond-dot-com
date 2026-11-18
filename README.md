# Ben Gaumond

A resume website for bengaumond.com, built with React, Mantine, strict TypeScript, and Vite.

## Development

Use Node.js 22.12 or newer and npm.

```sh
npm ci
npm run dev
```

Use http://127.0.0.1:5173 during development. Vite serves the app with hot reload and loads the resume from `content/resume.json`. Use extensionless imports for local TypeScript modules.

## Checks and production

```sh
npm run check
npm run build
npm run preview
```

`check` verifies types, lint, and formatting, then runs `npm test`. The Vitest suite covers prerendering and PDF export. `npm run fmt` formats source files and sorts imports while preserving side-effect import order.

The build writes the static site to `dist`. It prerenders `content/resume.json` into `dist/index.html`. The page is readable before JavaScript loads. React hydrates it using the resume data embedded during the build.

## Resume PDF

Install headless Chromium once after `npm ci`, or again when Playwright is upgraded.

```sh
npx playwright install chromium --only-shell
npm run resume:pdf
npm run preview
```

The export rebuilds the site from `content/resume.json` and uses its print layout to write a US Letter PDF to `dist/ben-gaumond-resume.pdf`. Open the preview and select **Download resume** to test the link locally. A regular `npm run build` recreates `dist` without the PDF.

Use `--output` (or `-o`) to choose a different file. Relative paths are resolved from the project directory. The export creates parent directories as needed.

```sh
npm run resume:pdf -- --output 'workbench/resume for review.pdf'
```

Build scripts can import `generateResumePDF({ output })` from `scripts/generateResumePDF.ts` once the site is built. It returns the absolute path to the generated PDF.

## GitHub Pages

In the GitHub repository, open **Settings → Pages** and select **GitHub Actions** as the publishing source. The deployment workflow runs `npm run resume:pdf` and publishes `dist` on pushes to `main`. You can also run it from the Actions tab. Relative asset paths support the repository subpath and a custom domain. Set up the custom domain in Pages settings when DNS is ready.

## Content

Edit `content/resume.json` first. It is the source of truth for the website and future LinkedIn updates. See `content/README.md` for provenance and unresolved content questions.

- `basics.summary` and `about.approach` are concise website copy derived from the imported biography.
- `experience.positions[].highlights` contains concise website bullets derived from the role descriptions.
- `experience.positions[].description` preserves source paragraphs for expandable role details.
- `tools` lists entries with a stable `id`, `label`, and `url`. `toolkit.featuredToolIds` orders the compact list and the About footnote. Each `toolkit.areas[].toolIds` orders the links in its group.
- `work.caseStudies` links projects to experience entries by position ID. Add an `outcome` or a public `url` when available.
- Each `section` field defines its anchor ID and heading. Navigable sections also define their navigation label.

The initial project artwork is decorative typography and CSS, not a screenshot of the games. External project links came from the profile and may depend on third-party availability.

## Source filenames

Match a source file’s name and casing to its primary export. For example, `useActiveSection.ts` exports `useActiveSection`. Name colocated tests after the module they cover, as in `prerender.test.ts`.

Keep conventional names for entry points, config files, declaration files, and modules without a clear primary export.

## Type safety

Browser and build code use `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`, `noImplicitOverride`, `noImplicitReturns`, unused-code checks, and unreachable-code checks. Oxlint rejects explicit `any`, non-null and redundant type assertions, unsafe type flows, non-exhaustive switches, and unhandled or misused promises. It also flags duplicate imports and unused lint suppressions. TypeScript derives the resume types from `content/resume.json`.

`workbench/` is local-only and ignored, including imported reference material. Do not publish or commit it.

`skipLibCheck` is enabled because Mantine’s dependency declarations conflict with `exactOptionalPropertyTypes`. Application code retains all strict checks; third-party `.d.ts` internals are excluded from declaration checking.

## UI organization

Define props in a named `<ComponentName>Props` type. Export the type for public components and keep it local for private components. Components without props need no props type.

`src/App.tsx` composes the page and its providers. Put page sections that compose `Section` in `src/sections/` and custom hooks in `src/hooks/`. Put UI pieces with a distinct responsibility in `src/components/`, such as the shared `Section` primitive and `ProjectCard`. `src/theme.ts` owns Mantine defaults and shared color tokens. Keep local styles in the component’s `.module.css` file and use Mantine’s `classNames` slots when styling component parts. `src/styles.css` contains document-wide styles.

Prefer Mantine components and hooks, including polymorphic semantic elements. Native details/summary semantics are intentionally preserved through `Box` for disclosure behavior without JavaScript. Keep career content in `content/resume.json` rather than in component files.

Each page section composes `Section` and one `Section.Header`. `Section` owns the semantic region, stable ID, heading ID, and heading level; the header consumes that context for its title, eyebrow, and optional aside. Keep layout-specific content in the composing section. The hero uses heading level 1, and subsequent sections default to level 2. The top navigation stays visible during scrolling and displays the active section on the left. URL synchronization during manual scrolling and scene animations remain future work.
