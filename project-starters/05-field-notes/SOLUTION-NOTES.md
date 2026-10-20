# Approach notes · Field Notes

The browser shell renders two bundled sample notes using `textContent`. Its form checks an optional URL and explicitly reports that nothing is saved. This is the intentional starting state.

1. Define a note schema and implement `createNote`. Supply an ID generator in tests. Decide whether empty body text is valid and how tags are normalized.
2. Keep an array of notes as model state. Render from that state rather than treating the DOM as your database.
3. Inject storage into persistence helpers. Test a memory adapter and an adapter whose writes throw.
4. Validate an entire imported envelope before committing it. Reject unknown versions; decide whether import replaces or merges.
5. Add editing, deletion, search, and clear-filter behavior. Preserve an understandable focus destination after each action.

Enable the pending tests for domain and persistence behavior. Then manually complete create, search, edit, delete, export, and restore using a keyboard. Use long text and a title containing literal HTML-like characters. Add a focused browser test when the complete workflow exists. The starter has no cloud sync or secure vault; keep secrets out of its data.
