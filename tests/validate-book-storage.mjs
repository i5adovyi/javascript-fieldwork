import assert from 'node:assert/strict';
import {
  BOOK_NOTES_LIMITS,
  BOOK_STORAGE_PREFIX,
  bookStorageKey,
  createBookStore,
  validateBookRecord,
  validateBookNotes,
  mergeBookAnnotations
} from '../dist/book-storage.js';

const BOOK = 'a'.repeat(64);
const OTHER = 'b'.repeat(64);
const CREATED = '2026-10-20T12:34:56.000Z';
const rectangle = {x: 0.1, y: 0.2, width: 0.4, height: 0.03};
const mark = (id = 'mark-1', changes = {}) => ({
  id,
  type: 'highlight',
  page: 2,
  quote: 'A selected passage.',
  note: 'My explanation, in my own words.',
  color: 'yellow',
  rects: [{...rectangle}],
  createdAt: CREATED,
  updatedAt: CREATED,
  ...changes
});
const backup = (annotations = [mark()], changes = {}) => ({
  format: 'fieldwork-book-notes',
  version: 1,
  bookId: BOOK,
  pageCount: 12,
  page: 2,
  annotations,
  exportedAt: CREATED,
  ...changes
});
function memoryStorage() {
  const items = new Map();
  let readError, writeError;
  const accesses = [];
  return {
    items,
    accesses,
    failReads(error) { readError = error; },
    failWrites(error) { writeError = error; },
    getItem(key) {
      accesses.push(['get', key]);
      if (readError) throw readError;
      return items.get(key) ?? null;
    },
    setItem(key, value) {
      accesses.push(['set', key]);
      if (writeError) throw writeError;
      items.set(key, value);
    }
  };
}
let checks = 0;
function check(name, run) {
  run();
  checks++;
  console.log(`PASS ${name}`);
}

check('Empty books are independent and do not create storage entries', () => {
  const storage = memoryStorage(), store = createBookStore(storage);
  assert.deepEqual(store.load(BOOK), {page: 1, annotations: []});
  assert.deepEqual(store.load(OTHER, 12), {page: 1, annotations: []});
  assert.equal(storage.items.size, 0);
  assert.ok(storage.accesses.every(([, key]) => key.startsWith(BOOK_STORAGE_PREFIX)));
});

check('Fingerprint validation prevents arbitrary storage keys', () => {
  assert.equal(bookStorageKey(BOOK.toUpperCase()), BOOK_STORAGE_PREFIX + BOOK);
  const storage = memoryStorage(), store = createBookStore(storage);
  for (const value of ['../progress', '__proto__', 'g'.repeat(64), 'a'.repeat(63), '', null, {}]) {
    assert.throws(() => store.load(value), /SHA-256/);
    assert.throws(() => store.save(value, {page: 1, annotations: []}), /SHA-256/);
  }
  assert.equal(storage.accesses.length, 0);
});

check('Saved records and returned records never share mutable references', () => {
  const storage = memoryStorage(), store = createBookStore(storage);
  const source = {page: 4, annotations: [mark()]};
  const saved = store.save(BOOK, source, 12);
  source.annotations[0].note = 'Changed input';
  saved.annotations[0].rects[0].width = 0.9;
  const loaded = store.load(BOOK, 12);
  assert.equal(loaded.annotations[0].note, 'My explanation, in my own words.');
  assert.equal(loaded.annotations[0].rects[0].width, 0.4);
  loaded.annotations.length = 0;
  assert.equal(store.load(BOOK, 12).annotations.length, 1);
  assert.deepEqual(store.load(OTHER, 12), {page: 1, annotations: []});
  assert.equal(storage.items.has('fieldwork.progress.v1'), false);
});

check('Default annotation fields support the original minimal schema', () => {
  const minimal = mark();
  delete minimal.type;
  delete minimal.updatedAt;
  const result = validateBookRecord({page: 2, annotations: [minimal]}, 12);
  assert.equal(result.annotations[0].type, 'highlight');
  assert.equal(result.annotations[0].updatedAt, CREATED);
  const note = {...minimal, rects: [], quote: ''};
  assert.equal(validateBookRecord({page: 2, annotations: [note]}, 12).annotations[0].type, 'note');
  assert.throws(() => validateBookRecord({page: 2, annotations: [mark('x', {rects: []})]}, 12), /highlight requires/);
});

check('Only explicit annotation fields survive, including hostile imported property names', () => {
  const polluted = JSON.parse(JSON.stringify(backup()).replace(
    '"quote":"A selected passage."',
    '"__proto__":{"polluted":true},"constructor":{"prototype":{"polluted":true}},"quote":"A selected passage."'
  ));
  polluted.extra = {network: 'https://example.invalid'};
  const clean = validateBookNotes(polluted, BOOK, 12);
  assert.equal(Object.hasOwn(clean.annotations[0], '__proto__'), false);
  assert.equal(Object.hasOwn(clean.annotations[0], 'constructor'), false);
  assert.equal(Object.hasOwn(clean, 'extra'), false);
  assert.equal({}.polluted, undefined);
  const safeId = validateBookNotes(backup([mark('__proto__')]), BOOK, 12);
  assert.equal(safeId.annotations[0].id, '__proto__', 'Opaque IDs are stored as values, never object keys');
});

check('Accessors are rejected without execution and inherited fields are not accepted', () => {
  let called = 0;
  const input = {page: 1, annotations: []};
  Object.defineProperty(input, 'page', {get() { called++; return 1; }});
  assert.throws(() => validateBookRecord(input), /data property/);
  assert.equal(called, 0);
  assert.throws(() => validateBookRecord(Object.create({page: 1, annotations: []})), /plain data/);
});

check('Rectangle validation rejects nonfinite, zero-area, and out-of-page geometry', () => {
  for (const rect of [
    {...rectangle, x: -0.1},
    {...rectangle, y: 1},
    {...rectangle, width: 0},
    {...rectangle, height: -0.1},
    {...rectangle, x: 0.9, width: 0.2},
    {...rectangle, y: 0.99, height: 0.03},
    {...rectangle, x: NaN},
    {...rectangle, width: Infinity},
    {...rectangle, width: '0.4'}
  ]) {
    assert.throws(() => validateBookRecord({page: 2, annotations: [mark('x', {rects: [rect]})]}, 12), /normalized page bounds/);
  }
  const rects = validateBookRecord({
    page: 2,
    annotations: [mark('x', {rects: [{x: 0.6, y: 0.2, width: 0.4000000000000001, height: 0.1}]})]
  }, 12).annotations[0].rects;
  assert.ok(rects[0].x + rects[0].width <= 1, 'Tiny floating-point overshoot is normalized');
});

check('Page bounds and timestamp validity are enforced', () => {
  for (const page of [0, -1, 13, 1.5, '2', NaN, Infinity]) {
    assert.throws(() => validateBookRecord({page, annotations: []}, 12), /page must/);
    assert.throws(() => validateBookRecord({page: 1, annotations: [mark('x', {page})]}, 12), /Annotation page/);
  }
  for (const date of ['', '2026-02-30T12:00:00.000Z', '2026-01-01', '2026-01-01T00:00:00Z', null]) {
    assert.throws(() => validateBookRecord({page: 2, annotations: [mark('x', {createdAt: date})]}, 12), /createdAt/);
  }
  assert.throws(() => validateBookRecord({page: 2, annotations: [mark('x', {updatedAt: 'bad'})]}, 12), /updatedAt/);
  assert.throws(() => validateBookRecord({page: 2, annotations: [mark('x', {updatedAt: null})]}, 12), /updatedAt/);
  for (const maximum of [0, 1.5, BOOK_NOTES_LIMITS.pages + 1]) {
    assert.throws(() => validateBookRecord({page: 1, annotations: []}, maximum), /pageCount/);
  }
});

check('IDs, colors, and annotation kinds are validated', () => {
  for (const changes of [{id: '<script>'}, {id: 'x'.repeat(129)}, {color: 'red'}, {type: 'script'}, {type: null}, {quote: null}, {note: 42}]) {
    assert.throws(() => validateBookRecord({page: 2, annotations: [mark('x', changes)]}, 12), /Book notes:/);
  }
  assert.throws(() => validateBookRecord({page: 1, annotations: [mark(), mark()]}, 12), /duplicate annotation ID/);
});

check('Individual and aggregate size limits reject oversized data', () => {
  for (const changes of [
    {quote: 'x'.repeat(BOOK_NOTES_LIMITS.quote + 1)},
    {note: 'x'.repeat(BOOK_NOTES_LIMITS.note + 1)},
    {rects: Array.from({length: BOOK_NOTES_LIMITS.rectangles + 1}, () => ({...rectangle}))}
  ]) {
    assert.throws(() => validateBookRecord({page: 2, annotations: [mark('x', changes)]}, 12), /at most/);
  }
  assert.throws(() => validateBookRecord({
    page: 1,
    annotations: Array.from({length: BOOK_NOTES_LIMITS.annotations + 1}, (_, i) => mark(`x-${i}`))
  }, 12), /at most/);
  assert.throws(() => validateBookNotes(' '.repeat(BOOK_NOTES_LIMITS.bytes + 1), BOOK, 12), /2 MiB/);
  const large = Array.from({length: 110}, (_, i) => mark(`large-${i}`, {note: 'x'.repeat(20000)}));
  assert.throws(() => validateBookNotes(backup(large), BOOK, 12), /2 MiB/);
  const unicodeLarge = Array.from({length: 40}, (_, i) => mark(`unicode-${i}`, {note: '€'.repeat(20000)}));
  assert.throws(() => validateBookNotes(backup(unicodeLarge), BOOK, 12), /2 MiB/, 'Limits apply to UTF-8 bytes, not only characters');
});

check('Export preserves page, count, fingerprint, timestamps, and annotations', () => {
  const storage = memoryStorage(), store = createBookStore(storage);
  store.save(BOOK, {page: 7, annotations: [mark()]}, 12);
  const exported = store.export(BOOK.toUpperCase(), 12);
  assert.equal(exported.format, 'fieldwork-book-notes');
  assert.equal(exported.version, 1);
  assert.equal(exported.page, 7);
  assert.equal(exported.pageCount, 12);
  assert.equal(exported.bookId, BOOK);
  assert.equal(new Date(exported.exportedAt).toISOString(), exported.exportedAt);
  assert.deepEqual(validateBookNotes(JSON.stringify(exported), BOOK, 12), exported);
  assert.equal(storage.items.size, 1);
});

check('Envelope validation rejects malformed, mismatched, or unsupported backups', () => {
  for (const changes of [
    {format: 'other'}, {version: 2}, {bookId: OTHER}, {pageCount: 11},
    {pageCount: 0}, {page: 13}, {annotations: null}, {exportedAt: 'bad'}
  ]) {
    assert.throws(() => validateBookNotes(backup([], changes), BOOK, 12), /Book notes:/);
  }
  for (const value of ['{broken', 'null', '[]', '42', '', null]) {
    assert.throws(() => validateBookNotes(value, BOOK, 12), /Book notes:/);
  }
  const old = backup([]);
  delete old.page;
  delete old.exportedAt;
  const result = validateBookNotes(old, BOOK, 12);
  assert.equal(result.page, 1);
  assert.equal(Object.hasOwn(result, 'exportedAt'), false);
});

check('Merge is deterministic, keeps originals on ID conflicts, and copies both inputs', () => {
  const original = [mark('a', {note: 'original a'}), mark('b')];
  const incoming = [mark('a', {note: 'imported a'}), mark('c'), mark('d')];
  const before = JSON.stringify([original, incoming]);
  const merged = mergeBookAnnotations(original, incoming, 12);
  assert.deepEqual(merged.map(item => item.id), ['a', 'b', 'c', 'd']);
  assert.equal(merged[0].note, 'original a');
  merged[0].note = 'Edited returned record';
  merged[2].rects[0].width = 0.8;
  assert.equal(JSON.stringify([original, incoming]), before);
  assert.throws(() => mergeBookAnnotations(original, [mark('c'), mark('c')], 12), /duplicate/);
  assert.equal(JSON.stringify([original, incoming]), before);
});

check('An over-capacity merge rejects before saving either input', () => {
  const existing = Array.from({length: 1001}, (_, i) => mark(`old-${i}`, {type: 'note', rects: []}));
  const incoming = Array.from({length: 1000}, (_, i) => mark(`new-${i}`, {type: 'note', rects: []}));
  assert.throws(() => mergeBookAnnotations(existing, incoming, 12), /merged book would exceed/);
  assert.equal(existing.length, 1001);
  assert.equal(incoming.length, 1000);
});

check('Import appends new IDs, preserves the current reading page, and is repeatable', () => {
  const storage = memoryStorage(), store = createBookStore(storage);
  store.save(BOOK, {page: 9, annotations: [mark('a', {note: 'existing'})]}, 12);
  const input = backup([mark('a', {note: 'imported'}), mark('b')], {page: 2});
  const before = JSON.stringify(input);
  const imported = store.import(BOOK, 12, JSON.stringify(input));
  assert.equal(imported.page, 9);
  assert.deepEqual(imported.annotations.map(item => item.id), ['a', 'b']);
  assert.equal(imported.annotations[0].note, 'existing');
  assert.deepEqual(store.import(BOOK, 12, input), imported);
  assert.equal(JSON.stringify(input), before);
  assert.deepEqual(store.load(BOOK, 12), imported);
});

check('Invalid import preserves every byte of the existing record', () => {
  const storage = memoryStorage(), store = createBookStore(storage);
  store.save(BOOK, {page: 3, annotations: [mark()]}, 12);
  const previous = storage.items.get(bookStorageKey(BOOK));
  for (const input of [backup([], {bookId: OTHER}), backup([mark('bad', {page: 13})]), '{broken']) {
    assert.throws(() => store.import(BOOK, 12, input));
    assert.equal(storage.items.get(bookStorageKey(BOOK)), previous);
  }
});

check('Blocked or full storage never reports a successful save or import', () => {
  const storage = memoryStorage(), store = createBookStore(storage);
  store.save(BOOK, {page: 3, annotations: [mark()]}, 12);
  const previous = storage.items.get(bookStorageKey(BOOK));
  const quotaError = new Error('Quota exceeded');
  quotaError.name = 'QuotaExceededError';
  storage.failWrites(quotaError);
  const session = {page: 4, annotations: [mark('session')]};
  const before = JSON.stringify(session);
  assert.throws(() => store.save(BOOK, session, 12), error => error === quotaError);
  assert.throws(() => store.import(BOOK, 12, backup([mark('imported')])), error => error === quotaError);
  assert.equal(storage.items.get(bookStorageKey(BOOK)), previous);
  assert.equal(JSON.stringify(session), before);
  assert.deepEqual(store.load(BOOK, 12).annotations.map(item => item.id), ['mark-1']);
  storage.failWrites(undefined);
  assert.equal(store.save(BOOK, session, 12).page, 4, 'Retry can succeed without recreating the store');
});

check('Unreadable or corrupt storage is surfaced, never silently replaced', () => {
  const storage = memoryStorage(), store = createBookStore(storage);
  const blocked = new Error('Storage blocked');
  storage.failReads(blocked);
  assert.throws(() => store.load(BOOK, 12), error => error === blocked);
  assert.throws(() => store.export(BOOK, 12), error => error === blocked);
  storage.failReads(undefined);
  for (const raw of ['{broken', 'null', '{"version":2}', JSON.stringify({version: 1, bookId: OTHER, page: 1, annotations: []})]) {
    storage.items.set(bookStorageKey(BOOK), raw);
    assert.throws(() => store.load(BOOK, 12), /Book notes:/);
    assert.throws(() => store.import(BOOK, 12, backup([])), /Book notes:/);
    assert.equal(storage.items.get(bookStorageKey(BOOK)), raw);
  }
  assert.throws(() => createBookStore(null), /unavailable/);
});

console.log(`Book-note storage verified: ${checks} checks; private keys, validation, defensive copies, deterministic imports, and honest persistence failures.`);
