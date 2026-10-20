# Classes, prototypes & composition

Group state and behavior without losing sight of prototype lookup.

## Essential rule

Class methods are shared through the prototype; constructor assignments create instance state.

Property lookup checks the instance and then its prototype chain. A class gives this pattern a clear syntax. Static methods belong to the constructor, so call them on the class rather than on an instance.

Use inheritance when a subtype can honor the parent’s contract. If you only need another object’s capability, composition lets your object hold that collaborator and delegate work to it. This avoids tying unrelated features into a rigid hierarchy.

## When to use it

- Creating several independent instances with shared behavior.
- Choosing between extending a class and injecting a collaborator.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
class RunSummary {
  constructor(name) { this.name = name; }
  label() { return `Run: ${this.name}`; }
}
const first = new RunSummary("smoke");
const second = new RunSummary("full");
console.log(first.label());
console.log(first.label === second.label);
```

Expected output:

```text
Run: smoke
true
```

The two instances store different names but resolve label to the same prototype method.

## Common pitfalls

- Methods are not automatically bound to instances.
- A derived constructor must call super before accessing this.
- Freezing an instance is shallow and does not automatically freeze nested state.

## Related topics

- [Object properties & safe updates](objects.md)
- [this, methods & bind](this.md)
- [Modules & explicit dependencies](modules.md)

## Linked lessons

- Lesson 13: Prototypes & the Object Model
- Lesson 14: Classes with Clear Invariants
- Lesson 15: Inheritance & Composition
- Lesson 18: Architecture Studio

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §9.3 — PDF page 416 (file page index, not printed numbering).
- §9.5.3 — PDF page 437 (file page index, not printed numbering).

