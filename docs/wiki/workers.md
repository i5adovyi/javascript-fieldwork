# Workers: move CPU work off the interface thread

Keep the interface responsive while a separate worker performs an expensive calculation.

## Essential rule

Send data to a worker, compute there, and send results back; update the DOM on the main thread.

A dedicated worker has its own global scope and event loop. It can run CPU work while the main thread processes input, but it cannot access document or window. postMessage sends data asynchronously, and a message listener receives it through event.data. Use request IDs when multiple jobs may be in flight.

Messages use structured cloning rather than shared ordinary objects. Functions and DOM nodes cannot be cloned. A transferable ArrayBuffer can move ownership instead of copying bytes; the sender loses access to that buffer. Reuse workers for repeated jobs and terminate them when their work is finished.

## When to use it

- Parse large datasets, process pixels, or run expensive calculations.
- Keep typing and interaction responsive during repeated computation.

## Practical example

Runtime: Browser console on the project page.

```javascript
const source = `
  self.onmessage = ({ data }) => {
    self.postMessage(data.reduce((sum, n) => sum + n, 0));
  };
`;
const url = URL.createObjectURL(
  new Blob([source], { type: "text/javascript" })
);
const worker = new Worker(url);
const cleanup = () => {
  worker.terminate();
  URL.revokeObjectURL(url);
};
worker.onmessage = ({ data }) => {
  console.log(data);
  cleanup();
};
worker.onerror = () => { cleanup(); console.error("Worker failed"); };
worker.postMessage([2, 4, 6]);
```

Expected output:

```text
12
```

The tiny calculation illustrates messaging, not a speed improvement. This self-contained demo needs a page that permits blob workers; a real project can use a separate worker script.

## Common pitfalls

- Wrapping CPU work in a promise does not move it off the main thread.
- Copying a huge message has a cost; worker overhead can outweigh small jobs.
- Worker script loading follows origin and Content Security Policy restrictions.

## Related topics

- [Events: listeners, bubbling, and delegation](events.md)
- [Choose map, filter, find or reduce](array-methods.md)
- [Promises and error propagation](promises.md)
- [Running asynchronous tasks concurrently](promise-concurrency.md)

## Linked lessons

- Lesson 29: Browser APIs & Responsive Work

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §15.13 — PDF page 946 (file page index, not printed numbering).
- §15.13.1 — PDF page 948 (file page index, not printed numbering).
- §15.13.2 — PDF page 949 (file page index, not printed numbering).
- §15.13.5 — PDF page 954 (file page index, not printed numbering).

