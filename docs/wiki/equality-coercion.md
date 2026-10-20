# Equality & explicit conversion

Compare values without hiding type mismatches.

## Essential rule

Use === for routine comparisons, and convert external inputs deliberately at the boundary.

Strict equality compares without type coercion. Loose equality can convert operands, so values such as a numeric string and a number may compare equal even when a type mismatch would be useful to detect.

Equality is a choice of contract: object identity, selected property values, and deep structural equality are different questions. For an ID read from a form, decide whether its representation is a string or a number before comparing it to stored IDs.

## When to use it

- Comparing form input with a numeric value.
- Writing assertions that should detect incorrect result types.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const input = "12";
console.log(input === 12);
console.log(Number(input) === 12);
console.log(Boolean([]));
console.log({ id: 12 } === { id: 12 });
```

Expected output:

```text
false
true
true
false
```

The comparisons make type conversion and object identity visible.

## Common pitfalls

- Two distinct objects are never === merely because their contents match.
- NaN === NaN is false; use Number.isNaN. Object.is distinguishes signed zero and considers NaN equal to itself.
- Truthy does not mean equal to true; empty arrays and empty objects are truthy.

## Related topics

- [Values, identity & mutation](values-types.md)
- [Defaults & optional chaining](operators.md)
- [Numbers, NaN & precision](numbers.md)

## Linked lessons

- Lesson 2: Values, Types & Identity
- Lesson 3: Expressions That Tell the Truth

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §3.9.1 — PDF page 110 (file page index, not printed numbering).
- §4.9.1 — PDF page 166 (file page index, not printed numbering).

