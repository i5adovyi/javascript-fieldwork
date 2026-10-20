# Arrays, holes & mutation

Handle collection length, copies, removals, and sorting deliberately.

## Essential rule

Array length is an index boundary, not a guarantee that every position contains an element.

A hole is an absent property at an array index. Assigning a distant index, constructing new Array(n), or deleting an indexed property can create holes. Several iteration methods skip them, making sparse data easy to misunderstand.

slice and spread create shallow copies. splice changes the input array, as do sort, reverse, push, and pop. To sort while preserving the input with the book’s APIs, first copy it and then pass a numeric comparator when sorting numbers.

## When to use it

- Sorting result durations without rearranging the original results.
- Removing one item while maintaining a dense array.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const durations = [30, 4, 12];
const sorted = [...durations].sort((a, b) => a - b);
console.log(JSON.stringify(sorted));
console.log(JSON.stringify(durations));
const holes = new Array(3);
console.log(holes.length, Object.keys(holes).length);
```

Expected output:

```text
[4,12,30]
[30,4,12]
3 0
```

A copied array protects the original order. The sparse array has a length but no indexed elements.

## Common pitfalls

- delete items[index] leaves a hole and does not reduce length; splice removes and shifts.
- sort() without a comparator compares string representations.
- Array copies still refer to the same contained objects.

## Related topics

- [Choose map, filter, find or reduce](array-methods.md)
- [Values, identity & mutation](values-types.md)
- [Iterators and generators](iterators.md)

## Linked lessons

- Lesson 8: Arrays as Data Pipelines
- Lesson 12: Data Modeling Studio
- Lesson 26: DOM as a Render Target

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §7.3 — PDF page 302 (file page index, not printed numbering).
- §7.4 — PDF page 303 (file page index, not printed numbering).
- §7.8.6 — PDF page 326 (file page index, not printed numbering).

