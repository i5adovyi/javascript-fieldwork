# JSON serialization

Convert portable data to text and reconstruct it without confusing JSON with arbitrary JavaScript objects.

## Essential rule

Use JSON.stringify to encode and JSON.parse to decode; validate the decoded data before using it.

JSON represents strings, finite numbers, booleans, null, arrays, and objects with string keys. Parsing reconstructs data, not class instances or their methods. JSON syntax requires double-quoted keys and strings and excludes comments and trailing commas. A successful parse confirms valid syntax, not the shape your application expects.

A stringify replacer can select or transform values. A parse reviver can transform the resulting values, including reconstructing dates when your schema identifies a date field. Date serialization normally produces a string. Use JSON.stringify(value, null, 2) for readable output, and define explicit conversions for richer types such as Map or Set.

## When to use it

- Save application settings in storage or exchange a small API payload.
- Produce readable test fixtures with an explicit, predictable schema.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const run = { name: "smoke", passed: true, note: undefined };
const text = JSON.stringify(run);
const parsed = JSON.parse(text);
if (typeof parsed.name !== "string" || typeof parsed.passed !== "boolean") {
  throw new TypeError("Invalid run record");
}
console.log(text);
console.log(parsed.name);
console.log(Object.hasOwn(parsed, "note"));
```

Expected output:

```text
{"name":"smoke","passed":true}
smoke
false
```

Serialization omits the undefined property. After parsing, field checks enforce the expected record shape.

## Common pitfalls

- JSON round trips are not general deep cloning: dates, methods, and prototypes change.
- undefined object properties disappear; undefined array elements become null.
- Circular references and unsupported BigInt values throw during serialization.

## Related topics

- [Object properties & safe updates](objects.md)
- [Dates, timestamps, and UTC](dates.md)
- [Fetch: check the response, then read the body](fetch.md)
- [Browser storage: persist small preferences](browser-storage.md)
- [Errors & cleanup](errors.md)

## Linked lessons

- Lesson 19: The Standard Library Toolkit
- Lesson 24: Resilient Data Pipeline Studio
- Lesson 28: Fetch, Storage & State
- Lesson 33: HTTP Services & Trust Boundaries

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §11.6 — PDF page 545 (file page index, not printed numbering).
- §11.6.1 — PDF page 548 (file page index, not printed numbering).

Edition note: Object.hasOwn is newer than the 2020 edition; it is supported by the modern browser and Node baseline used here.

- [MDN: Object.hasOwn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn)
