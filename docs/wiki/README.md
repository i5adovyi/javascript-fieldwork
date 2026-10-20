# JavaScript working wiki

35 practical references distilled from the book, with original examples. Selected essentials across chapters 1–17; specialized graphics, audio, binary data, and tool installation remain in the full book.

Open the site’s **JavaScript wiki** for searchable topics and direct links to lessons, labs, and projects. These Markdown pages are also readable in your editor.

- [Language vs. runtime](runtime.md) — Know which capabilities come from JavaScript and which come from its host.
- [Syntax, return & line breaks](syntax.md) — Avoid invisible behavior changes caused by automatic semicolon insertion.
- [Values, identity & mutation](values-types.md) — Understand why changing one variable can appear to change another.
- [Numbers, NaN & precision](numbers.md) — Validate numeric inputs and account for floating-point approximation.
- [Strings & Unicode](strings.md) — Transform text without confusing code units with visible characters.
- [Equality & explicit conversion](equality-coercion.md) — Compare values without hiding type mismatches.
- [Scope, const, let & closures](scope.md) — Identify which binding a name refers to and when it becomes usable.
- [Defaults & optional chaining](operators.md) — Read optional data and apply defaults while preserving valid falsy values.
- [Conditions & choosing a loop](control-flow.md) — Make decisions explicit and select the right iteration behavior.
- [Errors & cleanup](errors.md) — Expose failures clearly and put cleanup on every exit path.
- [Object properties & safe updates](objects.md) — Distinguish missing properties, inherited properties, and shared nested state.
- [Arrays, holes & mutation](arrays.md) — Handle collection length, copies, removals, and sorting deliberately.
- [Choose map, filter, find or reduce](array-methods.md) — Choose a collection operation by the result you need.
- [Functions & parameter contracts](functions.md) — Make accepted inputs, defaults, outputs, and side effects easy to see.
- [Closures & private state](closures.md) — Keep state alive without making it global.
- [this, methods & bind](this.md) — Keep the intended receiver when passing a method as a callback.
- [Classes, prototypes & composition](classes.md) — Group state and behavior without losing sight of prototype lookup.
- [Modules & explicit dependencies](modules.md) — Split code into files with small, intentional public interfaces.
- [Maps and sets](maps-sets.md) — Deduplicate values with Set and associate arbitrary keys with values using Map.
- [Regular expressions](regex.md) — Validate simple text shapes, extract fields, and replace repeated patterns.
- [Dates, timestamps, and UTC](dates.md) — Represent instants consistently and separate elapsed durations from calendar calculations.
- [JSON serialization](json.md) — Convert portable data to text and reconstruct it without confusing JSON with arbitrary JavaScript objects.
- [Iterators and generators](iterators.md) — Produce and consume values one at a time with the protocol behind for…of and spread.
- [Promises and error propagation](promises.md) — Compose one eventual result through transformations, failures, and cleanup.
- [Async functions and await](async-await.md) — Write asynchronous control flow with familiar returns, loops, and try/catch.
- [Running asynchronous tasks concurrently](promise-concurrency.md) — Choose whether a group of independent operations needs every value, every outcome, or the first outcome.
- [Property descriptors and object behavior](metaprogramming.md) — Inspect property rules, constrain object mutation, and understand where Proxy and Reflect fit.
- [DOM: find, create, and update elements](dom.md) — Turn data into document elements with selectors, text content, and explicit node operations.
- [Events: listeners, bubbling, and delegation](events.md) — Connect user actions to behavior and handle a whole group of controls through a shared parent.
- [Fetch: check the response, then read the body](fetch.md) — Treat an HTTP request, its status, and its parsed response body as separate steps.
- [Browser storage: persist small preferences](browser-storage.md) — Choose storage by lifetime and data size, and treat persisted data as fallible input.
- [Workers: move CPU work off the interface thread](workers.md) — Keep the interface responsive while a separate worker performs an expensive calculation.
- [Node files: await I/O and resolve paths deliberately](node-files.md) — Read small files with promise APIs, choose the right path base, and close resources you open.
- [Node streams: process chunks with backpressure](node-streams.md) — Process large or ongoing inputs incrementally instead of buffering the entire dataset.
- [Tests, linting, and formatting](testing-tools.md) — Use behavior checks, static checks, and formatting for the different problems each can detect.
