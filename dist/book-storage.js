// Private PDF metadata only. No PDF bytes, progress data, or network access.
// Web Storage setItem is atomic: validation completes before the single write.
export const BOOK_STORAGE_PREFIX = 'fieldwork.book-notes.v1.';
export const BOOK_NOTES_LIMITS = Object.freeze({
  annotations: 2000,
  rectangles: 100,
  quote: 10000,
  note: 20000,
  id: 128,
  pages: 100000,
  bytes: 2 * 1024 * 1024
});

const FORMAT = 'fieldwork-book-notes';
const VERSION = 1;
const COLORS = new Set(['yellow', 'green', 'pink']);
const TYPES = new Set(['highlight', 'note']);
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const EPSILON = 1e-9;

function invalid(message) {
  throw new TypeError(`Book notes: ${message}`);
}

function record(value, label) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    invalid(`${label} must be an object.`);
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    invalid(`${label} must be a plain data object.`);
  }
  return value;
}

// Do not invoke accessors or look up inherited properties on supplied objects.
function own(value, key) {
  const descriptor = Object.getOwnPropertyDescriptor(value, key);
  if (!descriptor) return undefined;
  if (!Object.hasOwn(descriptor, 'value')) invalid(`${key} must be a data property.`);
  return descriptor.value;
}

function bookIdentifier(value) {
  if (typeof value !== 'string' || !/^[a-fA-F0-9]{64}$/.test(value)) {
    invalid('the book ID must be a 64-character SHA-256 hexadecimal digest.');
  }
  return value.toLowerCase();
}

export function bookStorageKey(bookId) {
  return BOOK_STORAGE_PREFIX + bookIdentifier(bookId);
}

function count(value) {
  if (!Number.isInteger(value) || value < 1 || value > BOOK_NOTES_LIMITS.pages) {
    invalid(`pageCount must be an integer from 1 to ${BOOK_NOTES_LIMITS.pages}.`);
  }
  return value;
}

function pageNumber(value, pageCount, label = 'page') {
  if (!Number.isInteger(value) || value < 1 || value > pageCount) {
    invalid(`${label} must be an integer from 1 to ${pageCount}.`);
  }
  return value;
}

function boundedText(value, maximum, label) {
  if (typeof value !== 'string' || value.length > maximum) {
    invalid(`${label} must be text of at most ${maximum} characters.`);
  }
  return value;
}

function timestamp(value, label) {
  if (typeof value !== 'string' || !ISO.test(value)) invalid(`${label} must be a canonical UTC timestamp.`);
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString() !== value) {
    invalid(`${label} contains an invalid calendar date or time.`);
  }
  return value;
}

function rectangle(value) {
  record(value, 'A highlight rectangle');
  const x = own(value, 'x'), y = own(value, 'y');
  let width = own(value, 'width'), height = own(value, 'height');
  if (![x, y, width, height].every(Number.isFinite) ||
      x < 0 || x >= 1 || y < 0 || y >= 1 ||
      width <= 0 || width > 1 || height <= 0 || height > 1 ||
      x + width > 1 + EPSILON || y + height > 1 + EPSILON) {
    invalid('highlight rectangles must have positive dimensions within normalized page bounds 0–1.');
  }
  // Client geometry can overshoot an edge by one floating-point rounding unit.
  width = Math.min(width, 1 - x);
  height = Math.min(height, 1 - y);
  return {x, y, width, height};
}

function annotation(value, pageCount) {
  record(value, 'An annotation');
  const id = own(value, 'id');
  if (typeof id !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(id)) {
    invalid('annotation IDs must contain 1–128 letters, digits, underscores, or hyphens.');
  }
  const page = pageNumber(own(value, 'page'), pageCount, 'Annotation page');
  const quote = boundedText(own(value, 'quote'), BOOK_NOTES_LIMITS.quote, 'Quoted text');
  const note = boundedText(own(value, 'note'), BOOK_NOTES_LIMITS.note, 'Annotation note');
  const color = own(value, 'color');
  if (!COLORS.has(color)) invalid('annotation color must be yellow, green, or pink.');
  const sourceRects = own(value, 'rects');
  if (!Array.isArray(sourceRects) || sourceRects.length > BOOK_NOTES_LIMITS.rectangles) {
    invalid(`an annotation may contain at most ${BOOK_NOTES_LIMITS.rectangles} rectangles.`);
  }
  const rects = Array.from(sourceRects, rectangle);
  const suppliedType = own(value, 'type');
  const type = suppliedType === undefined ? (rects.length ? 'highlight' : 'note') : suppliedType;
  if (!TYPES.has(type) || (type === 'highlight' && !rects.length)) {
    invalid('type must be note or highlight; a highlight requires at least one rectangle.');
  }
  const createdAt = timestamp(own(value, 'createdAt'), 'createdAt');
  const suppliedUpdate = own(value, 'updatedAt');
  const updatedAt = timestamp(suppliedUpdate === undefined ? createdAt : suppliedUpdate, 'updatedAt');
  // Only these explicit fields survive validation. Imported keys never become
  // property names in an annotation dictionary or spread into application state.
  return {id, type, page, quote, note, color, rects, createdAt, updatedAt};
}

function annotations(values, pageCount) {
  if (!Array.isArray(values) || values.length > BOOK_NOTES_LIMITS.annotations) {
    invalid(`a book may contain at most ${BOOK_NOTES_LIMITS.annotations} annotations.`);
  }
  const ids = new Set();
  return Array.from(values, value => {
    const normalized = annotation(value, pageCount);
    if (ids.has(normalized.id)) invalid(`duplicate annotation ID: ${normalized.id}.`);
    ids.add(normalized.id);
    return normalized;
  });
}

function sizeChecked(text) {
  if (new TextEncoder().encode(text).byteLength > BOOK_NOTES_LIMITS.bytes) {
    throw new RangeError('Book notes exceed the 2 MiB limit. Export or reduce the annotations before saving.');
  }
  return text;
}

function serialize(value) {
  return sizeChecked(JSON.stringify(value));
}

function parse(input) {
  if (typeof input === 'string') {
    sizeChecked(input);
    try { return JSON.parse(input); }
    catch { invalid('the selected file is not valid JSON.'); }
  }
  return record(input, 'The supplied record');
}

export function validateBookRecord(input, pageCount = BOOK_NOTES_LIMITS.pages) {
  const maximum = count(pageCount);
  const source = record(input, 'The saved reading record');
  const normalized = {
    page: pageNumber(own(source, 'page'), maximum),
    annotations: annotations(own(source, 'annotations'), maximum)
  };
  serialize(normalized);
  return normalized;
}

export function validateBookNotes(input, bookId, pageCount) {
  const expectedId = bookIdentifier(bookId);
  const expectedCount = count(pageCount);
  const source = record(parse(input), 'The annotation backup');
  if (own(source, 'format') !== FORMAT || own(source, 'version') !== VERSION) {
    invalid('choose a Fieldwork book-notes version 1 backup.');
  }
  const importedId = bookIdentifier(own(source, 'bookId'));
  if (importedId !== expectedId) invalid('this backup belongs to a different PDF.');
  if (count(own(source, 'pageCount')) !== expectedCount) {
    invalid('the backup page count does not match this PDF.');
  }
  const page = own(source, 'page');
  const normalized = {
    format: FORMAT,
    version: VERSION,
    bookId: importedId,
    pageCount: expectedCount,
    page: pageNumber(page === undefined ? 1 : page, expectedCount),
    annotations: annotations(own(source, 'annotations'), expectedCount)
  };
  const exportedAt = own(source, 'exportedAt');
  if (exportedAt !== undefined) normalized.exportedAt = timestamp(exportedAt, 'exportedAt');
  serialize(normalized);
  return normalized;
}

export function mergeBookAnnotations(existing, incoming, pageCount = BOOK_NOTES_LIMITS.pages) {
  const maximum = count(pageCount);
  const original = annotations(existing, maximum);
  const additions = annotations(incoming, maximum);
  const seen = new Set(original.map(item => item.id));
  const merged = [...original];
  for (const item of additions) {
    if (!seen.has(item.id)) {
      merged.push(item);
      seen.add(item.id);
    }
  }
  if (merged.length > BOOK_NOTES_LIMITS.annotations) {
    invalid(`the merged book would exceed ${BOOK_NOTES_LIMITS.annotations} annotations.`);
  }
  serialize({page: 1, annotations: merged});
  return merged;
}

export function createBookStore(storage = globalThis.localStorage) {
  if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function') {
    throw new TypeError('Local book-note storage is unavailable.');
  }
  const load = (bookId, pageCount = BOOK_NOTES_LIMITS.pages) => {
    const id = bookIdentifier(bookId);
    const maximum = count(pageCount);
    const raw = storage.getItem(bookStorageKey(id));
    if (raw === null) return {page: 1, annotations: []};
    const source = record(parse(raw), 'The saved book notes');
    if (own(source, 'version') !== VERSION || bookIdentifier(own(source, 'bookId')) !== id) {
      invalid('saved book-note metadata is invalid or belongs to a different PDF.');
    }
    return validateBookRecord(source, maximum);
  };
  const save = (bookId, readingRecord, pageCount = BOOK_NOTES_LIMITS.pages) => {
    const id = bookIdentifier(bookId);
    const normalized = validateBookRecord(readingRecord, pageCount);
    const serialized = serialize({version: VERSION, bookId: id, ...normalized});
    // Let QuotaExceededError/SecurityError propagate. A caller may retain its
    // unsaved session, but must never display a successful persistence status.
    storage.setItem(bookStorageKey(id), serialized);
    return normalized;
  };
  return Object.freeze({
    load,
    save,
    export(bookId, pageCount) {
      const id = bookIdentifier(bookId);
      const saved = load(id, pageCount);
      return validateBookNotes({
        format: FORMAT,
        version: VERSION,
        bookId: id,
        pageCount,
        ...saved,
        exportedAt: new Date().toISOString()
      }, id, pageCount);
    },
    import(bookId, pageCount, input) {
      const id = bookIdentifier(bookId);
      const imported = validateBookNotes(input, id, pageCount);
      const current = load(id, pageCount);
      const merged = {
        page: current.page,
        annotations: mergeBookAnnotations(current.annotations, imported.annotations, pageCount)
      };
      return save(id, merged, pageCount);
    }
  });
}
