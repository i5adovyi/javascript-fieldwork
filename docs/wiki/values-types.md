# Values, identity & mutation

Understand why changing one variable can appear to change another.

## Essential rule

Assignment copies a value. For an object, that value is a reference to the same object.

Primitives—undefined, null, booleans, numbers, bigints, strings, and symbols—are immutable. Reassigning a variable changes its binding; it does not mutate the primitive it previously held.

Objects, arrays, and functions have identity. Two separately created objects are not strictly equal even if their properties match. Copying an object with spread creates a new outer object, but nested object references are still shared.

## When to use it

- Updating application state without changing the previous state.
- Explaining why two identical-looking API responses fail an identity comparison.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const original = { settings: { retries: 1 } };
const copy = { ...original };
copy.settings.retries = 3;
console.log(original === copy);
console.log(original.settings.retries);
```

Expected output:

```text
false
3
```

The outer objects differ, but both settings properties refer to one nested object.

## Common pitfalls

- const prevents reassignment, not changes to object properties.
- typeof null is "object"; test null directly. Arrays also report "object"; use Array.isArray.
- A shallow copy is not a recursively independent copy.

## Related topics

- [Object properties & safe updates](objects.md)
- [Equality & explicit conversion](equality-coercion.md)
- [Arrays, holes & mutation](arrays.md)

## Linked lessons

- Lesson 2: Values, Types & Identity
- Lesson 7: Objects as Models
- Lesson 12: Data Modeling Studio

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §3.1 — PDF page 71 (file page index, not printed numbering).
- §3.8 — PDF page 105 (file page index, not printed numbering).

