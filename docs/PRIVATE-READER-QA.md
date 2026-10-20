# Private reader verification

Verified locally on 20 October 2026. No book pages, extracted book text, private note exports, or screenshots containing the book are included in the release.

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
- 16 browser checks exercise the actual PDF.js reader using original synthetic PDFs. They cover first-open page targeting, note creation and editing, highlighting, zoom, bounds, lesson synchronization, reload recovery, switching PDFs, export/import, invalid backups, quota failures, delete/undo, and request privacy.
- The release check examines all 264 deployable files, rejects PDFs and private QA data, checks offline reader assets, and verifies that the service worker ignores books, private backup URLs, and blob URLs.
- UI fonts, PDF.js, its worker, fonts, character maps, and codecs are served by the application. The browser harness observed no external requests or document/annotation uploads.

The browser checks caught and verified a fix for PDF.js 6 task cleanup during document replacement. Destruction now uses the owning loading task.

## Reproduce

```sh
npm test
node tests/serve-reader-qa.mjs
```

Open `http://127.0.0.1:4197/__reader-qa` and select **Run reader browser tests**, then **Open 390px mobile preview**. These tests create their own two-page PDFs in memory. They do not need or read the reference book.

The reader keeps the selected PDF in browser memory. Only page position and annotations are stored in localStorage under the PDF's SHA-256 fingerprint. Book-note backups are separate from course-progress backups; neither backup includes the PDF. Clearing browser site data removes stored notes unless the learner has exported them.
