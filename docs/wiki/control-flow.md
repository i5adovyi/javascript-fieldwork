# Conditions & choosing a loop

Make decisions explicit and select the right iteration behavior.

## Essential rule

Use for...of for iterable values; use Object.entries with for...of for own enumerable string-keyed properties.

Guard clauses let a function reject invalid or irrelevant input early. For branches, if/else chooses one path; switch selects a case by strict equality and continues through later cases unless control exits.

Use a regular loop when you need break, continue, or sequential await. for...in enumerates string property names, including inherited enumerable properties, so it is usually a poor choice for processing array values.

## When to use it

- Finding the first failing check and stopping immediately.
- Processing the entries of a configuration object.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const results = [{name: "login", ok: true}, {name: "checkout", ok: false}];
let failed = "none";
for (const result of results) {
  if (result.ok) continue;
  failed = result.name;
  break;
}
console.log(failed);
```

Expected output:

```text
checkout
```

The loop skips passing checks and exits at the first failure.

## Common pitfalls

- A switch case without break or return can fall through.
- forEach has no ordinary break and does not wait for an async callback.
- An empty array is truthy; use its length to test whether it has elements.

## Related topics

- [Choose map, filter, find or reduce](array-methods.md)
- [Iterators and generators](iterators.md)
- [Async functions and await](async-await.md)

## Linked lessons

- Lesson 4: Decisions & Defensive Control Flow
- Lesson 5: Loops, Collections & Invariants
- Lesson 6: Scope, Errors & Small Programs
- Lesson 21: Iterators & Generators

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §5.3 — PDF page 202 (file page index, not printed numbering).
- §5.4.4 — PDF page 215 (file page index, not printed numbering).

