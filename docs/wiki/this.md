# this, methods & bind

Keep the intended receiver when passing a method as a callback.

## Essential rule

For an ordinary function, the call form determines this. Arrow functions inherit this from their enclosing context.

Calling object.method() uses object as the receiver. Saving object.method in a variable and calling it as a plain function loses that receiver. In strict mode, a plain call has undefined as this.

bind creates a new function with a fixed receiver and optional leading arguments. call and apply invoke immediately with a chosen receiver. A small arrow wrapper can also preserve access to an object by explicitly making a method call.

## When to use it

- Passing an instance method to a callback API.
- Explaining why a method works directly but fails in an event handler.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const reporter = {
  prefix: "PASS",
  format(name) { return `${this.prefix}: ${name}`; }
};
const report = reporter.format.bind(reporter);
console.log(["login", "cart"].map(report).join(" | "));
```

Expected output:

```text
PASS: login | PASS: cart
```

The bound method keeps its receiver when Array.map invokes it.

## Common pitfalls

- An arrow used as an object-literal method does not acquire that object as this.
- bind cannot replace an arrow function’s lexical this.
- Repeated bind calls create different function objects; retain the bound function if you must remove it as a listener.

## Related topics

- [Closures & private state](closures.md)
- [Classes, prototypes & composition](classes.md)
- [Events: listeners, bubbling, and delegation](events.md)

## Linked lessons

- Lesson 9: Functions & API Contracts
- Lesson 11: Parameters, Context & Composition
- Lesson 14: Classes with Clear Invariants
- Lesson 27: Events, Forms & Accessibility

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §8.2.2 — PDF page 350 (file page index, not printed numbering).
- §8.7.5 — PDF page 389 (file page index, not printed numbering).

