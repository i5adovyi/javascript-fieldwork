// This guard checks container shape only; it does not validate participant fields.
export function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function normalizeRecord(record) {
  // TODO DS1: Return a new normalized record, or a rejection with a specific reason.
  throw new Error("TODO DS1: implement normalizeRecord");
}
export function processDataset(records) {
  // TODO DS2: Validate, normalize, and deduplicate with a documented winner policy.
  // Suggested result: { accepted, rejected, duplicates }.
  throw new Error("TODO DS2: implement processDataset");
}
export function queryRecords(records, { search = "", tag = null } = {}) {
  // TODO DS3: Combine case-insensitive name search and exact tag filtering.
  throw new Error("TODO DS3: implement queryRecords");
}
export function summarize(records) {
  // TODO DS4: Return useful totals and counts by tag, including empty input.
  throw new Error("TODO DS4: implement summarize");
}
