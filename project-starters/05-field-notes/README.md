# Field Notes / a personal research workspace

**Stage 5 · Intermediate → advanced · 16 estimated project hours**

A complete browser tool with thoughtful details.

## Brief

Build a responsive browser application for collecting notes, tags, and web references. A user can create, edit, search, filter, delete, export, and import records. Data persists locally. Design the empty, loading, validation, and storage-failure states alongside the happy path. Use semantic HTML and plain JavaScript modules so the platform remains visible.

## Start the scaffold

```sh
cd 05-field-notes
npm test
npm start
```

Run these commands from the parent `project-starters` directory for the first line, then remain in this numbered folder. Node.js 22+ is required. No dependencies or installation are needed. The scaffold contains named TODO functions that deliberately throw until implemented. They are not invoked by the initial demo. Browser shells label unfinished actions clearly.

The initial test run has one passing test for a provided utility and three pending acceptance tests. Replace a `test.todo` with an actual test and write its assertions before implementing that behavior. Do not treat pending tests as completed requirements.

Open **http://127.0.0.1:4175** after starting. The current interface only demonstrates safe rendering and form structure; notes are not yet saved.

## Deliverables

- Responsive application with a complete CRUD flow
- Local persistence plus versioned JSON export/import
- Keyboard walkthrough and malformed-import checks
- Demo data, screenshots, and a recovery guide

## Milestones and acceptance

### 1 · Build a usable core

- [ ] Create and edit a note using labelled controls and visible validation.
- [ ] Search titles and body text and combine search with a tag filter.
- [ ] Provide an understandable empty result and a way to clear filters.

### 2 · Preserve the workspace

- [ ] Reload the browser and retain saved records.
- [ ] Export, clear a disposable test workspace, and restore from the export.
- [ ] Reject an invalid import without overwriting existing records; define replace or merge behavior.

### 3 · Review the browser boundaries

- [ ] Render imported markup-like titles as text rather than HTML.
- [ ] Reject unsupported link protocols and handle storage failures visibly.
- [ ] Complete creation, search, edit, and deletion with a keyboard on a narrow layout.

## Rubric · 100 points

| Criterion | Points |
| --- | ---: |
| Complete and reliable primary workflows | 30 |
| Persistence, import/export, and recovery | 25 |
| Keyboard use, responsive layout, and feedback | 25 |
| Safe rendering and input boundaries | 15 |
| Clear demo and documentation | 5 |

## Optional extensions

- Add an undo action for deletion.
- Implement accessible keyboard shortcuts with visible help.
- Add offline support only after defining a cache update strategy.

## Guidance

Read `SOLUTION-NOTES.md` for a sequence of experiments and design questions. It is an approach guide, not a finished solution. Preserve fixtures, run tests, and keep a short decision log as you work.
