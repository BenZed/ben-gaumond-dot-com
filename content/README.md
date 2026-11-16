# Resume content

`resume.json` is the project's canonical career data. The website and future LinkedIn update drafts should derive from this file. Edit career facts here first.

The initial content was imported from the rendered LinkedIn profile. Descriptions retain the source wording, including grammar, with paragraph boundaries restored and UI controls removed. It has not yet been editorially revised. This file is outside the ignored workbench and intended for version control; the workspace is initialized as a Git repository.

## Data conventions

- Each position has a stable `id`; retain it when editing titles or descriptions.
- Dates use `YYYY-MM`; `end: null` means current. Do not store calculated durations.
- `description` contains ordered paragraphs. `skills` currently contains only the visible preview skills, not exhaustive role requirements or proficiency ratings.
- Preserve concurrent positions. Do not combine PBS and Global Mechanic without confirming their relationship.
- Missing fields mean uncollected information, not a verified absence.
- Public project links are included where observed. A repository label alone is not a verified destination URL.

## Reconciliation and editing

The ignored `workbench/linkedin-import.json` preserves the initial extracted content and limitations. The older `workbench/resume-source.json` is a preliminary paraphrased import, not the source of truth.

When the LinkedIn archive arrives, compare it with the import snapshot and propose missing fields or corrections to `resume.json`. Do not overwrite edits already made here. Future LinkedIn updates should be prepared from this canonical file and reviewed before application.

Content still needing attention:

- Expand the eDynamic Learning description beyond “Simulations development.”
- Verify the About section's “10 years” claim before publishing it as a current total.
- Clarify PBS engagement relationships and the S1 title/body discrepancy (Lead Developer versus Developer).
- Reconcile remaining skills and any education or other sections against the export.

The first website version adds `basics.summary`, `basics.approach`, and per-role `highlights` as editable presentation copy. The original descriptions remain available separately. No additional employment facts were introduced.
