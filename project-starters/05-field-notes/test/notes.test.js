import test from "node:test";
import assert from "node:assert/strict";
import { validateWebUrl } from "../public/domain.js";
test("web links accept http/https, normalize the URL, and reject executable or malformed destinations", () => {
  assert.equal(validateWebUrl("https://example.test"), "https://example.test/");
  assert.equal(validateWebUrl("http://example.test/a"), "http://example.test/a");
  for (const value of ["javascript:alert(1)", "data:text/html,test", "not a url"]) assert.throws(() => validateWebUrl(value));
});
test.todo("a malformed or unsupported-version backup is rejected before existing workspace records are replaced");
test.todo("a saved note survives reload through an injected storage adapter and an exported backup restores it");
test.todo("title/body search combines with a tag filter and yields an empty array when nothing matches");
