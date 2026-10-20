# Functions & parameter contracts

Make accepted inputs, defaults, outputs, and side effects easy to see.

## Essential rule

Defaults apply to omitted or undefined arguments; they do not replace null or other falsy values.

Destructured parameter objects make named options readable. A default object allows a call with no argument, but explicitly passing null still needs handling if your contract accepts it. Rest parameters gather remaining arguments into an array.

Choose a return value and keep it consistent across branches. A function declaration can be called before its declaration is evaluated; a function expression assigned to const cannot be used before initialization. Arrow functions are convenient callbacks and inherit this from the surrounding scope.

## When to use it

- Designing a helper with optional settings.
- Separating pure calculations from logging, storage, or other effects.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
function describeRun({ name = "untitled", retries = 2 } = {}) {
  return `${name}: ${retries} retries`;
}
console.log(describeRun());
console.log(describeRun({ name: "login", retries: 0 }));
```

Expected output:

```text
untitled: 2 retries
login: 0 retries
```

Defaults cover missing inputs while retaining an explicitly supplied zero.

## Common pitfalls

- Missing return produces undefined.
- Parameter defaults do not validate types or ranges.
- Mutating an object parameter also affects the caller’s object.

## Related topics

- [Defaults & optional chaining](operators.md)
- [this, methods & bind](this.md)
- [Closures & private state](closures.md)

## Linked lessons

- Lesson 9: Functions & API Contracts
- Lesson 11: Parameters, Context & Composition
- Lesson 12: Data Modeling Studio
- Lesson 15: Inheritance & Composition
- Lesson 17: Dependency Design & Boundaries

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §8.1.3 — PDF page 344 (file page index, not printed numbering).
- §8.3.1 — PDF page 357 (file page index, not printed numbering).

