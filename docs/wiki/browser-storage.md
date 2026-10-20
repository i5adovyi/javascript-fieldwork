# Browser storage: persist small preferences

Choose storage by lifetime and data size, and treat persisted data as fallible input.

## Essential rule

Use Web Storage for small string values; serialize objects explicitly and recover from unavailable or invalid data.

localStorage belongs to an origin and normally survives page reloads and browser restarts. sessionStorage also belongs to a particular top-level tab session. Neither is a guaranteed backup. getItem returns a string or null; setItem and removeItem change one key. Namespace application keys to prevent collisions.

Use JSON.stringify and JSON.parse for simple data, then validate the parsed shape before using it. Web Storage operations are synchronous. IndexedDB is the more suitable asynchronous object-store API for larger collections and indexed lookups. A storage event reports changes to other eligible documents, not the document that made the change.

## When to use it

- Remember a theme, dismissed hint, or small draft.
- Restore lightweight interface state after a page reload.

## Practical example

Runtime: Browser console on the project page.

```javascript
const key = "fieldwork:wiki-storage-demo";
const previous = localStorage.getItem(key);
try {
  localStorage.setItem(key, JSON.stringify({ theme: "dark" }));
  const preferences = JSON.parse(localStorage.getItem(key));
  console.log(preferences.theme);
} finally {
  if (previous === null) localStorage.removeItem(key);
  else localStorage.setItem(key, previous);
}
```

Expected output:

```text
dark
```

Run on a project page where storage is available. The demo restores the original value afterward; production preferences would remain stored and need parsing and validation safeguards.

## Common pitfalls

- Blocked storage, quotas, and invalid JSON can throw; provide defaults.
- Do not put passwords or other secrets in script-accessible storage.
- clear removes every key for that storage area; remove your own key instead.

## Related topics

- [JSON serialization](json.md)
- [Object properties & safe updates](objects.md)
- [Events: listeners, bubbling, and delegation](events.md)
- [Errors & cleanup](errors.md)

## Linked lessons

- Lesson 28: Fetch, Storage & State
- Lesson 30: Browser Application Studio

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §15.12.1 — PDF page 927 (file page index, not printed numbering).
- §15.12.3 — PDF page 938 (file page index, not printed numbering).

- [MDN: Storage.removeItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem)
