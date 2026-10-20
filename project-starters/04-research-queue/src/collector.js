export function validateConcurrency(value) {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError("Concurrency must be a positive integer");
  }
  return value;
}

export async function collectTopics(topics, { lookup, concurrency = 2, signal, onProgress } = {}) {
  validateConcurrency(concurrency);
  // TODO RQ1: Define item states and validate metadata returned by lookup.
  // TODO RQ2: Schedule at most concurrency in-flight lookups.
  // TODO RQ3: Stop scheduling on cancellation; document in-flight behavior.
  // TODO RQ4: Return a complete per-item report, preserving your chosen order.
  throw new Error("TODO RQ1: implement collectTopics");
}
