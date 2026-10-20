import test from "node:test";
import assert from "node:assert/strict";
import { STATUSES, isStatus } from "../src/workflow.js";
test("only the documented workflow state strings are accepted", () => {
  assert.deepEqual(STATUSES, ["open", "active", "blocked", "done"]);
  for (const value of STATUSES) assert.equal(isStatus(value), true);
  for (const value of ["OPEN", "", null, 0]) assert.equal(isStatus(value), false);
});
test.todo("adding a task to one workflow instance leaves a second instance empty");
test.todo("a forbidden transition throws a documented error and preserves the task's previous state");
test.todo("changing a record returned by find or list cannot mutate the workflow's private state");
