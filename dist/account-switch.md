# Keep Fieldwork when changing accounts

Your learning app is a self-contained website. It needs no OpenAI account, API key, subscription, database service, or package installation to run locally. Node.js 20.11 or newer is the only local runtime requirement. The bundled lessons, labs, wiki, reader, editors, fonts, and download materials are included.

## Before switching

1. Keep the `javascript-fieldwork` folder and the complete source ZIP somewhere you control. The study-pack ZIP contains learning documents, not the entire application.
2. In the public portal, open **My notebook → Export backup** to save progress, notes, lab code, quiz answers, project checklists, and lesson/wiki drafts.
3. Open your PDF in the private reader, expand **Your book notes**, and choose **Export notes**. This saves reading position and annotations separately from progress.
4. Keep your original book PDF separately. Neither ZIP nor either JSON backup includes it. Never put private exports or your book into a published folder.

## Continue learning

Bookmark the existing public portal:

https://javascript-fieldwork-igor.igor-sadovyi87.chatgpt.site/

It is configured for public access, without a learner login. Hosted availability still depends on the original Site and its hosting service; use the local copy if that URL becomes unavailable.

On this Mac, open **Start Fieldwork.command** inside the project folder. Keep its Terminal window open and visit the printed address, normally `http://localhost:4173`. Alternatively, run `npm start` from the project directory. No `npm install` is needed to use the checked-in app. Keep the same hostname and port for future sessions so your browser can find its stored data. Do not open `dist/index.html` directly with `file://`.

At a new URL, browser profile, device, or account’s in-app browser:

1. Open **My notebook → Import backup** and select your progress JSON. Export any existing destination work first.
2. Choose your original PDF in the reader and import the private book-notes JSON.
3. Select **Remember PDF** once. The browser stores a private local copy and reopens it after reload. **Forget PDF** removes only that copy.
4. Check a completed lesson, an edited example, and a book note before relying on the destination.

The app does not key data by OpenAI account. Switching accounts does not itself migrate browser storage, and the desktop app may separate or clear browser profiles. Export before switching even if you expect to use the same computer. Clearing site data, private browsing, and storage eviction can remove local saves.

## Continue editing with another account

Attach the existing `javascript-fieldwork` folder as a local project under the new account, or extract the source ZIP and attach that folder. Start a new chat with this prompt:

> Continue JavaScript Fieldwork from this local folder. Read README.md and docs/account-switch.md. The app runs with npm start and validates with npm test. Preserve the local-only PDF and private note storage, the course content, and existing code editors. The old hosted Site belongs to the previous account; do not assume this account can update it. Keep learner files and PDFs out of published assets.

This preserves the actual code and documentation. It does not transfer this chat’s history or ownership of the hosted Site. Local project setup is documented in [OpenAI’s Projects and chats guide](https://learn.chatgpt.com/docs/projects).

## Hosting independently

The `dist/` directory is the complete static web application. It can be served by a static HTTPS host without server functions, account integration, or a build step. Routes use hashes, so they need no rewrite rules. Preserve the directory structure and JavaScript, `.mjs`, WebAssembly, and font MIME types. HTTPS or localhost is required for browser storage, PDF fingerprinting, workers, and offline support.

For a new Site under the new account, make a separate copy of the source without `.git/` or `.openai/hosting.json` and ask to publish that copy as a new public Site. The old manifest identifies the old account’s Site; it must not be reused as a new Site identity. The portable ZIP already omits `.openai/` and Git metadata. Do not delete or change the working checkout’s identity merely to switch accounts.

## Maintainer map

- `dist/`: complete deployable app; all runtime assets are local.
- `dist/data/`: curriculum, labs, wiki, and library content.
- `dist/app.js`: routes, learning progress, and backup validation.
- `dist/book-reader.js`, `book-storage.js`, `book-file-storage.js`: reader, private annotations, and optional remembered PDF.
- `dist/book-map.js`: chapter/section references and physical PDF page numbers, with no copied book prose.
- `src/`: editor source; `npm ci && npm run editors:build` rebuilds its checked-in bundle when needed.
- `scripts/`: dependency-free local serving and learning-material generation.
- `tests/`: release, content, runner, state, and browser checks.

Run `npm test` after changes. Use `npm run materials` after editing learner manuals. See `docs/PRIVATE-READER-QA.md` for the private-reader browser suite.
