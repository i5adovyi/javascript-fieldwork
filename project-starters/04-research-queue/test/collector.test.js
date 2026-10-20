import test from "node:test";
import assert from "node:assert/strict";
import { validateConcurrency } from "../src/collector.js";
import { fakeLookup } from "../src/fake-service.js";
test("the supplied concurrency guard and fake adapter expose predictable contracts", async () => {
  assert.equal(validateConcurrency(2), 2);
  for (const value of [0, -1, 1.5, "2", NaN]) assert.throws(() => validateConcurrency(value), RangeError);
  assert.deepEqual(await fakeLookup("runtime"), { id: "runtime", title: "Research: runtime", tags: ["javascript"] });
  await assert.rejects(fakeLookup("missing"), /Synthetic service failure/);
  assert.deepEqual(await fakeLookup("malformed"), { unexpected: true });
  const controller = new AbortController(); controller.abort();
  await assert.rejects(fakeLookup("runtime", { signal: controller.signal }), { name: "AbortError" });
});
test.todo("instrumented lookup never observes more active calls than the configured concurrency limit");
test.todo("a failed lookup and malformed result are reported separately while successful items remain available");
test.todo("aborting a batch stops new scheduling, and a later batch receives no results from the earlier batch");
