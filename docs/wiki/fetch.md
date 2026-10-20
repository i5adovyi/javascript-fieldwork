# Fetch: check the response, then read the body

Treat an HTTP request, its status, and its parsed response body as separate steps.

## Essential rule

Await fetch, check response.ok, then await the body reader. Handle failures from all three steps.

fetch resolves once status and headers are available. A 404 or 500 response still fulfills the promise, so your code must turn an unsuccessful status into an application error. Reading JSON is another asynchronous operation and can fail independently, for example when a server returns HTML.

Request options configure method, headers, body, and an AbortSignal. For JSON writes, stringify the payload and set Content-Type to application/json. Use URLSearchParams for query values. Aborting a request can reject the fetch or its unfinished body read; clean up any timeout you created.

## When to use it

- Load remote data into a screen or submit an API request.
- Separate networking from parsing so tests can supply controlled responses.

## Practical example

Runtime: Browser console on the project page.

```javascript
async function readJSON(url, request = fetch) {
  const response = await request(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
// Offline mock: no network request is made.
const mockFetch = async () => new Response(
  JSON.stringify({ pending: 3 }),
  { status: 200, headers: { "Content-Type": "application/json" } }
);
await readJSON("/api/tasks", mockFetch)
  .then((data) => console.log(data.pending))
  .catch(console.error);
```

Expected output:

```text
3
```

The injected request function returns a real Response with a fixed body. Omitting mockFetch uses the browser fetch function against your own API.

## Common pitfalls

- HTTP errors do not automatically enter catch.
- A response body is normally consumed once; clone it before reading twice.
- Cross-origin access needs server CORS permission; mode: no-cors does not unlock readable responses.

## Related topics

- [Async functions and await](async-await.md)
- [Promises and error propagation](promises.md)
- [Errors & cleanup](errors.md)
- [Tests, linting, and formatting](testing-tools.md)

## Linked lessons

- Lesson 28: Fetch, Storage & State
- Lesson 30: Browser Application Studio
- Lesson 33: HTTP Services & Trust Boundaries
- Lesson 36: Capstone: Ship Your JavaScript System

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §15.11.1 — PDF page 897 (file page index, not printed numbering).

