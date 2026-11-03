# JavaScript Fieldwork: project context

Context baseline: 20 October 2026. Check current source, Git state, and the running application before treating a historical verification as current.

The [public studio](https://i5adovyi.github.io/javascript-fieldwork/) serves the tracked `dist/` files through GitHub Pages. Learners can run examples in the browser or clone the repository to keep progress in local SQLite. OpenAI Sites has its own deployment and access settings.

## The idea

The project began as a request for a substantial, beautifully presented JavaScript training studio based on David Flanagan's *JavaScript: The Definitive Guide*, seventh edition. Its intended value comes from the quality of the learning experience: original explanations, useful practice, real feedback, reference material, and projects worth finishing.

The learner also asked for the difficult situations that introductory courses often simplify away: unclear requirements, bad input, coercion surprises, identity loss, shared mutable state, asynchronous races, failed persistence, and deployment problems. The incident workshop extends the curriculum with supplied broken implementations and evidence-driven repairs.

The core learning loop is **read → predict → implement → run → inspect → explain → revisit**. Completion checkboxes are a convenience. Understanding means explaining the cause, handling a variation, and showing evidence that a fix preserves valid behavior.

The original ambition was a premium learning product. This release is a working personal study portal and an extensible foundation, not a priced or accredited commercial LMS. Do not invent testimonials, sales, certifications, or a dollar valuation.

## Delivered baseline

The portal contains 36 lessons in six stages, 72 retrieval questions, 108 written assignments, 56 executable labs, 12 incident packets, 35 wiki topics, eight original articles, 25 external resources, and six portfolio projects with starter kits. The lesson and wiki editors offer 73 runnable examples in total.

The private reader has 97 mapped reading ranges, page jumps, highlights, notes, annotation backups, and opt-in remembered PDF storage. Page numbers are one-based physical positions in the supplied 1,245-page PDF; another edition may differ.

Progress, quiz answers, project checklists, notebook entries, incident notes, and code drafts persist. Local mode uses SQLite plus a durable browser outbox and conflict handling. Hosted mode uses browser storage. All-data export/import moves textual records between copies.

## Decisions to preserve

| Decision | Reason and consequence |
| --- | --- |
| One static portal, two storage modes | `dist/` works on Sites or a static host; the local Node server adds SQLite without requiring a cloud backend. |
| Localhost is a full study option | A learner can keep using the app across OpenAI accounts and without an AI subscription. The local app makes no AI API calls. |
| A local browser app, not a packaged native binary | Launchers start Node and open the browser. The server must stay running for reliable local database saves. |
| Source, data, and Site identity are separate | A Git clone carries code and context. It does not carry private learning records, the book, browser state, or ownership of a Site. |
| The learner supplies the book | Original lesson prose and section/page references are published; PDF bytes and private annotations are not. |
| Stable content IDs | Saved progress references IDs. Renaming an ID requires an explicit migration, not just a wording change. |
| Honest saving and execution feedback | Pending writes, failed storage, and conflicts must remain visible. Passing supplied lab assertions is not a guarantee for every input. |
| Original failure investigations | Fixtures, contracts, hypotheses, regressions, and recovery matter more than adding superficial course volume. |
| Explicit backup transfer | Hosted and local copies do not synchronize automatically. An account switch does not merge their records. |
| A separate Site for another account | Export committed source with neutral hosting configuration, then publish through that account's supported tools. |

## Where to work

Most frontend source is maintained directly in `dist/`. It is not all disposable build output.

| Area | Files |
| --- | --- |
| Main routes, lessons, notebook, projects, lab UI | `dist/app.js`, `dist/styles.css`, `dist/index.html` |
| Course and resource content | `dist/data/{curriculum,labs,wiki,library,incidents}.json` |
| Wiki and editable examples | `dist/wiki.js`, `dist/wiki-playground.js`, `dist/lesson-playgrounds.js` |
| CodeMirror source and bundle | `src/editor-entry.js`, `src/editor-completions.js` → `dist/code-editor.js` |
| Code execution | `dist/runner.js`, `dist/wiki-runner.js`, `dist/wiki-worker.js`, `dist/wiki-execution.js` |
| PDF UI, mapping, annotations, remembered Blob | `dist/book-reader.js`, `dist/book-map.js`, `dist/book-storage.js`, `dist/book-file-storage.js` |
| Shared persistence and recovery UI | `dist/study-storage.js`, `dist/data-settings.js` |
| Loopback HTTP server and SQLite | `scripts/serve.mjs`, `scripts/local-database.mjs` |
| Browser appearance preference and dark palette | `dist/theme.js`, `dist/theme.css` (loaded before/after the main styles respectively) |
| Offline assets and content loading | `dist/sw.js`, `dist/content-loader.js` |
| Launch links and account export | `dist/site-config.js`, `scripts/open-hosted.mjs`, `scripts/prepare-new-account.mjs` |
| Download generation | `scripts/build-guide.mjs`, `scripts/build-incidents.mjs`, `scripts/build-study-pack.mjs`, `scripts/export-wiki.mjs` |
| Agent and human handoff | Root README/AGENTS/CLAUDE files and this `docs/` directory |

`npm start` serves `http://localhost:4187` by default. Node.js 22.13+ is required; the existing bundled app runs without installing dependencies. Dependencies are needed when rebuilding the editor. `npm run start:static` intentionally uses browser-only storage.

## Persistence model and migration pitfalls

Local SQLite lives in the operating-system user data directory, outside the repository. On macOS the default is `~/Library/Application Support/JavaScript Fieldwork/fieldwork.sqlite`. See [all platform paths and recovery](RUNNING.md). `FIELDWORK_DATA_DIR` chooses a different database; it does not migrate the previous one.

The storage adapter handles these versioned records:

- `fieldwork.progress.v1`: completions, notebook/lesson/incident/project state, lab drafts, quiz answers, last lesson, and study preferences.
- `fieldwork.wiki-code.v1`: lesson and wiki example drafts.
- `fieldwork.book-reader-open.v1`: reader open/closed preference.
- `fieldwork.book-notes.v1.<SHA-256>`: the matching PDF's reading position and annotations.

Pending writes are journaled in browser storage and sent with revisions. Preserve the journal, recovery copies, validation, and conflict controls. A stale browser window must not silently overwrite newer database work.

**All-data import replaces matching whole records.** It preserves other keys, but it does not merge two progress objects field by field. Back up both sides and retain destination-only work before a transfer. The notebook's older import has different merge behavior; do not describe the two as interchangeable.

PDF bytes remain in browser IndexedDB after **Remember PDF**, not in SQLite or JSON backups. The original PDF must be kept separately. The same filename does not establish the same PDF: annotations are associated with a content fingerprint. Browser profiles and origins have separate remembered files; `localhost` and `127.0.0.1` are different origins.

An actual hosted-to-local transfer and local server restart were checked during handoff. The record-level evidence and personal backups belong in private storage, not this repository. Recheck the current database before future migration work; do not replay an old import from historical context.

## Appearance update · 27 October 2026

The landing page and workspace provide System, Light, and Dark themes. `theme.js` restores `fieldwork.theme.v1` before styles render, follows system changes when selected, and updates other tabs. This is a browser appearance preference, separate from the study-storage adapter and its backups. Switching themes changes attributes and styles without rerendering the lesson or editor. Reader chrome and notes use the dark palette; PDF pixels, code preview documents, and printed pages retain their original colors.

## What remains optional

The personal study release can be finished without adding payments, accounts, cloud sync, a native desktop package, instructor grading, or certificates. A different account's Site can only be created when that account has access to the required publication tools.

Advanced curriculum extensions remain proposals: distributed idempotency, full daylight-saving policies, a bounded NDJSON parser, crash-safe filesystem recovery, multi-version migrations, and real deployment rollback. Their required evidence is described in [the curriculum review](CURRICULUM-REVIEW.md). Do not report them as already implemented or turn them into automatic scope expansion.

Offline access and launcher behavior vary by environment. Keep the local server running for reliable study. Full Windows/Linux and browser/device certification, independent accessibility review, and commercial readiness review are outside the verified scope.

## Continue in a new session

1. Read the root README and AGENTS instructions, this context, and the closeout report. Inspect current Git status and the actual repository root.
2. Identify whether the request concerns course content, application behavior, private data, or hosting; use the corresponding files and guide.
3. Preserve the user's active data and any unrelated source changes. Use temporary databases and separate browser origins for tests.
4. Make the authorized change. Keep original learning material, stable IDs, reader privacy, and both run modes working.
5. Run relevant checks and `npm test` before a commit or publication. Use actual browser verification when changing interactive behavior.
6. Record significant new decisions and limitations. Report local changes, Git commits/pushes, and Site publication as separate outcomes.
