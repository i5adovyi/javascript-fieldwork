# Language vs. runtime

Know which capabilities come from JavaScript and which come from its host.

## Essential rule

JavaScript defines the language; the browser or Node supplies the surrounding APIs.

Arrays, functions, objects, and promises are language features. The document object belongs to a browser page; filesystem access belongs to Node. A worker can run JavaScript without having access to the page DOM.

Keep calculations and data transformations in functions that receive inputs and return outputs. Put DOM access, files, and network operations at the boundary. This makes the same core behavior easier to reuse and test.

## When to use it

- Diagnosing “document is not defined” in a Node program.
- Sharing validation or transformations between a UI and a script.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
function passedCount(results) {
  return results.filter(result => result.passed).length;
}
console.log(passedCount([{passed: true}, {passed: false}]));
```

Expected output:

```text
1
```

This calculation has no dependency on a page or filesystem. A browser or Node can provide its inputs.

## Common pitfalls

- A shared language does not mean every global API exists in every runtime.
- Running a file and typing an expression into a console can display results differently; use console.log for explicit output.
- Code that performs I/O as soon as it is imported is harder to test in isolation.

## Related topics

- [Modules & explicit dependencies](modules.md)
- [Functions & parameter contracts](functions.md)
- [Tests, linting, and formatting](testing-tools.md)

## Linked lessons

- Lesson 1: The JavaScript Workbench
- Lesson 25: The Browser Execution Model
- Lesson 31: Node.js & Command-Line Programs

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §1.1 — PDF page 41 (file page index, not printed numbering).
- §1.3 — PDF page 44 (file page index, not printed numbering).

