# JavaScript Fieldwork

An independent, original learning studio built around the chapter structure of David Flanagan’s *JavaScript: The Definitive Guide*, seventh edition.

## Start here

Requires Node.js 20 or newer. The checked-in app runs without installing dependencies.

```sh
cd javascript-fieldwork
npm start
```

Open the printed URL (by default `http://localhost:4173`). If that port is occupied:

```sh
PORT=4187 npm start
```

You can also deploy `dist/` to any static HTTPS host. Hash-based routes require no server rewrite configuration. Do not open the HTML through `file://`: the data files and code runner need an HTTP origin.

## What is inside

- 36 original lessons across six stages, aligned to all 17 chapters.
- 72 retrieval questions with explained answers.
- 108 written practice assignments with acceptance criteria.
- 48 executable labs with progressive hints, solutions, and real assertions.
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
6. Finish the stage project and record your evidence in its build log.
7. Export progress regularly from **My notebook**, and export private book annotations separately from the reader.

Read [the learner handbook](docs/LEARNER-HANDBOOK.md) for 8-week and 16-week schedules, and [the curriculum map](docs/CURRICULUM-MAP.md) for chapter coverage.

## Read the book beside a lesson

On a lesson, select **Read beside lesson**, then **Choose PDF** and select your own local copy. The reader and lesson appear side by side on desktop and stack on a narrow mobile screen. Choose an assigned reading range to jump to its starting page, or navigate pages directly.

All 36 lessons have mapped assignments comprising 97 reading ranges. The mapping targets the supplied 1,245-page PDF of *JavaScript: The Definitive Guide*, seventh edition (2020). Page jumps use one-based physical PDF positions, not printed page numbers. Another edition or differently paginated PDF may need manual navigation; use the displayed section reference to find the right passage. Adjacent ranges can share a page when one section ends and the next begins on it.

Select text and choose a highlight color to mark a passage. Add a note to the current page or selected text, then edit or delete annotations as needed; use the reader’s undo control to reverse an annotation change. These private book annotations are separate from lesson reflections in **My notebook**.

Reselect the PDF after a reload. Its fingerprint identifies the matching copy and restores its last page, highlights, and notes from this browser. Use the reader’s private book notes export/import controls to keep or transfer annotations; the general progress backup does not include them. Neither backup includes the PDF. Clearing browser data loses unexported annotations, and there is no account or cloud synchronization.

## Experiment in lessons and the wiki

All 38 code examples across the 36 lessons and all 35 wiki examples are editable. Open a lesson or a wiki topic and edit the example directly. Select **Run example** or press **⌘ / Ctrl + Enter** to see console output and errors. **Reset example** restores the original code. The expected result stays available in a separate disclosure so edited examples can produce different results.

Editors highlight JavaScript syntax, match and close brackets, and suggest local variables, keywords, snippets, and common JavaScript APIs. Suggestions appear as you type; use **Ctrl + Space** or **Suggest code** to open them, arrow keys to select, **Enter / Tab** to accept, and **Esc** to dismiss. Tab moves focus out of the editor when no suggestion is selected. **⌘ / Ctrl + Z** undoes edits. Module files keep separate undo histories while the page stays open. Suggestions do not execute your code or provide full type checking.

Drafts are saved automatically on this device, separately for each lesson example, wiki topic, and module file. They survive navigation and reloads. Lesson and wiki drafts are included in notebook backups; use **Copy code** to keep individual experiments elsewhere. If browser storage is unavailable, the editor reports that changes last only for the current session.

Most examples run in a fresh Web Worker. DOM and event examples use an isolated document with a visible, interactive preview; append elements to `document.body` to display them. The storage example uses a fresh in-memory implementation of the Storage methods each run, so it cannot change your studio progress. Module examples have separate file editors and loads real ES modules; it supports local literal imports and reports unsupported circular imports.

Node filesystem, streams, and assertion topics provide explicitly labeled browser equivalents alongside their original Node code. The browser does not run Node or access filesystem paths. Runs have a three-second limit, console output is capped, and DOM loops receive deadline checks. These limits catch common mistakes, not every possible way to block a browser. Resetting, stopping, rerunning, or leaving the page disposes the old context.

Lesson snippets include editable sample inputs, dependencies, and calls where the original teaching excerpt was incomplete. Offline API doubles and browser equivalents are labeled; original excerpts remain available for adapted examples. Runs do not mark lessons or quizzes complete.

## Data and ownership

Progress is localStorage on the current origin and browser, not an account-backed service. Localhost, hosted deployment, and another browser have separate progress; transfer it using Export backup / Import backup. Imports merge completed lessons and labs; matching notes, code, quiz answers, and project entries are replaced by the imported entries. Backup format is version 1.

The bundled PDF.js reader reads selected PDF bytes in memory. It does not upload them, put them in the offline cache, or copy the book into the repository. The book fingerprint, reading position, highlights, and notes are stored locally. Reselect the matching PDF after reloading to resume. Private book annotations have their own export/import workflow, separate from general progress backups. The supplied copyrighted book is not redistributed. This project is not affiliated with O’Reilly or David Flanagan.

The UI fonts and PDF.js runtime are bundled locally, with their open-source licenses. Reading does not require external font or viewer services. External library links open separately. Service-worker caching makes the core app available offline after a successful first load on a supported browser; linked websites, external fonts, and videos need their own connectivity. The study pack, wiki reference, handbook, curriculum map, printable guide, and starter kits are included in the offline cache.

## Engineering

The portal is static HTML, CSS, and JavaScript. CodeMirror 6 and Lezer power the shared lesson/wiki editor, bundled locally in `dist/code-editor.js` with MIT notices in `dist/vendor/editor-LICENSES.txt`. To change the editor, run `npm ci`, edit `src/editor-entry.js` or `src/editor-completions.js`, then run `npm run editors:build`. The checked-in bundle is included in the offline cache; no editor CDN is used. Content lives in four JSON files in `dist/data/`. `dist/app.js` renders the hash routes. `dist/runner.js` runs each lab in a fresh Worker; the UI terminates a run after three seconds. Lesson and wiki examples share a runner in `dist/wiki-runner.js` and does not affect lab scoring. Acorn 8.19.0 is vendored in `dist/vendor/` under its MIT license to parse module imports and instrument DOM loops; no installation or external runtime CDN is needed. The local reader uses bundled PDF.js and its worker; `dist/book-map.js` contains section headings and physical-page ranges, without book prose or PDF bytes. Console output is capped. It is a learning aid, not a security boundary or a certification grader. Do not paste untrusted code. The tests and solutions are intentionally visible to the learner.

Lesson completion and project checklists are self-assessed. Lab completion means the supplied assertions passed, not a proof of correctness for all inputs. The hosted Site is public and does not synchronize learner state.

## Validation

```sh
npm test
node tests/validate-runner.mjs
# Browser runner integration checks:
node tests/serve-wiki-qa.mjs
# Open /__playground-qa, /__lesson-qa, and /__editor-qa on that server.
# Select each page’s Run checks button (one suite at a time).
# Open http://127.0.0.1:4182/__lesson-qa and select Run lesson checks.
```

The content validator checks coverage, uniqueness, quiz structure, project rubric totals, and resource metadata. The lab validator executes all reference solutions, confirms incomplete starters fail, and applies a time limit. The runner validator executes the same browser-worker implementation against all reference solutions. Playground tests verify parsing, imports, and all 73 lesson and wiki editor definitions. The browser integration suite runs all 35 wiki examples in their actual execution contexts and checks async failures, cancellation, limits, storage isolation, module edits, and draft persistence. The lesson suite runs all 38 examples through the actual pages and checks independent editors, quiz rerenders, reloads, cancellation, module edits, and mobile layouts. Browser QA also covers navigation, running code, quizzes, local persistence, search, and responsive layouts.

## Files

- `dist/`: deployable application and downloadable materials.
- `docs/`: learning manuals and architecture/maintenance notes.
- `project-starters/`: six independent teaching scaffolds.
- `tests/`: content and runner verification.
- `scripts/serve.mjs`: dependency-free local development server.
- `.openai/hosting.json`: Sites deployment configuration.

## Scope

This is a substantial personal training product, not a commercial learning-management backend. Payments, multi-user accounts, cloud synchronization, instructor grading, and certificates are not implemented. No fabricated customer testimonials, accreditation, or market valuation are claimed. Before selling it, validate learning outcomes with real learners, commission an accessibility/content review, choose your licensing and commercial terms, and implement any needed account, billing, and support operations.
