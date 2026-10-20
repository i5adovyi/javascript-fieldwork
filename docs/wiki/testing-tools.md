# Tests, linting, and formatting

Use behavior checks, static checks, and formatting for the different problems each can detect.

## Essential rule

Assert observable behavior with representative inputs, boundaries, and failures; keep external dependencies controllable.

A unit test supplies inputs and compares the result with an independently chosen expectation. For asynchronous code, return or await the work so failures reach the test. Inject a small fake dependency when networking, clocks, or files would make the test nondeterministic. Add integration coverage where the real boundary matters.

The book uses Jest to demonstrate assertions and mocks. The example below uses Node 20’s built-in assertion module, requiring no package install. ESLint checks configured code rules; Prettier formats source. Keep project tools and scripts in package.json so contributors run consistent checks.

## When to use it

- Protect a meaningful behavior before refactoring it.
- Reproduce a bug with a small deterministic case.

## Practical example

Runtime: Node 20+, saved as .mjs.

```javascript
import assert from "node:assert/strict";

async function cartTotal(loadItems) {
  const items = await loadItems();
  return items.reduce((sum, item) => sum + item.priceCents, 0);
}
assert.equal(await cartTotal(async () => [
  { priceCents: 250 }, { priceCents: 500 },
]), 750);
assert.equal(await cartTotal(async () => []), 0);
await assert.rejects(
  () => cartTotal(async () => { throw new Error("offline"); }),
  /offline/
);
console.log("3 checks passed");
```

Expected output:

```text
3 checks passed
```

Save as an .mjs file and run with Node 20. The checks cover a normal total, an empty cart, and propagation of a dependency failure, without a network request.

## Common pitfalls

- Coverage measures execution, not whether your assertions prove the right behavior.
- A mock can hide a broken real integration; test that boundary separately.
- Passing lint and formatting checks says nothing about business correctness.

## Related topics

- [Functions & parameter contracts](functions.md)
- [Async functions and await](async-await.md)
- [Errors & cleanup](errors.md)
- [Fetch: check the response, then read the body](fetch.md)

## Linked lessons

- Lesson 17: Dependency Design & Boundaries
- Lesson 33: HTTP Services & Trust Boundaries
- Lesson 35: Tooling, Testing & Delivery
- Lesson 36: Capstone: Ship Your JavaScript System

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §17.1 — PDF page 1094 (file page index, not printed numbering).
- §17.2 — PDF page 1096 (file page index, not printed numbering).
- §17.3 — PDF page 1098 (file page index, not printed numbering).
- §17.4 — PDF page 1102 (file page index, not printed numbering).

Edition note: The book teaches testing with Jest. This dependency-free example applies the same testing principles with Node assertions.

