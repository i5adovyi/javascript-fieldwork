# JavaScript Fieldwork: history and postmortem

Recorded on 20 October 2026 from the repository history, recorded QA, and the project handoff. Commit subjects from the original Sites workflow are mostly “Update Site source”; this document supplies the missing narrative. It is not a transcript or a record of private learner data.

## How the project developed

| Stage | Evidence | Result |
| --- | --- | --- |
| Initial learning studio | `d976d0a` | Landing page and portal, six-stage curriculum, labs, wiki, resources, projects, downloadable materials, and browser saves. |
| Loading failure repair | `3f3b201` | Explicit content loading and service-worker handling after an HTML response was encountered where JSON was expected. |
| Portal audit and runnable wiki | `d6826f0`, `1889942`; `QA-REPORT.md` | Exercise contracts, quiz wording, imports, note-save feedback, downloads, navigation, and wiki examples were checked and repaired. |
| Interactive lesson examples and editor | `afb28e0`, `d4ea3a3` | Editable lesson examples and locally bundled CodeMirror completion, syntax highlighting, and execution controls. |
| Private companion reader | `0645610`; `PRIVATE-READER-QA.md` | Side-by-side reading, 97 page ranges, private highlights/notes, annotation export/import, and locally bundled PDF.js/fonts. |
| Remembered PDF and account continuity | `621f741` | Opt-in IndexedDB storage, restoration after reload, independent local launch, and account-switch guidance. |
| Real-world incident practice | `e6f70dd`; `CURRICULUM-REVIEW.md` | Twelve supplied investigations and eight repair labs brought the lab total to 56 with 299 reference assertions. |
| Explicit hosted/local launch modes | `b11bcda` | Run-anywhere UI, launchers, hosted links, and documented local operation and GitHub workflow. |
| Durable local storage and account export | `4fd68f1` | SQLite, pending-write recovery, revision conflicts, all-data backups, new-account source export, and shared agent instructions. |
| Personal data handoff | Private migration evidence, excluded from Git | Available hosted records were transferred while destination-only work was preserved. The original PDF was remembered locally and database records survived an actual server restart. |
| Final documentation and release handoff | The commit containing this document; `PROJECT-CLOSEOUT.md` | Product intent, architecture, Codex/Claude entry points, current storage rules, historical evidence, limitations, and a closure decision. |

## Postmortem

### Hosting and account assumptions were initially unclear

The learner wanted a durable personal project, while a hosted Site introduced an account, URL, access policy, and hosting lifecycle. A login page also made it unclear whether authentication was part of the application.

The final design makes local operation explicit and separates source ownership, local learning data, and a hosted Site's identity. There is no application login or OpenAI API requirement for local study. A new account can use the source immediately; publishing its own Site is a separate action with that account's access.

Future work should describe the default run mode and where data lives before introducing hosting. Do not promise that copying a repository transfers a Site or browser data.

### Beautiful teaching material still needed execution and verification

The first portal had substantial content, but realistic usage exposed edge cases in lab contracts, ambiguous explanations, and weaker feedback around failures. Reading a code block was not enough for the desired learning loop.

The portal audit repaired specific exercises and added runnable examples, preserved drafts, clearer errors, and repeatable validation. The incident workshop then supplied broken programs and evidence to investigate, rather than requiring every learner to invent a clean example.

The lesson is to validate learner actions and failure paths, not just content volume or page appearance. Teaching tests should capture a meaningful contract and regression, and clearly state what remains unproved.

### Storage needed to be treated as part of the product

Browser storage is tied to an origin and profile. It does not automatically move with a Git clone, OpenAI account, or new hosted address. Selecting a local PDF for one session also does not imply it will reopen after reload.

The final design adds explicit remembered-file consent, all-data exports, a local SQLite store, durable pending edits, revision checks, and visible save/recovery states. Migration backs up both copies and preserves destination-only data. An empty export is reported honestly instead of inventing missing work.

Future changes must retain these distinctions. In particular, whole-record imports can erase nested destination work unless the transfer is prepared carefully, and a running SQLite file must be backed up with its write-ahead-log state handled correctly.

### Book access and publication had to remain separate

The learner owns a local reference book, but the portal is intended to be portable and potentially shared. Adding the book to the deployment would collapse those boundaries.

The reader processes the learner's file locally and stores an optional private browser copy. The published course contains original explanations and exercises plus section/page references. PDF bytes, annotations, and private backups remain outside Git and release assets.

This is a design constraint for future features, not a reason to remove useful local reading support.

### Historical evidence became fragmented

Generic commit subjects and feature-specific QA reports made it harder for a new session to understand which checks were historical, which storage mode they exercised, and what had changed since then. Some older guide wording still described browser-only persistence.

The final handoff adds shared context, a chronological record, a closeout report, and aligned Codex/Claude instructions. Historical browser results remain labeled as historical; fresh release checks and the real migration/restart check are identified separately.

Use descriptive commit subjects for future changes. Update the appropriate context or validation record when behavior changes, and keep private operational evidence outside the repository.

## Lessons for the next iteration

- Prefer a smaller, verified learning experience over unsupported claims of completeness or commercial value.
- Test actual imports, reloads, failed writes, races, and recovery, not just successful rendering.
- Keep generated downloads and account-neutral exports reproducible; an old ZIP or sibling folder is a snapshot.
- Use the same instructions for different coding agents instead of maintaining divergent project stories.
- Close the personal-study milestone when its promised behavior works. Treat new commercial or advanced curriculum features as new scope.

See [the closeout report](PROJECT-CLOSEOUT.md) for the final release evidence and explicit closure boundary.
