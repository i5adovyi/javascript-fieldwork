# Defaults & optional chaining

Read optional data and apply defaults while preserving valid falsy values.

## Essential rule

Use ?? for null or undefined defaults; use ?. only where a missing value is an expected case.

The operators && and || short-circuit and return an operand, which is not necessarily a boolean. || chooses a fallback for all falsy values, including 0, false, and the empty string. ?? chooses its fallback only for null and undefined.

Optional chaining stops a continuous property-access chain when its guarded receiver is nullish. It does not validate the type of the data, and it does not turn an undeclared identifier into a defined one.

## When to use it

- Applying defaults to an API response or optional settings.
- Reading a nested property that may legitimately be absent.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const options = { retries: 0, user: null };
console.log(options.retries ?? 2);
console.log(options.retries || 2);
console.log(options.user?.name ?? "Guest");
```

Expected output:

```text
0
2
Guest
```

Nullish defaults preserve zero; optional chaining makes the missing user explicit.

## Common pitfalls

- A zero timeout may be deliberate; replacing it with || changes its meaning.
- Place guards at the levels that may be missing: value?.profile?.name.
- Mixing ?? directly with && or || requires parentheses.

## Related topics

- [Equality & explicit conversion](equality-coercion.md)
- [Object properties & safe updates](objects.md)
- [Functions & parameter contracts](functions.md)

## Linked lessons

- Lesson 3: Expressions That Tell the Truth
- Lesson 4: Decisions & Defensive Control Flow
- Lesson 7: Objects as Models
- Lesson 11: Parameters, Context & Composition

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §4.4.1 — PDF page 141 (file page index, not printed numbering).
- §4.10 — PDF page 174 (file page index, not printed numbering).
- §4.13.2 — PDF page 188 (file page index, not printed numbering).

