# Syntax, return & line breaks

Avoid invisible behavior changes caused by automatic semicolon insertion.

## Essential rule

Keep the expression returned by a function on the same line as return, or start parentheses there.

Line breaks do not always end JavaScript statements. A following parenthesis or bracket can continue the previous expression. Use a consistent formatting style and explicit statement boundaries.

A newline immediately after return ends that return statement. An object on the next line will not be returned. Arrow functions that return an object expression need parentheses around the object to distinguish it from a function body.

## When to use it

- A function unexpectedly returns undefined.
- Refactoring long expressions across lines.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
function broken() {
  return
  { ready: true };
}
const working = () => ({ ready: true });
console.log(broken());
console.log(working().ready);
```

Expected output:

```text
undefined
true
```

The first function returns before the next line. The arrow explicitly returns an object.

## Common pitfalls

- A newline after throw is a syntax error; do not split throw from its expression.
- An arrow body with braces needs an explicit return unless those braces are wrapped as an object expression.
- A formatter helps keep code consistent, but tests verify what it does.

## Related topics

- [Functions & parameter contracts](functions.md)
- [Conditions & choosing a loop](control-flow.md)

## Linked lessons

- Lesson 1: The JavaScript Workbench
- Lesson 2: Values, Types & Identity
- Lesson 9: Functions & API Contracts

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §2.6 — PDF page 66 (file page index, not printed numbering).

