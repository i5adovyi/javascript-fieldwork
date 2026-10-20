import test from "node:test";
import assert from "node:assert/strict";
import { isRecord } from "../src/dataset.js";
test("the record guard accepts non-array objects and rejects null, arrays, and primitives", () => {
  assert.equal(isRecord({ id: "a" }), true);
  for (const value of [null, [], "a", 3, false, undefined]) assert.equal(isRecord(value), false);
});
test.todo("processing small.json reports the duplicate a and blank-name c separately under the documented policy");
test.todo("processing a dataset leaves the original records and nested tag arrays unchanged");
test.todo("search and tag filtering combine correctly, while an empty or all-invalid dataset has a zero summary");
