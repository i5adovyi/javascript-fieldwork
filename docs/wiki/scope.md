# Scope, const, let & closures

Identify which binding a name refers to and when it becomes usable.

## Essential rule

let and const are block scoped; var is scoped to its function or script rather than a loop block.

A binding declared with let or const cannot be accessed before its declaration is initialized. This interval is called the temporal dead zone. Declaring the same name in a nested block creates a separate binding and shadows the outer one.

A for loop using let gives callbacks a distinct loop binding for each iteration. With var, callbacks share the same function-scoped binding and usually see its final value when called later.

## When to use it

- Creating callbacks inside a loop.
- Reducing accidental changes and debugging shadowed names.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const callbacks = [];
for (let index = 0; index < 3; index++) {
  callbacks.push(() => index);
}
console.log(JSON.stringify(callbacks.map(read => read())));
```

Expected output:

```text
[0,1,2]
```

Each callback closes over its own iteration binding.

## Common pitfalls

- const objects can still be mutated.
- Moving a declaration lower in a block can make earlier reads throw even if an outer variable has the same name.
- A closure retains access to bindings, not a frozen snapshot of all values.

## Related topics

- [Closures & private state](closures.md)
- [Values, identity & mutation](values-types.md)
- [Modules & explicit dependencies](modules.md)

## Linked lessons

- Lesson 2: Values, Types & Identity
- Lesson 5: Loops, Collections & Invariants
- Lesson 6: Scope, Errors & Small Programs
- Lesson 10: Closures & Higher-Order Functions
- Lesson 16: Modules & Public Interfaces

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §3.10 — PDF page 122 (file page index, not printed numbering).

