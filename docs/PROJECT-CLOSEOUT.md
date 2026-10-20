# JavaScript Fieldwork: release closeout

Date: 20 October 2026. Scope: the personal JavaScript learning portal, its hosted/local modes, private reader, durable local saves, account portability, and documentation for future sessions.

## Closure decision

The personal-study release is complete and can move from active construction to study and maintenance. The release audit passed. Optional advanced curriculum and commercial features are future work, not unfinished promises for this release.

Release marker: `v1.0.0`. Resolve its source commit with `git rev-parse 'v1.0.0^{commit}'`. The accompanying local release manifest records the exact commit and archive checksums; the manifest is outside the source archive so it can describe that archive without a circular checksum.

## Delivered

- A polished landing page and learning portal with 36 lessons, 56 labs, 35 wiki topics, 12 incident investigations, resources, articles, six projects, and downloadable materials.
- Runnable lesson/wiki examples, locally bundled editing support, saved drafts, notebook entries, quizzes, and progress.
- A private side-by-side reader with mapped pages, highlights/notes, exports, and opt-in remembered PDF storage.
- Hosted browser storage and an independent localhost mode with SQLite, pending-write recovery, revision conflicts, and explicit backup transfer.
- GitHub source, launchers, account-neutral source export, and guides for opening the project under another account and publishing a separate Site.
- Shared README, AGENTS, and CLAUDE entry points, product/architecture context, and a project history with postmortem.

## Evidence and its limits

| Evidence | What it establishes |
| --- | --- |
| `npm test` at closeout | Passed all 16 validation programs: content, labs/runner, wiki, state, content loading, playgrounds, lesson examples, book map/storage/release, incidents, launch, SQLite, recovery, and portability. Includes 56 reference lab solutions with 299 assertions, 18 annotation-storage checks, and 12 recovery scenarios. |
| `QA-REPORT.md` | Earlier interactive portal and incident audits, including navigation, examples, downloads, persistence, and narrow layouts. These are historical results, not a claim that every browser flow was rerun during this documentation handoff. |
| `PRIVATE-READER-QA.md` | Earlier actual-browser reader, annotation, remembered-file, and privacy checks, including the documented offline limitation. |
| Actual hosted-to-local handoff | Source/destination backups, preservation of existing local work, local PDF restoration, and unchanged committed records after restarting the local server. Evidence stays private outside Git. |
| Source/release audit | Working-tree state, remote commit, archive contents, documentation links, and private-file exclusions are checked during finalization. |

The automated suite uses temporary data. No real progress is fabricated or reset to produce a green test report.

## Source, deployment, and personal data

The GitHub repository is the canonical development source. The original hosted Site has a separate deployment lifecycle. This closeout changes repository documentation; it does not by itself publish a new Site version. A Git push and a Site deployment are separate outcomes.

Only project source, original learning materials, permitted vendor assets, and non-private validation records belong in Git or release packages. Personal PDFs, learner databases, migration backups, pending browser edits, and credentials deliberately remain outside them. “Everything saved” does not mean “every private file committed.”

The local database is in the operating-system user data directory documented in [RUNNING.md](RUNNING.md). The remembered PDF is in the learner's browser, and its original file remains separate. Keep private backups and the original book when changing computers or browser profiles.

Source exports and ZIPs are dated snapshots. Use their recorded commit/checksum or regenerate from committed source; do not assume an older sibling export contains later changes. The original account's Site identity must not replace another account's identity.

## Remaining limitations

- Windows/Linux launchers and the full browser/device matrix have not been manually certified. Offline restoration varies by browser; keep the local server running for reliable study and saves.
- Hosted and local data do not automatically synchronize. A new origin/profile has separate browser storage; all-data imports replace matching whole records.
- SQLite is local persistence, not encrypted storage or an off-device backup. Code runners are learning tools, not a general sandbox for hostile code.
- The mapped pages target one supplied seventh-edition PDF. Other PDFs may require manual navigation.
- Starter projects and lab starters intentionally contain exercises to complete. Self-assessed progress and supplied tests are not accreditation or exhaustive correctness proofs.
- External resources may change after verification. Another account's Sites availability depends on that account.
- Payments, multi-user access, cloud synchronization, instructor grading, certificates, and native desktop installers are outside this release. Advanced systems exercises remain listed in the curriculum review.

## Closeout checklist

- [x] Product vision, implementation map, storage decisions, and continuation instructions written.
- [x] README, AGENTS, and CLAUDE entry points aligned; older browser-only persistence wording corrected.
- [x] Historical milestones, postmortem, limitations, and optional future work recorded.
- [x] Full `npm test` passed on the final application code.
- [x] Documentation local-link targets and Git whitespace/integrity checks passed.
- [x] Tracked file paths, tracked ZIPs, existing release archives, credential patterns, and the three tracked screenshots inspected; no private-data inclusion found by these checks.
- [x] The learner's existing migration evidence and backups located; a read-only SQLite integrity check passed and the original PDF remained available.
- [x] Source prepared for the final Git commit and `v1.0.0` release marker; deployment runtime files are unchanged from `4fd68f1`.

The final handoff also supplies a Git history bundle, a source ZIP, and a fresh account-neutral source folder. Its local manifest records artifact hashes and remote verification. These source artifacts exclude learner records and the PDF. Personal-data backups are stored separately and are never included in the source bundle.

The check above is a targeted release/privacy audit, not a guarantee from an independent security review. There is no remaining known blocker to the delivered personal-study workflow.

After handoff, use [PROJECT-CONTEXT.md](PROJECT-CONTEXT.md) and [AGENTS.md](../AGENTS.md) to resume development. Keep the existing learning data and Site identity intact. New capabilities can be handled as new work without reopening this milestone's scope.
