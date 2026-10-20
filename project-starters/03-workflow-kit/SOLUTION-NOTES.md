# Approach notes · Workflow Kit

A vocabulary is not a state machine. Decide which transitions are allowed and write them in a table. The fixture illustrates states, not permission to transition arbitrarily between them.

1. Describe `add`, `find`, `list`, and `transition` as contracts, including return values and unknown-ID errors.
2. Choose a class or factory. A closure around a Map is one possible design, not a mandatory solution.
3. Inject deterministic IDs during tests. Decide how a real consumer supplies identifiers.
4. Check a transition before committing a state change. Failed operations should leave observable state untouched.
5. Decide what consumers own when receiving records. Copy only what the documented shape requires.

Enable each pending test through the public API. Add a second demo consumer that imports only public exports. If it needs private arrays or internal methods, revisit the interface. Keep persistence outside the core library until the workflow contract is clear.
