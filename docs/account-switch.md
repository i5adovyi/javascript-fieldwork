# Keep Fieldwork when changing accounts

You can open this project in Codex under another OpenAI account and continue editing it. You can also study locally without any OpenAI account. A new hosted Site must be created under the new account; copying source does not transfer the old Site's ownership.

The complete workflow, commands, and ready-to-paste Codex prompts are in [Open Fieldwork in another account](NEW-ACCOUNT.md). Storage and recovery instructions are in [Run online or locally](RUNNING.md).

## Before switching

1. Keep the source folder or clone the private [GitHub repository](https://github.com/i5adovyi/javascript-fieldwork) using an authorized GitHub account.
2. Export progress from **My notebook → Export backup** and private annotations from **Your book notes → Export notes** in the reader.
3. Keep your original PDF separately. The source, database, and JSON exports do not include it.
4. If using local SQLite, finish pending writes, stop Fieldwork, and back up its application-data directory. Keep it outside Git and the published folder.

## Continue locally

Use Node.js 22.13 or newer; Node.js 24 LTS is recommended. Open the source folder in Codex using its local folder/project picker, or use `codex -C /absolute/path/to/javascript-fieldwork` if the CLI is installed. No previous chat history is needed: `AGENTS.md` and the repository documentation give the new session its project instructions.

Run `npm run start:open`, or open **Start Fieldwork.command** on Mac / **Start Fieldwork.cmd** on Windows. Keep Terminal open and visit `http://localhost:4187`. No package installation is needed for the bundled application.

Local SQLite saves live outside the project and persist across sessions and OpenAI account changes on the same computer and operating-system user. Another browser can read saved database records through the local server, but its remembered PDF and pending browser edits remain separate. Keep the original local URL when possible. See the setup guide for exact database paths, backup, and `FIELDWORK_DATA_DIR`.

## Create a new hosted copy

Commit source changes, then run `npm run prepare:new-account`. Open the resulting new sibling folder under the new account and follow `docs/NEW-ACCOUNT.md`. The export removes the old Site identity and hosted launch link without modifying the original checkout. It contains committed source only, not your private learner data.

Use Sites tools available to the new account to create and publish a **new private Site**. The account must have Sites access. The export command does not create that Site, grant account access, or publish automatically. Keep its eventual project ID in the new copy; do not replace the original checkout's ID.

The original public portal may remain available at <https://javascript-fieldwork-igor.igor-sadovyi87.chatgpt.site/>, subject to its original owner and hosting service. You do not need that URL for local learning.

## Move learning data to a new URL or device

The hosted app uses browser saves for each URL and browser profile. An OpenAI account switch may use a different profile; it does not migrate those saves. Import the progress and book-note JSON backups at the destination, choose your original PDF there, and select **Remember PDF** once. Check a completed lesson, an edited example, and a book note.

Neither backup includes the book. Browser clearing, private browsing, and storage eviction can remove hosted saves or the remembered PDF. The local database provides durable local records once writes finish, but it still needs a private backup against device loss. Hosted and local copies do not automatically synchronize.

## Maintainer map

- `AGENTS.md`: account identity, publication, private data, and testing rules.
- `dist/`: deployable static app and learning downloads.
- `dist/site-config.js`: public launch links; no credentials.
- `dist/data/`: curriculum, labs, wiki, library, and incidents.
- `dist/app.js`: routes, progress, and import/export boundaries.
- `dist/book-reader.js`, `book-storage.js`, `book-file-storage.js`: private reader, annotations, and remembered PDF.
- `dist/book-map.js`: chapter references and physical PDF ranges without book prose.
- `scripts/`: local server, database support, account export, and materials generation.
- `src/`: editor source; use `npm ci && npm run editors:build` when rebuilding it.
- `tests/`: content, runner, persistence, privacy, launch, and portability checks.

Run `npm test` after changes and `npm run materials` after editing manuals. Private-reader browser checks are in `docs/PRIVATE-READER-QA.md`.
