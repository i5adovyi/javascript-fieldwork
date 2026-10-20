# Iterators and generators

Produce and consume values one at a time with the protocol behind for…of and spread.

## Essential rule

An iterable supplies Symbol.iterator; its iterator supplies next(), returning { value, done }.

Arrays, strings, Maps, and Sets implement the iterable protocol. for…of asks for an iterator and repeatedly calls next until done is true. An iterator tracks progress, so consuming it changes what remains. A collection can create a fresh iterator for every traversal.

A function* generator makes this protocol easier to implement. Calling it creates a generator without running its body. Each next resumes execution until yield provides a value or the function finishes. yield* delegates to another iterable. This lets you generate values on demand without allocating the entire sequence first.

## When to use it

- Traverse a custom collection using the same syntax as an array.
- Generate test inputs or process a sequence without building all intermediate arrays.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
function* caseNames(prefix, count) {
  for (let number = 1; number <= count; number++) {
    yield `${prefix}-${number}`;
  }
}
const cases = caseNames("login", 3);
console.log(cases.next().value);
console.log(JSON.stringify([...cases]));
console.log(cases.next().done);
```

Expected output:

```text
login-1
["login-2","login-3"]
true
```

The first next consumes one name. Spread consumes only the remaining names, and the final call reports completion.

## Common pitfalls

- An exhausted generator stays exhausted; call the generator function again to restart.
- Spreading an infinite iterable never completes; stop after a bounded number of items.
- for…in enumerates property names and does not use the iterator protocol.

## Related topics

- [Arrays, holes & mutation](arrays.md)
- [Maps and sets](maps-sets.md)
- [Functions & parameter contracts](functions.md)
- [Conditions & choosing a loop](control-flow.md)

## Linked lessons

- Lesson 21: Iterators & Generators
- Lesson 23: Async Workflows & Concurrency
- Lesson 32: Files, Streams & Backpressure

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §12.1 — PDF page 580 (file page index, not printed numbering).
- §12.2 — PDF page 582 (file page index, not printed numbering).
- §12.3 — PDF page 588 (file page index, not printed numbering).
- §12.3.2 — PDF page 593 (file page index, not printed numbering).

