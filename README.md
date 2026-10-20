# JavaScript Fieldwork

An independent, original learning studio built around the chapter structure of David Flanagan’s *JavaScript: The Definitive Guide*, seventh edition.

## Start here

Requires Node.js 20 or newer. There are no dependencies to install.

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
- Local PDF reading, offline application caching, keyboard shortcuts, mobile layouts, and print styles.

## Study workflow

1. Open **Overview → Start lesson 01**.
2. Read the assignment in your own copy of the book using **Open your copy**.
3. Study the original lesson, predict outcomes, and answer its retrieval questions.
4. Open **Practice lab**, implement a solution, and run the tests.
5. Complete the written prompts in your own editor, then mark the lesson complete.
6. Finish the stage project and record your evidence in its build log.
7. Export a backup regularly from **My notebook**.

Read [the learner handbook](docs/LEARNER-HANDBOOK.md) for 8-week and 16-week schedules, and [the curriculum map](docs/CURRICULUM-MAP.md) for chapter coverage.

## Experiment in the wiki

Open **JavaScript wiki**, choose a topic, and edit its **Practical example**. Select **Run example** or press **⌘ / Ctrl + Enter** to see console output and errors. **Reset example** restores the original code. The expected result stays available in a separate disclosure so edited examples can produce different results.

Drafts are saved automatically on this device, separately for each topic and module file. They survive navigation and reloads. Wiki drafts are included in notebook backups; use **Copy code** to keep individual experiments elsewhere. If browser storage is unavailable, the editor reports that changes last only for the current session.

Most examples run in a fresh Web Worker. DOM and event examples use an isolated document with a visible, interactive preview; append elements to `document.body` to display them. The storage example uses a fresh in-memory implementation of the Storage methods each run, so it cannot change your studio progress. The module example has separate file editors and loads real ES modules; it supports local literal imports and reports unsupported circular imports.

Node filesystem, streams, and assertion topics provide explicitly labeled browser equivalents alongside their original Node code. The browser does not run Node or access filesystem paths. Runs have a three-second limit, console output is capped, and DOM loops receive deadline checks. These limits catch common mistakes, not every possible way to block a browser. Resetting, stopping, rerunning, or leaving the page disposes the old context.

## Data and ownership

Progress is localStorage on the current origin and browser, not an account-backed service. Localhost, hosted deployment, and another browser have separate progress; transfer it using Export backup / Import backup. Imports merge completed lessons and labs; matching notes, code, quiz answers, and project entries are replaced by the imported entries. Backup format is version 1.

PDFs are opened as local object URLs, never uploaded. Reselect the PDF after reloading. The supplied copyrighted book is neither copied into this repository nor redistributed. This project is not affiliated with O’Reilly or David Flanagan.

Google Fonts is the only external UI asset provider; fallback fonts preserve usability when offline. External library links open separately. Service-worker caching makes the core app available offline after a successful first load on a supported browser; linked websites, external fonts, and videos need their own connectivity. The study pack, wiki reference, handbook, curriculum map, printable guide, and starter kits are included in the offline cache.

## Engineering

The portal is buildless HTML, CSS, and JavaScript. Content lives in four JSON files in `dist/data/`. `dist/app.js` renders the hash routes. `dist/runner.js` runs each lab in a fresh Worker; the UI terminates a run after three seconds. The wiki uses its own runner in `dist/wiki-runner.js` and does not affect lab scoring. Acorn 8.19.0 is vendored in `dist/vendor/` under its MIT license to parse module imports and instrument DOM loops; no installation or external runtime CDN is needed. Console output is capped. It is a learning aid, not a security boundary or a certification grader. Do not paste untrusted code. The tests and solutions are intentionally visible to the learner.

Lesson completion and project checklists are self-assessed. Lab completion means the supplied assertions passed, not a proof of correctness for all inputs. The hosted Site is public and does not synchronize learner state.

## Validation

```sh
npm test
node tests/validate-runner.mjs
# Browser runner integration checks:
node tests/serve-wiki-qa.mjs
# Open http://127.0.0.1:4182/__playground-qa and select Run playground checks.
```

The content validator checks coverage, uniqueness, quiz structure, project rubric totals, and resource metadata. The lab validator executes all reference solutions, confirms incomplete starters fail, and applies a time limit. The runner validator executes the same browser-worker implementation against all reference solutions. Playground tests verify parsing, imports, and all 35 editor definitions. The browser integration suite runs all 35 examples in their actual execution contexts and checks async failures, cancellation, limits, storage isolation, module edits, and draft persistence. Browser QA also covers navigation, running code, quizzes, local persistence, search, and responsive layouts.

## Files

- `dist/`: deployable application and downloadable materials.
- `docs/`: learning manuals and architecture/maintenance notes.
- `project-starters/`: six independent teaching scaffolds.
- `tests/`: content and runner verification.
- `scripts/serve.mjs`: dependency-free local development server.
- `.openai/hosting.json`: Sites deployment configuration.

## Scope

This is a substantial personal training product, not a commercial learning-management backend. Payments, multi-user accounts, cloud synchronization, instructor grading, and certificates are not implemented. No fabricated customer testimonials, accreditation, or market valuation are claimed. Before selling it, validate learning outcomes with real learners, commission an accessibility/content review, choose your licensing and commercial terms, and implement any needed account, billing, and support operations.
