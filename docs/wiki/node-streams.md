# Node streams: process chunks with backpressure

Process large or ongoing inputs incrementally instead of buffering the entire dataset.

## Essential rule

Let a pipeline coordinate flow and errors; when writing manually, respect the writable stream’s backpressure.

Readable streams produce chunks; writable streams consume them. Duplex streams do both, and transform streams turn incoming data into outgoing data. Byte streams usually deliver Buffers; decoded streams deliver strings. Chunk boundaries are arbitrary and do not necessarily match lines, characters, or application records.

When write returns false, pause further writes until drain or failure. This prevents a fast producer from filling memory behind a slow consumer. For this project’s Node 20 runtime, await pipeline from node:stream/promises to coordinate backpressure and failures. Use for await for sequential consumption that needs custom per-chunk logic.

## When to use it

- Copy, compress, or transform large files with bounded buffering.
- Consume logs or network responses as data arrives.

## Practical example

Runtime: Node 20+, saved as .mjs.

```javascript
import { Readable, Writable } from "node:stream";
import { pipeline } from "node:stream/promises";

let totalBytes = 0;
const sink = new Writable({
  write(chunk, encoding, done) {
    totalBytes += chunk.length;
    done();
  },
});
await pipeline(
  Readable.from([Buffer.from("QA"), Buffer.from(" ready")]),
  sink
);
console.log(totalBytes);
```

Expected output:

```text
8
```

The in-memory source sends two chunks to a writable destination. Counting bytes avoids retaining the input, and the awaited pipeline finishes only after the destination completes.

## Common pitfalls

- A stream stops being memory efficient if you collect every chunk.
- Plain pipe does not provide pipeline’s complete error coordination.
- Splitting each chunk on newline loses records spanning two chunks.

## Related topics

- [Node files: await I/O and resolve paths deliberately](node-files.md)
- [Iterators and generators](iterators.md)
- [Async functions and await](async-await.md)
- [Errors & cleanup](errors.md)

## Linked lessons

- Lesson 32: Files, Streams & Backpressure
- Lesson 36: Capstone: Ship Your JavaScript System

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §16.5 — PDF page 1016 (file page index, not printed numbering).
- §16.5.1 — PDF page 1020 (file page index, not printed numbering).
- §16.5.2 — PDF page 1024 (file page index, not printed numbering).
- §16.5.3 — PDF page 1026 (file page index, not printed numbering).

Edition note: The book demonstrates callback-era stream APIs. This example uses the promise-based pipeline available in the project’s Node 20+ baseline.

- [Node: stream.pipeline](https://nodejs.org/api/stream.html#streampipelinesource-transforms-destination-callback)
