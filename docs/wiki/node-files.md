# Node files: await I/O and resolve paths deliberately

Read small files with promise APIs, choose the right path base, and close resources you open.

## Essential rule

Use node:fs/promises for asynchronous file operations; specify an encoding when you want text.

readFile without an encoding returns a Buffer of bytes. With utf8 it returns a decoded string. The operation may reject for missing files, permissions, or other I/O errors; handle the actual operation rather than checking existence first and assuming nothing can change.

Relative string paths resolve from process.cwd(), which can differ from the script directory. In an ES module, new URL("./file.json", import.meta.url) locates a sibling file. readFile manages its own handle. If you open a FileHandle yourself, close it in finally after all awaited work finishes.

## When to use it

- Load a small JSON configuration or text fixture in a Node script.
- Build scripts that must find their assets regardless of the launch directory.

## Practical example

Runtime: Node 20+, saved as .mjs.

```javascript
// Save as inspect-file.mjs and run: node inspect-file.mjs
import { readFile } from "node:fs/promises";

const sourceFile = new URL(import.meta.url);
const sourceText = await readFile(sourceFile, "utf8");
console.log(typeof sourceText);
console.log(sourceText.includes("node:fs/promises"));
```

Expected output:

```text
string
true
```

This Node 20 ES module reads its own saved source without changing any files. Its location comes from import.meta.url, so the current working directory does not affect the read.

## Common pitfalls

- Sync filesystem calls block the event loop while they run.
- readFile loads the whole file into memory; stream large inputs.
- path.normalize cleans up path syntax; it does not resolve filesystem symlinks.

## Related topics

- [Async functions and await](async-await.md)
- [Errors & cleanup](errors.md)
- [Modules & explicit dependencies](modules.md)
- [Node streams: process chunks with backpressure](node-streams.md)

## Linked lessons

- Lesson 31: Node.js & Command-Line Programs
- Lesson 32: Files, Streams & Backpressure

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §16.7 — PDF page 1038 (file page index, not printed numbering).
- §16.7.1 — PDF page 1039 (file page index, not printed numbering).
- §16.7.2 — PDF page 1042 (file page index, not printed numbering).

- [Node 20: File system APIs](https://nodejs.org/docs/latest-v20.x/api/fs.html)
