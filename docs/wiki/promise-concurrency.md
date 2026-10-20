# Running asynchronous tasks concurrently

Choose whether a group of independent operations needs every value, every outcome, or the first outcome.

## Essential rule

Calling the task starts its work; Promise combinators observe the resulting Promises and combine their outcomes.

Promise.all fulfills with values in input order when every input fulfills, or rejects when an input rejects. Promise.allSettled waits for every input and returns ordered status records with value or reason. Use it when successful and failed outcomes both belong in the report.

Promise.race adopts the first settlement, whether fulfillment or rejection. It does not mean first success. Neither race nor all cancels other operations after settling. Cancellation must be supported by the underlying operation, such as an abortable fetch. To limit concurrency, control when tasks are called; combining already-started Promises does not impose a limit.

## When to use it

- Load independent resources together and require all results before proceeding.
- Run several checks and produce a report even when some checks fail.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
async function check(name) {
  if (name === "search") throw new Error("No results");
  return `${name}: passed`;
}
const pending = ["login", "search"].map(check);
const results = await Promise.allSettled(pending);
console.log(JSON.stringify(results.map(result => result.status)));
console.log(results[0].value);
console.log(results[1].reason.message);
```

Expected output:

```text
["fulfilled","rejected"]
login: passed
No results
```

map calls both checks before the await. allSettled preserves both outcomes in the same order as the input checks.

## Common pitfalls

- A timeout implemented with race does not itself stop the operation that loses.
- Sequential await calls delay starting later tasks when calls appear after each await.
- race([]) remains pending; all([]) and allSettled([]) fulfill with empty arrays.

## Related topics

- [Promises and error propagation](promises.md)
- [Async functions and await](async-await.md)
- [Fetch: check the response, then read the body](fetch.md)
- [Choose map, filter, find or reduce](array-methods.md)

## Linked lessons

- Lesson 22: Promises & Failure Semantics
- Lesson 23: Async Workflows & Concurrency
- Lesson 24: Resilient Data Pipeline Studio
- Lesson 29: Browser APIs & Responsive Work

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §13.2.5 — PDF page 634 (file page index, not printed numbering).
- §13.3.3 — PDF page 649 (file page index, not printed numbering).

- [MDN: Promise.all, ordering and rejection behavior](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
