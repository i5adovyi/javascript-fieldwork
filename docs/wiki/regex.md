# Regular expressions

Validate simple text shapes, extract fields, and replace repeated patterns.

## Essential rule

Choose test for a boolean, matchAll for repeated captures, and replace for a transformation.

A literal such as /QA-\d+/ describes a pattern rather than a fixed string. Character classes select possible characters; quantifiers control repetition; parentheses capture fields. Anchors constrain match positions. Flags modify behavior: i ignores case, g finds repeated matches, and u enables Unicode-aware pattern processing.

matchAll returns an iterator of match arrays. Index 0 contains the full match and subsequent indexes contain captured groups; named groups are available through groups. A regex argument to matchAll must have the g flag. For a replacement, pass a callback when the replacement needs a calculation or conditional logic.

## When to use it

- Extract consistently formatted IDs from logs or issue descriptions.
- Normalize whitespace or validate a small, clearly defined text format.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const log = "QA-42 passed; QA-73 failed";
const ids = [...log.matchAll(/QA-(\d+)/g)]
  .map(match => Number(match[1]));
console.log(JSON.stringify(ids));
const normalized = "  run   tests  ".trim().replace(/\s+/g, " ");
console.log(normalized);
console.log(/^QA-\d+$/.test("QA-42"));
```

Expected output:

```text
[42,73]
run tests
true
```

The capture extracts only each numeric ID. A separate global pattern collapses whitespace without altering the original string.

## Common pitfalls

- test and exec mutate lastIndex on g or y patterns; reuse can change later results.
- RegExp constructor strings require escaped backslashes, such as "\\d+".
- Patterns can match substrings; choose anchors deliberately when validating complete input.

## Related topics

- [Values, identity & mutation](values-types.md)
- [Iterators and generators](iterators.md)
- [Arrays, holes & mutation](arrays.md)

## Linked lessons

- Lesson 20: Text, Dates & Internationalization

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §11.3.1 — PDF page 504 (file page index, not printed numbering).
- §11.3.2 — PDF page 523 (file page index, not printed numbering).
- §11.3.3 — PDF page 530 (file page index, not printed numbering).

