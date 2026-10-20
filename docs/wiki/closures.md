# Closures & private state

Keep state alive without making it global.

## Essential rule

A function retains access to the lexical bindings where it was created, even after that outer call returns.

Each invocation of a factory can create separate private state. Functions returned from the same invocation share those bindings. This supports counters, configurable predicates, and small services with a controlled interface.

The retained binding is live: later changes are visible to closures that use it. This is why callbacks created in a loop need the right scope, and why an event listener can keep data reachable until it is removed.

## When to use it

- Creating independent counters or configuration-specific validators.
- Injecting dependencies into a function without global variables.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const first = makeCounter();
const second = makeCounter();
console.log(first(), first(), second());
```

Expected output:

```text
1 2 1
```

The first two calls share one binding; the second factory call creates another.

## Common pitfalls

- Capturing a variable does not freeze its value.
- Multiple returned functions can share state and affect each other.
- A long-lived callback can retain objects you no longer intended to keep.

## Related topics

- [Scope, const, let & closures](scope.md)
- [Functions & parameter contracts](functions.md)
- [this, methods & bind](this.md)

## Linked lessons

- Lesson 6: Scope, Errors & Small Programs
- Lesson 10: Closures & Higher-Order Functions
- Lesson 11: Parameters, Context & Composition
- Lesson 18: Architecture Studio

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §8.6 — PDF page 376 (file page index, not printed numbering).

