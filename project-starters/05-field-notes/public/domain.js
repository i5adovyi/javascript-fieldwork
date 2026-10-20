export const BACKUP_VERSION = 1;
export function validateWebUrl(rawUrl) {
  const url = new URL(rawUrl);
  if (!["https:", "http:"].includes(url.protocol)) throw new Error("Use an http or https URL");
  return url.href;
}
export function createNote(input, { createId } = {}) {
  // TODO FN1: Validate title, body, tags, and optional URL; return a new note.
  throw new Error("TODO FN1: implement createNote");
}
export function filterNotes(notes, { search = "", tag = null } = {}) {
  // TODO FN2: Combine case-insensitive title/body search with tag filtering.
  throw new Error("TODO FN2: implement filterNotes");
}
export function parseBackup(text) {
  // TODO FN3: Parse into temporary data; validate version and every record before returning.
  throw new Error("TODO FN3: implement parseBackup");
}
export function saveWorkspace(storage, notes) {
  // TODO FN4: Persist a versioned envelope; report failures to the caller.
  throw new Error("TODO FN4: implement saveWorkspace");
}
