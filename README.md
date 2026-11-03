# JavaScript Fieldwork

An independent, original learning studio built around the chapter structure of David Flanagan’s *JavaScript: The Definitive Guide*, seventh edition.

**[Open JavaScript Fieldwork](https://i5adovyi.github.io/javascript-fieldwork/)** to study without signing in. [Try the first lesson](https://i5adovyi.github.io/javascript-fieldwork/#/lesson/lesson-01), edit its example, and run it in your browser. The book is optional for these exercises.

Fieldwork turns reading a large reference book into a practical learning routine: read a mapped section, predict what code will do, run an experiment, investigate a failure, and build something you can explain. It combines a polished learning portal with exercises about the problems developers actually encounter: ambiguous inputs, mutation, failed requests, stale responses, lost saves, and incompatible releases.

The learner owns their source and study data. The same portal runs on a hosted Site or on localhost with a private SQLite database. Studying locally needs no OpenAI login, subscription, or API key. The learner supplies their own book; its contents are never bundled or published.

Source: [i5adovyi/javascript-fieldwork](https://github.com/i5adovyi/javascript-fieldwork) · [OpenAI-hosted studio](https://javascript-fieldwork-igor.igor-sadovyi87.chatgpt.site/)

## Start a new development session

Read [project context](docs/PROJECT-CONTEXT.md) for the purpose, decisions, architecture, and remaining extensions. [AGENTS.md](AGENTS.md) gives the shared development rules; [CLAUDE.md](CLAUDE.md) points Claude sessions to the same instructions. Then read [running and recovery](docs/RUNNING.md) before touching storage, and [the maintainer guide](docs/MAINTAINER-GUIDE.md) before changing content or behavior.

[Project history and postmortem](docs/PROJECT-HISTORY.md) records how this version evolved. [The closeout report](docs/PROJECT-CLOSEOUT.md) distinguishes final validation from earlier browser audits and explains when the project can be considered finished. These files carry project context across accounts and sessions; private learner records and previous chat transcripts do not belong in them.

## Start here

Requires Node.js 22.13 or newer (24 LTS recommended). The checked-in app runs without installing dependencies.

```sh
cd javascript-fieldwork
npm start
```

Open the printed URL (by default `http://localhost:4187`). If that port is occupied:

```sh
PORT=4197 npm start
```

You can also deploy `dist/` to any static HTTPS host. Hash-based routes require no server rewrite configuration. Do not open the HTML through `file://`: the data files and code runner need an HTTP origin.

## Choose where to run

Open **Run anywhere** in the portal for the current mode, launch links, and progress-transfer steps.

| Mode | Start | Requirements |
| --- | --- | --- |
| GitHub Pages | [Public studio](https://i5adovyi.github.io/javascript-fieldwork/) | Browser; progress stays on this device |
| OpenAI Sites | [Hosted studio](https://javascript-fieldwork-igor.igor-sadovyi87.chatgpt.site/) or `npm run open:hosted` | Browser and internet access |
| Localhost | `npm start` → `http://localhost:4187` | Node.js 22.13+; no OpenAI account or API key |
| Localhost + browser | `npm run start:open`, `Start Fieldwork.command` (Mac), or `Start Fieldwork.cmd` (Windows) | Same local requirements; keep the terminal open |

All modes use the same application. Local mode adds SQLite storage outside the repository for progress, notes, annotations, and drafts. Hosted mode uses browser storage. The PDF stays in browser IndexedDB in both modes. There is no automatic data sync: use **Data & backups** to transfer all saved records, or the existing progress/book-note exports.
Read [the setup and publishing guide](docs/RUNNING.md) for ports, backups, GitHub, and Sites updates.
GitHub stores source; pushing a commit does not automatically deploy the Site. To open the folder in Codex under another account and create that account’s own Site, follow [the new-account guide](docs/NEW-ACCOUNT.md). `npm run prepare:new-account` creates a clean, separate source export without the original Site identity.

## What is inside

- 36 original lessons across six stages, aligned to all 17 chapters.
- 72 retrieval questions with explained answers.
- 108 written practice assignments with acceptance criteria.
- 56 executable labs: the original 48 plus eight incident repairs, with progressive hints, solutions, and real assertions.
- 12 synthetic incident packets with supplied broken code, evidence, fixtures, and regression criteria.
- 35 wiki reference pages linked from lessons, each with an editable, runnable example.
- Six portfolio briefs with milestones, self-review checklists, and 100-point rubrics.
- Eight original articles and 25 curated external resources, including author-published free books, courses, documentation, and video talks.
- Six downloadable project starter kits, with explicit unfinished work.
- Personal notes, editable saved code, lesson progress, quiz responses, project checklists, and JSON backup import/export.
- A local book reader beside each lesson, with 97 mapped reading ranges, colored highlights, private book notes, and separate annotation backups.
- Offline application caching, keyboard shortcuts, mobile layouts, and print styles.

## Study workflow

1. Open **Overview → Start lesson 01**.
2. Select **Read beside lesson**, then **Choose PDF**, to read the assignment in your own copy alongside the lesson.
3. Study the original lesson, predict outcomes, and answer its retrieval questions.
4. Open **Practice lab**, implement a solution, and run the tests.
5. Complete the written prompts in your own editor, then mark the lesson complete.
6. Investigate the relevant **Incident workshop** cases after their listed lessons; record evidence and carry one failure rehearsal into the stage project. Finish the stage project and record your evidence in its build log.
7. Back up regularly from **Data & backups**. You can also export progress from **My notebook** and private book annotations separately from the reader. In local mode, check that writes have reached SQLite before closing the server.

Read [the curriculum review](docs/CURRICULUM-REVIEW.md) for existing coverage, the incident route, and remaining advanced extensions. Download case files and the workbook from **Incident workshop**. Investigation notes save locally and travel in the existing notebook backup.

Read [the learner handbook](docs/LEARNER-HANDBOOK.md) for 8-week and 16-week schedules, and [the curriculum map](docs/CURRICULUM-MAP.md) for chapter coverage.

## Choose your appearance

Use the **Color theme** selector in the landing page or workspace header: **System**, **Light**, or **Dark**. System follows your device’s preference; an explicit choice stays in this browser across reloads and updates other open tabs. Theme changes keep your current editor, reading position, and unsaved input in place. The preference is separate from study backups. The reader controls and notes follow the theme; PDF pages and example previews keep their original colors, and printed lessons keep the light palette.

## Read the book beside a lesson

On a lesson, select **Read beside lesson**, then **Choose PDF** and select your own local copy. The reader and lesson appear side by side on desktop and stack on a narrow mobile screen. Choose an assigned reading range to jump to its starting page, or navigate pages directly.

All 36 lessons have mapped assignments comprising 97 reading ranges. The mapping targets the supplied 1,245-page PDF of *JavaScript: The Definitive Guide*, seventh edition (2020). Page jumps use one-based physical PDF positions, not printed page numbers. Another edition or differently paginated PDF may need manual navigation; use the displayed section reference to find the right passage. Adjacent ranges can share a page when one section ends and the next begins on it.

Select text and choose a highlight color to mark a passage. Add a note to the current page or selected text, then edit or delete annotations as needed; use the reader’s undo control to reverse an annotation change. These private book annotations are separate from lesson reflections in **My notebook**.

Select **Remember PDF** to keep one private copy in this browser’s IndexedDB. It reopens after reload at your saved page, with highlights and notes. If you close the reader, it stays closed after reload; opening it again restores the remembered file without a file chooser. Selecting another PDF is session-only until you choose **Remember PDF**, which replaces the previous local copy.

**Forget PDF** removes the remembered copy without changing your original file or annotations. **Release PDF** frees the current session’s document but leaves the remembered copy available. Storage failures are reported explicitly; you can still read for the current session.

Use **Data & backups** for a combined text backup, including annotations, or the reader’s private book notes export/import controls for annotations alone. The older **My notebook** progress backup does not include book annotations. None of these backups includes the PDF. Browser data clearing, private browsing, or storage eviction can remove the remembered copy and hosted annotations; local annotations already committed to SQLite remain in the database. Keep your original PDF and exported notes. There is no account or cloud synchronization.

## Experiment in lessons and the wiki

All 38 code examples across the 36 lessons and all 35 wiki examples are editable. Open a lesson or a wiki topic and edit the example directly. Select **Run example** or press **⌘ / Ctrl + Enter** to see console output and errors. **Reset example** restores the original code. The expected result stays available in a separate disclosure so edited examples can produce different results.

Editors highlight JavaScript syntax, match and close brackets, and suggest local variables, keywords, snippets, and common JavaScript APIs. Suggestions appear as you type; use **Ctrl + Space** or **Suggest code** to open them, arrow keys to select, **Enter / Tab** to accept, and **Esc** to dismiss. Tab moves focus out of the editor when no suggestion is selected. **⌘ / Ctrl + Z** undoes edits. Module files keep separate undo histories while the page stays open. Suggestions do not execute your code or provide full type checking.

Drafts are saved automatically on this device, separately for each lesson example, wiki topic, and module file. They survive navigation and reloads. Lesson and wiki drafts are included in notebook backups; use **Copy code** to keep individual experiments elsewhere. If browser storage is unavailable, the editor reports that changes last only for the current session.

Most examples run in a fresh Web Worker. DOM and event examples use an isolated document with a visible, interactive preview; append elements to `document.body` to display them. The storage example uses a fresh in-memory implementation of the Storage methods each run, so it cannot change your studio progress. Module examples have separate file editors and load real ES modules; the runner supports local literal imports and reports unsupported circular imports.

Node filesystem, streams, and assertion topics provide explicitly labeled browser equivalents alongside their original Node code. The browser does not run Node or access filesystem paths. Runs have a three-second limit, console output is capped, and DOM loops receive deadline checks. These limits catch common mistakes, not every possible way to block a browser. Resetting, stopping, rerunning, or leaving the page disposes the old context.

Lesson snippets include editable sample inputs, dependencies, and calls where the original teaching excerpt was incomplete. Offline API doubles and browser equivalents are labeled; original excerpts remain available for adapted examples. Runs do not mark lessons or quizzes complete.

## Data and ownership

With `npm start`, learner records persist in a local SQLite database outside this repository. The browser keeps current and pending edits; the interface reports saves, connection failures, and revision conflicts. The database survives server restarts, source updates, and OpenAI account changes on the same operating-system user. The hosted copy uses browser storage for its own origin. **Data & backups** provides complete textual-data export/import, including reader annotations. Existing **My notebook** progress backups still work: they merge completed lessons and labs and replace matching notes, code, quiz answers, and project entries. Neither export includes the PDF. See [storage paths and recovery](docs/RUNNING.md).

The bundled PDF.js reader reads selected PDF bytes in memory and optionally remembers one private copy in IndexedDB on this device. It does not upload the PDF, put it in the application’s offline cache, or copy it into the repository. The book fingerprint, reading position, highlights, and notes are stored locally and mirror to SQLite in local mode. Private book annotations retain their own export/import workflow, separate from general progress backups; all-data backups include them too. The supplied copyrighted book is not redistributed. This project is not affiliated with O’Reilly or David Flanagan.

## Keep access when changing accounts

Use the desktop app’s local project/folder picker to open this source folder under the new account; with an installed Codex CLI, use `codex -C /absolute/path/to/javascript-fieldwork`. Read [the new-account workflow](docs/NEW-ACCOUNT.md) for setup and a ready-to-paste prompt. The public source can be cloned without signing in. The source carries your project forward, not the previous chat history.

Local SQLite data stays in your user application-data directory and survives OpenAI account changes. Browser profiles keep the PDF and pending edits separately. Before switching browsers, URLs, or devices, export your data and keep your original PDF. [The account-switch guide](docs/account-switch.md) covers the checklist.

To publish under a different account, commit source changes and run `npm run prepare:new-account`. Open the newly created sibling folder in that account and follow its `AGENTS.md` / `docs/NEW-ACCOUNT.md`. The export removes the original Site identity and hosted launch link without changing the working checkout. It does not create or publish a Site. The new account needs Sites access; create a new private Site there, persist its returned identity, and publish through the Sites skill. See the guide for configuring its new URL and keeping deployment identities separate.

The UI fonts and PDF.js runtime are bundled locally, with their open-source licenses. Reading does not require external font or viewer services. External library links open separately. Service-worker caching can make the core app available offline after a successful first load on a supported browser; linked websites and videos need their own connectivity. Offline behavior varies by browser, so keep the local server running for reliable study and database saves. The study pack, wiki reference, handbook, curriculum map, printable guide, and starter kits are included in the offline cache.

## Engineering

The deployable portal is static HTML, CSS, and JavaScript. The loopback-only local Node server adds a private SQLite API for local sessions; `npm run start:static` previews browser-only hosted behavior without opening that database. CodeMirror 6 and Lezer power the shared lesson/wiki editor, bundled locally in `dist/code-editor.js` with MIT notices in `dist/vendor/editor-LICENSES.txt`. To change the editor, run `npm ci`, edit `src/editor-entry.js` or `src/editor-completions.js`, then run `npm run editors:build`. The checked-in bundle is included in the offline cache; no editor CDN is used. Content lives in five JSON files in `dist/data/`. `dist/app.js` renders the hash routes. `dist/runner.js` runs each lab in a fresh Worker; the UI terminates a run after three seconds. Lesson and wiki examples share a runner in `dist/wiki-runner.js` and does not affect lab scoring. Acorn 8.19.0 is vendored in `dist/vendor/` under its MIT license to parse module imports and instrument DOM loops; no installation or external runtime CDN is needed. The local reader uses bundled PDF.js and its worker; `dist/book-map.js` contains section headings and physical-page ranges, without book prose or PDF bytes. Console output is capped. It is a learning aid, not a security boundary or a certification grader. Do not paste untrusted code. The tests and solutions are intentionally visible to the learner.

Lesson completion and project checklists are self-assessed. Lab completion means the supplied assertions passed, not a proof of correctness for all inputs. The original hosted Site is public and does not synchronize learner state; a new account's Site has its own audience setting.

## Validation

```sh
npm test
node tests/validate-runner.mjs
# Browser runner integration checks:
node tests/serve-wiki-qa.mjs
# Open /__incident-qa, /__playground-qa, /__lesson-qa, and /__editor-qa on that server.
# Select each page’s Run checks button (one suite at a time).
# Open http://127.0.0.1:4182/__lesson-qa and select Run lesson checks.
```

The content validator checks coverage, uniqueness, quiz structure, project rubric totals, and resource metadata. The lab validator executes all reference solutions, confirms incomplete starters fail, and applies a time limit. The runner validator executes the same browser-worker implementation against all reference solutions. Playground tests verify parsing, imports, and all 73 lesson and wiki editor definitions. The browser integration suite runs all 35 wiki examples in their actual execution contexts and checks async failures, cancellation, limits, storage isolation, module edits, and draft persistence. The lesson suite runs all 38 examples through the actual pages and checks independent editors, quiz rerenders, reloads, cancellation, module edits, and mobile layouts. Browser QA also covers navigation, running code, quizzes, local persistence, search, and responsive layouts.

## Files

- `dist/`: deployable application and downloadable materials.
- `docs/`: learning manuals and architecture/maintenance notes.
- `project-starters/`: six independent teaching scaffolds.
- `tests/`: content and runner verification.
- `scripts/serve.mjs`: local server with SQLite persistence; `--static` selects browser-only preview.
- `scripts/prepare-new-account.mjs`: committed-source export with account identity removed.
- `dist/site-config.js`: public hosted/source links; no credentials.
- `AGENTS.md`: instructions for the next Codex session, including account and private-data boundaries.
- `CLAUDE.md`: entry point to the same context and rules for Claude sessions.
- `docs/PROJECT-CONTEXT.md`: product intent, architectural decisions, and the continuation checklist.
- `docs/PROJECT-HISTORY.md` / `docs/PROJECT-CLOSEOUT.md`: historical record, postmortem, validation, and closure boundaries.
- `.openai/hosting.json`: Sites deployment configuration.

## Scope

This is a substantial personal training product, not a commercial learning-management backend. Payments, multi-user accounts, cloud synchronization, instructor grading, and certificates are not implemented. No fabricated customer testimonials, accreditation, or market valuation are claimed. Before selling it, validate learning outcomes with real learners, commission an accessibility/content review, choose your licensing and commercial terms, and implement any needed account, billing, and support operations.
