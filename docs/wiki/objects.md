# Object properties & safe updates

Distinguish missing properties, inherited properties, and shared nested state.

## Essential rule

Check ownership when it matters, and copy every level you intend to change independently.

Reading a property can find an inherited value through the prototype chain. The in operator includes inherited properties. To test ownership using the book’s APIs, call Object.prototype.hasOwnProperty.call(object, key); this also works when the object has no prototype or shadows that method.

Object spread copies own enumerable properties into a new object. Later properties win. It does not clone the prototype, property descriptors, or nested objects. Use explicit nested copies for a small immutable state update.

## When to use it

- Merging defaults with explicit user settings.
- Updating one nested field while preserving earlier state for comparison.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const before = { profile: { name: "Ada", active: false } };
const after = { ...before, profile: { ...before.profile, active: true } };
console.log(before.profile.active);
console.log(after.profile.active);
console.log(Object.prototype.hasOwnProperty.call(after, "profile"));
```

Expected output:

```text
false
true
true
```

Both the outer record and the changed nested record receive new identities.

## Common pitfalls

- A property whose value is undefined can still exist.
- Object.keys and Object.entries omit inherited, non-enumerable, and symbol-keyed properties.
- Copying only the outer object leaves nested references shared.

## Related topics

- [Values, identity & mutation](values-types.md)
- [Classes, prototypes & composition](classes.md)
- [Property descriptors and object behavior](metaprogramming.md)

## Linked lessons

- Lesson 7: Objects as Models
- Lesson 12: Data Modeling Studio
- Lesson 13: Prototypes & the Object Model
- Lesson 26: DOM as a Render Target
- Lesson 34: Metaprogramming with Restraint

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §6.5 — PDF page 268 (file page index, not printed numbering).
- §6.10.4 — PDF page 284 (file page index, not printed numbering).

