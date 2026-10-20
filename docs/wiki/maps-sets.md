# Maps and sets

Deduplicate values with Set and associate arbitrary keys with values using Map.

## Essential rule

Use Set for unique membership and Map for keyed lookup. Both iterate in insertion order.

Set stores each value once. Use add, has, and delete to change or query membership; size reports the count. Map stores one value per key. Calling set again with the same key updates its value. Iterating a Map produces [key, value] pairs, ready for destructuring.

Objects used as keys or members are compared by reference, so two separately created objects remain distinct even if their fields match. Primitive comparison follows SameValueZero: NaN matches itself and positive and negative zero are equivalent. Use has when a Map may legitimately store undefined, because get alone cannot distinguish that value from a missing key.

## When to use it

- Remove duplicate tags or track which record IDs have already been processed.
- Count outcomes, cache results, or associate metadata with object identities.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const outcomes = ["pass", "fail", "pass"];
const unique = new Set(outcomes);
const counts = new Map();
for (const outcome of outcomes) {
  counts.set(outcome, (counts.get(outcome) ?? 0) + 1);
}
console.log(JSON.stringify([...unique]));
console.log(JSON.stringify([...counts]));
console.log(counts.has("skipped"));
```

Expected output:

```text
["pass","fail"]
[["pass",2],["fail",1]]
false
```

The Set removes repeated outcomes while the Map counts them. Both retain the order in which each distinct key first appeared.

## Common pitfalls

- map[key] creates an ordinary object property; use map.set(key, value).
- A fresh object literal cannot retrieve an entry keyed by another object.
- Spreading a Map produces pairs, not just values; use map.values() when needed.

## Related topics

- [Object properties & safe updates](objects.md)
- [Arrays, holes & mutation](arrays.md)
- [Iterators and generators](iterators.md)
- [Equality & explicit conversion](equality-coercion.md)

## Linked lessons

- Lesson 19: The Standard Library Toolkit

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §11.1.1 — PDF page 481 (file page index, not printed numbering).
- §11.1.2 — PDF page 485 (file page index, not printed numbering).

- [ECMAScript: Set objects](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set-objects)
