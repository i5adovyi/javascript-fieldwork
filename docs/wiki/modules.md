# Modules & explicit dependencies

Split code into files with small, intentional public interfaces.

## Essential rule

Export the capabilities callers need; import dependencies explicitly in the files that use them.

An ES module has its own top-level scope and runs in strict mode. Named imports match exported names; a default import uses the name chosen by the importing file. Imports refer to live exported bindings and cannot be reassigned by the importer.

Use static imports for regular dependencies and dynamic import() when code should load conditionally; dynamic import returns a promise. In browser HTML, load the entry point with type="module" and serve the files over HTTP. The project already uses ES modules.

## When to use it

- Extracting a pure helper so both UI and tests can use it.
- Loading an optional feature only when it is needed.

## Practical example

Runtime: Two separate ES module files.

```javascript
// summary.mjs
export const total = values => values.reduce((sum, value) => sum + value, 0);

// app.mjs (a separate file)
import { total } from "./summary.mjs";
console.log(total([3, 5, 8]));
```

Expected output:

```text
16
```

Save the two files side by side and run node app.mjs, or load app.mjs as a browser module.

## Common pitfalls

- Named and default imports use different syntax.
- Circular dependencies can access bindings before initialization; simplify the dependency direction.
- Browser module paths need resolvable URLs; a bare package name requires additional resolution support.

## Related topics

- [Functions & parameter contracts](functions.md)
- [Language vs. runtime](runtime.md)
- [Classes, prototypes & composition](classes.md)

## Linked lessons

- Lesson 16: Modules & Public Interfaces
- Lesson 17: Dependency Design & Boundaries
- Lesson 18: Architecture Studio
- Lesson 31: Node.js & Command-Line Programs
- Lesson 35: Tooling, Testing & Delivery
- Lesson 36: Capstone: Ship Your JavaScript System

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §10.3 — PDF page 458 (file page index, not printed numbering).
- §10.3.1 — PDF page 460 (file page index, not printed numbering).
- §10.3.2 — PDF page 462 (file page index, not printed numbering).

