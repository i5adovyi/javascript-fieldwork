# Choose map, filter, find or reduce

Choose a collection operation by the result you need.

## Essential rule

map transforms, filter selects, find retrieves one match, some/every answer a question, and reduce combines.

A map callback must return the new element. filter keeps elements whose predicate returns a truthy value. find stops at the first match and returns undefined if none exists. some stops on the first passing element; every stops on the first failure.

Give reduce an initial accumulator so empty input has a defined result. These methods do not automatically protect nested data: a callback that mutates an input object still changes that object. Use for...of when early exit or sequential async work is central.

## When to use it

- Extracting names from failed test results.
- Calculating a total with an explicit empty-input result.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const runs = [{name: "login", ms: 8, passed: true}, {name: "pay", ms: 12, passed: false}];
const failed = runs.filter(run => !run.passed).map(run => run.name);
const total = runs.reduce((sum, run) => sum + run.ms, 0);
console.log(JSON.stringify(failed));
console.log(total);
console.log([].every(Boolean));
```

Expected output:

```text
["pay"]
20
true
```

Each operation expresses a separate question: which failed, how long they took, and whether all empty inputs pass.

## Common pitfalls

- every on an empty array returns true; check length separately if at least one item is required.
- map(parseInt) accidentally passes the array index as the radix; wrap the call.
- map with an async callback returns promises; collect them with Promise.all when appropriate.

## Related topics

- [Arrays, holes & mutation](arrays.md)
- [Functions & parameter contracts](functions.md)
- [Running asynchronous tasks concurrently](promise-concurrency.md)

## Linked lessons

- Lesson 5: Loops, Collections & Invariants
- Lesson 8: Arrays as Data Pipelines
- Lesson 10: Closures & Higher-Order Functions
- Lesson 12: Data Modeling Studio

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §7.8.1 — PDF page 311 (file page index, not printed numbering).

