# Private reader verification

Verified locally on 20 October 2026. No book pages, extracted book text, private note exports, or screenshots containing the book are included in the release.

This is a historical reader audit, including checks from before local SQLite support. See [release closeout](PROJECT-CLOSEOUT.md) for current validation scope; no private migration evidence is included here.

## Reading and annotation checks

- All 36 lessons have reading assignments: 97 inclusive ranges verified against the supplied 1,245-page seventh-edition PDF. These are physical PDF positions, not printed page labels.
- The supplied local PDF opened beside lesson 4 at its requested page. Page jumps, keyboard text selection, a green highlight, a page note, zoom, and a quiz rerender worked together.
- Reloading the portal and reselecting the same file restored page 229 and both test annotations. The local notes export was 1,086 bytes and contained only the documented metadata and annotations.
- With the local web server stopped, reloading the cached portal, reselecting the PDF, restoring the highlight, and navigating to the next PDF page all succeeded.
- The reader provides approximately 410 pixels of page viewport at a 1280 × 720 desktop viewport. Its assignment disclosure collapses after opening a PDF.
- A separate 390-pixel iframe passed navigation, page bounds, text selection, and horizontal-overflow checks.

## Automated checks

`npm test` passes, including the existing curriculum, lab, wiki, progress, and playground suites.

- 18 storage test groups cover fingerprint isolation, valid geometry and page bounds, defensive copies, schema and size limits, deterministic imports, failed writes, and corrupt storage.
- 22 browser checks exercise the actual PDF.js reader using original synthetic PDFs. They cover first-open page targeting, note creation and editing, highlighting, zoom, bounds, lesson synchronization, reload recovery, switching PDFs, export/import, invalid backups, quota failures, delete/undo, and request privacy.
- The release check examines all deployable files, rejects PDFs and private QA data, checks offline reader assets, and verifies that the service worker ignores books, private backup URLs, and blob URLs.
- UI fonts, PDF.js, its worker, fonts, character maps, and codecs are served by the application. The browser harness observed no external requests or document/annotation uploads.

The browser checks caught and verified a fix for PDF.js 6 task cleanup during document replacement. Destruction now uses the owning loading task.

## Reproduce

```sh
npm test
node tests/serve-reader-qa.mjs
```

Open `http://127.0.0.1:4197/__reader-qa` and select **Run reader browser tests**, then **Open 390px mobile preview**. These tests create their own two-page PDFs in memory. They do not need or read the reference book.

The reader keeps a newly selected PDF in browser memory until the learner opts into **Remember PDF**. One private Blob is then stored in IndexedDB and fingerprint-verified before automatic restoration. Page position and annotations use the PDF's SHA-256 fingerprint. Current hosted/static mode saves them in browser storage; desktop mode also commits these textual records to SQLite. Reader open/closed preference is stored separately. Book-note backups are separate from the older course-progress backup; the newer all-data backup includes both. None includes the PDF. Clearing browser site data removes its remembered copy and browser-only annotations; records already committed to local SQLite remain. Keep an exported backup and the original PDF.

## Remembered PDF checks

The actual-browser suite additionally verifies opt-in storage, automatic reopening without a file chooser, closed-reader preference, session-only replacement, atomic replacement after simulated quota/blocked-storage failures, honest failed deletion and retry, and rejection of a damaged remembered copy. Forgetting preserves the open document and its annotations. Notes exports still exclude PDF bytes. The request audit covers these flows, with no PDF uploads or course-progress writes.

The supplied 1,245-page PDF was remembered on a local origin and restored after a real reload at PDF page 198 without a file chooser. The 390-pixel mobile preview also passed. A server-stopped reload did not work in this run of the in-app browser; offline restoration of the new remembered-file flow remains unverified there. The local launcher was separately tested and served HTTP 200 without an OpenAI login. Keep the local server running for reliable independent access.
