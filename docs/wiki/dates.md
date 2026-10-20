# Dates, timestamps, and UTC

Represent instants consistently and separate elapsed durations from calendar calculations.

## Essential rule

Use explicit time zones for instants, milliseconds for elapsed durations, and UTC output for reproducible examples.

A Date stores an instant as milliseconds relative to the Unix epoch. getTime exposes that number; toISOString formats it in UTC with a trailing Z. The local and UTC getter families interpret the same instant differently. Dates do not retain the original input time-zone name.

Subtract timestamps to measure an elapsed duration. Calendar operations are different: a month has a variable length, and a local day can cross a daylight-saving change. Date setters mutate the object and normalize overflowing fields. Clone with new Date(existing.getTime()) before changing a date that other code still needs.

## When to use it

- Record run start and finish times in logs using a portable UTC representation.
- Calculate elapsed time or compare deadlines represented as explicit instants.

## Practical example

Runtime: Browser or Node (wrap await in an async function if needed).

```javascript
const started = new Date("2026-04-08T10:00:00Z");
const finished = new Date("2026-04-08T10:01:30Z");
const seconds = (finished.getTime() - started.getTime()) / 1000;
const deadline = new Date(finished.getTime());
deadline.setUTCMinutes(deadline.getUTCMinutes() + 5);
console.log(seconds);
console.log(deadline.toISOString());
console.log(finished.toISOString());
```

Expected output:

```text
90
2026-04-08T10:06:30.000Z
2026-04-08T10:01:30.000Z
```

The elapsed duration is 90 seconds. Updating the cloned deadline leaves the original finish time unchanged.

## Common pitfalls

- Numeric constructors and Date.UTC use zero-based months: January is 0.
- getDay returns the weekday; getDate returns the day of the month.
- Ambiguous date strings can parse differently; invalid input produces an invalid Date.

## Related topics

- [JSON serialization](json.md)
- [Defaults & optional chaining](operators.md)
- [Tests, linting, and formatting](testing-tools.md)

## Linked lessons

- Lesson 20: Text, Dates & Internationalization

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §11.4 — PDF page 536 (file page index, not printed numbering).
- §11.4.1 — PDF page 538 (file page index, not printed numbering).
- §11.4.2 — PDF page 539 (file page index, not printed numbering).
- §11.4.3 — PDF page 540 (file page index, not printed numbering).

