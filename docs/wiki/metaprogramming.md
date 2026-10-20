# Property descriptors and object behavior

Inspect property rules, constrain object mutation, and understand where Proxy and Reflect fit.

## Essential rule

A property descriptor controls whether a property can change, appear in enumeration, or be reconfigured.

Data descriptors combine value with writable, enumerable, and configurable flags. Accessor descriptors use get and set instead of value and writable. Object.getOwnPropertyDescriptor inspects an own property; Object.defineProperty creates or changes one. When defining a new property, omitted flags default to false.

Object.preventExtensions blocks new own properties; seal additionally prevents deletion and reconfiguration; freeze also makes own data properties non-writable. These operations are shallow. Proxy intercepts operations such as reads and writes through handler methods. Reflect provides corresponding operations and is useful for forwarding behavior from a Proxy handler to its target.

## When to use it

- Expose a stable read-only field while keeping other record properties editable.
- Inspect an unfamiliar object's behavior or implement focused library instrumentation.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const run = { status: "pending" };
Object.defineProperty(run, "id", {
  value: "run-17",
  enumerable: true,
  writable: false,
  configurable: false
});
console.log(Reflect.set(run, "id", "run-18"));
console.log(run.id);
console.log(Reflect.set(run, "status", "passed"));
console.log(run.status);
```

Expected output:

```text
false
run-17
true
passed
```

Reflect.set reports that the read-only ID cannot change. The ordinary status property remains writable.

## Common pitfalls

- A non-enumerable field is still readable; hiding it from Object.keys is not privacy.
- Freezing an object does not recursively freeze nested objects.
- Proxy traps must respect object invariants; interception is not unrestricted rewriting.

## Related topics

- [Object properties & safe updates](objects.md)
- [Classes, prototypes & composition](classes.md)
- [Iterators and generators](iterators.md)

## Linked lessons

- Lesson 13: Prototypes & the Object Model
- Lesson 34: Metaprogramming with Restraint

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §14.1 — PDF page 665 (file page index, not printed numbering).
- §14.2 — PDF page 673 (file page index, not printed numbering).
- §14.6 — PDF page 695 (file page index, not printed numbering).
- §14.7 — PDF page 699 (file page index, not printed numbering).

