# Errors & cleanup

Expose failures clearly and put cleanup on every exit path.

## Essential rule

Throw Error objects for exceptional failures; catch where you can recover or add a useful boundary response.

An exception stops normal execution until a matching catch handles it. Use specific error types such as TypeError or RangeError to describe a violated contract. A catch that silently ignores everything can turn an obvious failure into incorrect data.

finally runs when control leaves try/catch, including on return or throw. It is the right place for synchronous resource cleanup. For rejected promises, await inside try or return a chain with catch so the error reaches the intended handler.

## When to use it

- Rejecting an unsupported input before changing state.
- Restoring a loading flag or releasing a resource after success or failure.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
let busy = true;
try {
  throw new TypeError("Expected an array");
} catch (error) {
  console.log(error.name);
} finally {
  busy = false;
}
console.log(busy);
```

Expected output:

```text
TypeError
false
```

Cleanup executes even when the main operation fails.

## Common pitfalls

- A return or throw in finally can replace the original result or error.
- A surrounding synchronous try does not catch a timer callback that throws later.
- Do not convert every failure into an empty success value; callers may need to react.

## Related topics

- [Promises and error propagation](promises.md)
- [Async functions and await](async-await.md)
- [Functions & parameter contracts](functions.md)

## Linked lessons

- Lesson 4: Decisions & Defensive Control Flow
- Lesson 6: Scope, Errors & Small Programs
- Lesson 9: Functions & API Contracts
- Lesson 14: Classes with Clear Invariants
- Lesson 22: Promises & Failure Semantics
- Lesson 33: HTTP Services & Trust Boundaries

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §5.5.6 — PDF page 231 (file page index, not printed numbering).
- §5.5.7 — PDF page 232 (file page index, not printed numbering).

