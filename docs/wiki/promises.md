# Promises and error propagation

Compose one eventual result through transformations, failures, and cleanup.

## Essential rule

Return each asynchronous step from then so its result and failure remain part of the chain.

A Promise is pending until it fulfills with a value or rejects with a reason. Once settled, that outcome cannot change. then returns a new Promise: a returned value fulfills it, a thrown error rejects it, and a returned Promise makes it adopt that Promise's outcome.

Promise handlers run asynchronously even if the Promise is already settled. The executor passed to new Promise runs synchronously, so a Promise does not postpone work automatically. catch handles a rejection and can recover by returning a value. finally performs cleanup for either outcome; throwing there or returning a rejected Promise replaces the previous outcome.

## When to use it

- Connect dependent asynchronous steps while keeping one error-handling path.
- Adapt a callback API into a single completion result.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const score = await Promise.resolve(3)
  .then(count => count * 2)
  .then(value => {
    if (value < 10) throw new Error("Below target");
    return value;
  })
  .catch(error => {
    console.log(error.message);
    return 0;
  })
  .finally(() => console.log("Finished"));
console.log(score);
```

Expected output:

```text
Below target
Finished
0
```

The thrown error skips normal fulfillment handling. catch recovers with 0, while finally runs without changing that result.

## Common pitfalls

- A block-bodied then callback needs return to pass its Promise onward.
- A catch that only logs usually turns the chain into a fulfilled undefined result.
- One Promise represents one outcome, so it cannot model a continuing stream of events.

## Related topics

- [Async functions and await](async-await.md)
- [Running asynchronous tasks concurrently](promise-concurrency.md)
- [Errors & cleanup](errors.md)
- [Fetch: check the response, then read the body](fetch.md)

## Linked lessons

- Lesson 22: Promises & Failure Semantics

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §13.2.1 — PDF page 613 (file page index, not printed numbering).
- §13.2.2 — PDF page 617 (file page index, not printed numbering).
- §13.2.3 — PDF page 622 (file page index, not printed numbering).
- §13.2.4 — PDF page 626 (file page index, not printed numbering).
- §13.2.6 — PDF page 636 (file page index, not printed numbering).

