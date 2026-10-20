# Strings & Unicode

Transform text without confusing code units with visible characters.

## Essential rule

String methods return new strings; length and indexes count UTF-16 code units.

Use trim, includes, startsWith, slice, and template literals for straightforward text work. Keep the returned value: calling trim() alone does not change the original string.

A Unicode character can occupy two UTF-16 code units. Iterating a string with for...of or spread handles code points, but even code points are not always complete visual characters: accents and emoji sequences can combine multiple code points.

## When to use it

- Cleaning user input before validation.
- Comparing imported names or debugging unexpected string lengths.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const raw = "  Ready  ";
const cleaned = raw.trim().toLowerCase();
console.log(cleaned);
console.log(raw.length);
console.log("😀".length);
console.log([..."😀"].length);
```

Expected output:

```text
ready
9
2
1
```

The input stays intact. The emoji occupies two code units but one code point.

## Common pitfalls

- Indexing or slicing can split a surrogate pair.
- Visually identical text may have different Unicode representations; normalize when your comparison contract requires it.
- Lowercasing is not a universal substitute for locale-aware text comparison.

## Related topics

- [Regular expressions](regex.md)
- [Equality & explicit conversion](equality-coercion.md)

## Linked lessons

- Lesson 2: Values, Types & Identity
- Lesson 20: Text, Dates & Internationalization

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §3.3 — PDF page 86 (file page index, not printed numbering).
- §3.3.3 — PDF page 91 (file page index, not printed numbering).

