import test from "node:test";
import assert from "node:assert/strict";
import { isValidAgeHours } from "../src/dispatch.js";

test("age validation accepts zero and finite positive numbers and rejects invalid values", () => {
  for (const age of [0, 0.5, 24]) assert.equal(isValidAgeHours(age), true);
  for (const age of [-1, NaN, Infinity, "24", null, undefined]) assert.equal(isValidAgeHours(age), false);
});
// Turn each TODO into test(name, () => { ... }) and add the described assertions.
test.todo("a critical request follows the critical rule even when a lower-priority tier rule also matches");
test.todo("the age threshold, immediately below it, and immediately above it match the written decision table");
test.todo("routeRequest rejects missing severity and negative age, and leaves a valid input object unchanged");
