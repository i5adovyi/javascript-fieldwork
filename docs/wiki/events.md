# Events: listeners, bubbling, and delegation

Connect user actions to behavior and handle a whole group of controls through a shared parent.

## Essential rule

Use addEventListener; distinguish the original event target from the element whose listener is running.

An event travels through a capture phase toward its target and, for bubbling events, back through its ancestors. event.target identifies the original target; event.currentTarget identifies the element handling this invocation. A parent listener can use closest to find the relevant control, including when a nested icon was clicked.

preventDefault cancels a cancelable default action, such as form submission. stopPropagation stops further travel through the tree; it does not cancel that default action. Keep a reference to a handler if you will remove it later, or use once for a single invocation.

## When to use it

- Handle rows or buttons that are added after initial rendering.
- Keep form submission and navigation behavior under explicit control.

## Practical example

Runtime: Browser console on the project page.

```javascript
const panel = document.createElement("div");
const button = document.createElement("button");
button.type = "button";
button.dataset.action = "save";
panel.append(button);
panel.addEventListener("click", (event) => {
  const control = event.target.closest("button[data-action]");
  if (!control || !panel.contains(control)) return;
  console.log(control.dataset.action);
  console.log(event.currentTarget === panel);
});
button.click();
```

Expected output:

```text
save
true
```

The detached button dispatches a click that bubbles to its detached parent. One parent listener handles the action without attaching a handler to each button.

## Common pitfalls

- Returning false from an addEventListener callback does not cancel anything.
- Passive listeners cannot use preventDefault to cancel the event.
- A fresh anonymous function is not the same callback when removing a listener.

## Related topics

- [DOM: find, create, and update elements](dom.md)
- [Functions & parameter contracts](functions.md)
- [this, methods & bind](this.md)

## Linked lessons

- Lesson 25: The Browser Execution Model
- Lesson 27: Events, Forms & Accessibility
- Lesson 29: Browser APIs & Responsive Work
- Lesson 30: Browser Application Studio

## Source

David Flanagan, *JavaScript: The Definitive Guide*, 7th edition (2020). Original summary and examples.

- §15.2.2 — PDF page 747 (file page index, not printed numbering).
- §15.2.3 — PDF page 753 (file page index, not printed numbering).
- §15.2.4 — PDF page 756 (file page index, not printed numbering).
- §15.2.5 — PDF page 758 (file page index, not printed numbering).

