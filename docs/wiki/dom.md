# DOM: find, create, and update elements

Turn data into document elements with selectors, text content, and explicit node operations.

## Essential rule

Select the element you need, check that it exists, and use textContent when inserting plain text.

querySelector returns the first match or null. querySelectorAll returns a static NodeList: it is iterable, but it is not an Array and does not gain newly added matches. Use Array.from when you need array methods. Scope queries to a component root to avoid selecting unrelated page elements.

createElement makes a detached node. Set its content and attributes, then insert it with append, prepend, before, or after. Inserting an existing node moves it instead of copying it. textContent preserves text literally; innerHTML parses markup and replaces the existing child tree.

## When to use it

- Render lists, messages, or validation results from application data.
- Update one component without rebuilding the entire document.

## Practical example

Runtime: Browser console on the project page.

```javascript
const list = document.createElement("ul");
for (const title of ["Review <script>", "Ship fix"]) {
  const item = document.createElement("li");
  item.textContent = title;
  list.append(item);
}
console.log(list.querySelectorAll("li").length);
console.log(list.firstElementChild.textContent);
console.log(list.querySelector("script") === null);
```

Expected output:

```text
2
Review <script>
true
```

The list stays detached, so this changes no visible page. The angle brackets remain text; no script element is created. Append the list to a chosen container when rendering a real interface.

## Common pitfalls

- Dereferencing a missing selector result throws; handle null.
- Untrusted strings in innerHTML can inject executable markup.
- New replacement nodes do not inherit listeners attached to the old nodes. Removed nodes retain their identity and listeners while references keep them reachable, including if they are reinserted.

## Related topics

- [Events: listeners, bubbling, and delegation](events.md)
- [Arrays, holes & mutation](arrays.md)
- [Choose map, filter, find or reduce](array-methods.md)

## Linked lessons

- Lesson 26: DOM as a Render Target
- Lesson 27: Events, Forms & Accessibility
- Lesson 30: Browser Application Studio

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §15.3.1 — PDF page 761 (file page index, not printed numbering).
- §15.3.4 — PDF page 776 (file page index, not printed numbering).
- §15.3.5 — PDF page 779 (file page index, not printed numbering).

