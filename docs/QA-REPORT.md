# Portal verification — 20 October 2026

## Result

The learning flows passed the checks below after repairs. Interactive checks used the Codex in-app browser. Progress-changing tests ran on isolated localhost origins, leaving the learner's hosted progress intact.

## Coverage

| Area | Verification |
| --- | --- |
| Lessons | Opened all 36; selected all 72 correct quiz answers; expanded all 108 practice panels; saved notes and completion, then reloaded every lesson. |
| Labs | Ran all 48 reference solutions through the real editor and worker. Reran the 10 corrected labs. All 231 assertions also pass the automated solution and actual runner suites. Checked runaway-code termination and keyboard rerun recovery. |
| Wiki | Opened all 35 topics. All 35 editable examples execute with their documented output. Browser playground suite: 50 passing checks, including errors, cancellation, infinite loops, modules, isolated storage, and draft restoration. Original browser examples: 31/31 pass. |
| Articles and projects | Opened all 8 articles and 6 project briefs. Checked and restored all 57 project acceptance criteria and all 6 build logs. Every project rubric totals 100. |
| Persistence | Exported, imported on a separate origin, and re-exported an identical backup: 36 lessons, 48 labs, 72 quiz answers, 43 notes, 57 project criteria, the last lesson, and a wiki draft. Unicode and literal HTML text survive. |
| Failure handling | Automated regressions cover corrupt storage, malformed and oversized backups, invalid IDs and types, prototype keys, unavailable storage, rollback failures, and retrying the same file. |
| Downloads | Browser downloads of handbook, starter ZIP, wiki Markdown, and study-pack ZIP succeed. ZIP contents match source bytes. The printable guide opens separately and contains 36 lessons and 72 answer panels. |
| Reference links | All 25 curated resources verified; all 4 YouTube IDs resolve through official oEmbed. O'Reilly rejects raw automated requests but its book page resolves through web retrieval. Rendered 140 portal/wiki views and checked 1,682 internal links and file targets. |
| Search and filters | Six lab filters each show 8 labs; empty search and clearing work. Wiki aliases, empty-state reset, global search, and all library resource filters work. |
| PDF reading | Selected the user's local PDF and verified the reader uses a local blob URL at the requested PDF page 761. No book content is uploaded. |
| Mobile | Main navigation, wiki, path, lesson, labs, lab editor, projects, project brief, library, article, notebook, and dashboard fit a 390px embedded viewport without page overflow. Playground suite also checks its editor at 375px. |
| Offline | Stopped the local server and reloaded the dashboard successfully. Navigated to the wiki and ran an example, then ran a saved lab solution successfully. Restored the server afterward. |

## Repairs

- Corrected edge cases or clarified contracts in labs 03, 11, 14, 16, 18, 21, 28, 31, 36, and 47: numeric precision, ASCII tokenization, empty keys, unsubscribe behavior, supported object domains, sparse arrays, strict dates, and configuration values.
- Removed an ambiguous lesson 03 quiz question and corrected three wiki explanations.
- Backups now include wiki drafts and restore the last lesson. Failed persistence no longer reports successful import; state is rolled back when possible. The file input resets so a failed file can be retried.
- Note fields show whether saving succeeded. Lesson and lab completion preserve storage-error warnings.
- Shipped the curriculum map referenced by the handbook.
- Replaced the unreliable direct HTML download with a reproducible study ZIP and a separate printable-guide link. Both archives and all manuals are included in the offline cache.

## Reproduce

Run `npm test` for the automated content, lab, runner, wiki, persistence, loader, and playground checks. Run `node tests/serve-wiki-qa.mjs`, then open `/__wiki-qa` and `/__playground-qa` on the printed local origin for the browser suites.

The six project starter kits intentionally contain unfinished exercises: 6 implemented checks pass and 18 tests are marked TODO. Lab starters are also intentionally unfinished. Completion checklists are self-assessment; lab assertions cover their stated cases rather than every possible program.

This audit does not claim a full browser/device matrix. Progress remains local to each browser and origin; use notebook backups when moving devices. External courses and videos require connectivity.
