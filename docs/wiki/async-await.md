# Async functions and await

Write asynchronous control flow with familiar returns, loops, and try/catch.

## Essential rule

An async function always returns a Promise. await suspends that function until a value is available.

An async function begins running immediately and continues until its first await or completion. Awaiting a fulfilled Promise yields its value; awaiting a rejected Promise throws its reason at that expression. Other work can continue while the function is suspended. await also accepts plain values and resumes asynchronously.

Use try/catch around awaited operations to handle their failures and finally for cleanup. Await belongs inside an async function or at the top level of an ES module. Sequential awaits are appropriate when later work depends on earlier results. For independent operations, call them before waiting and combine their Promises with Promise.all.

## When to use it

- Express a sequence such as load, validate, transform, then save.
- Use ordinary loops and exception handling around asynchronous operations.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
async function runCheck() {
  console.log("started");
  const result = await Promise.resolve("passed");
  console.log(result);
  return result.toUpperCase();
}
const pending = runCheck();
console.log("caller continues");
console.log(await pending);
```

Expected output:

```text
started
caller continues
passed
PASSED
```

Execution starts at the call. await yields control to the caller, and the final returned string fulfills the function's Promise.

## Common pitfalls

- Calling an async function gives you a Promise, even when it returns a plain number.
- Array.forEach does not await async callbacks; choose a loop or Promise.all with map.
- try/catch cannot catch a later rejection from an unawaited, unreturned Promise.

## Related topics

- [Promises and error propagation](promises.md)
- [Running asynchronous tasks concurrently](promise-concurrency.md)
- [Errors & cleanup](errors.md)
- [Modules & explicit dependencies](modules.md)

## Linked lessons

- Lesson 23: Async Workflows & Concurrency
- Lesson 24: Resilient Data Pipeline Studio
- Lesson 25: The Browser Execution Model

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §13.3.1 — PDF page 647 (file page index, not printed numbering).
- §13.3.2 — PDF page 648 (file page index, not printed numbering).
- §13.3.3 — PDF page 649 (file page index, not printed numbering).

