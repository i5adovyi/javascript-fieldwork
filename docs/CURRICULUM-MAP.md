# JavaScript Fieldwork · Curriculum map

This is a companion route for *JavaScript: The Definitive Guide, Seventh Edition* by David Flanagan. It organizes the book’s 17 chapters into six stages containing 36 lessons. The portal’s lesson records are the detailed assignment source; this document explains the relationship between stages, book chapters, practice, and portfolio evidence.

The chapter sequence was checked against the [publisher’s seventh-edition table of contents](https://www.oreilly.com/library/view/javascript-the-definitive/9781491952016/) on 2026-10-20. Use chapter and section names rather than raw PDF page numbers. Editions differ; if your copy has another edition number, use topic names to navigate.

## Stage 1 · Establish a precise language model

**Lessons:** 1–6. **Reading:** chapters 1–5.

| Chapter | Book topic | Practice emphasis |
| --- | --- | --- |
| 1 | Introduction to JavaScript | Distinguish the language from its browser and Node environments; run small experiments. |
| 2 | Lexical Structure | Read programs precisely; identify declarations, literals, comments, and statement boundaries. |
| 3 | Types, Values, and Variables | Predict values and types; reason about missing values, conversions, equality, and bindings. |
| 4 | Expressions and Operators | Explain evaluation, short-circuiting, and the difference between a condition and its result. |
| 5 | Statements | Design branches, loops, and error paths around an explicit contract. |

**Stage evidence:** a prediction journal, boundary-case exercises, and **Dispatch**, a rule engine with a written decision table. Move on when you can trace a short program and explain why it chooses a particular branch.

**Common traps:** treating form values as numbers without conversion, using truthiness where zero is valid, confusing assignment with comparison, and writing loops without a termination argument.

## Stage 2 · Transform data without losing control of it

**Lessons:** 7–12. **Reading:** chapters 6–8.

| Chapter | Book topic | Practice emphasis |
| --- | --- | --- |
| 6 | Objects | Model records; distinguish property access, existence, identity, and mutation. |
| 7 | Arrays | Transform, search, filter, and summarize data; reason about ordering and empty input. |
| 8 | Functions | Write contracts; compose operations; use scope and closures deliberately. |

**Stage evidence:** ownership diagrams, a family of small transformations, and **Dataset Studio**, a toolkit that reports accepted, rejected, and duplicate records. Move on when you can explain which values a function may change and prove that behavior with examples.

**Common traps:** assuming spread performs a deep copy, mutating a caller’s array through an alias, returning inconsistent shapes, and hiding state inside a helper without documenting it.

## Stage 3 · Design interfaces between pieces of code

**Lessons:** 13–18. **Reading:** chapters 9–10, revisiting chapter 8 where useful.

| Chapter | Book topic | Practice emphasis |
| --- | --- | --- |
| 9 | Classes | Protect invariants; compare classes, factories, composition, and prototype behavior. |
| 10 | Modules | Define exports, control dependencies, and build a small public API. |

**Stage evidence:** a state-transition table, documented exports, independent consumers, and **Workflow Kit**, a reusable module with meaningful invariants. Move on when another small program can use your module without importing its internals.

**Common traps:** class hierarchies before a clear data model, public methods that can violate state rules, circular imports, and different instances accidentally sharing mutable state.

## Stage 4 · Coordinate collections and asynchronous work

**Lessons:** 19–24. **Reading:** chapters 11–13.

| Chapter | Book topic | Practice emphasis |
| --- | --- | --- |
| 11 | The JavaScript Standard Library | Choose sets and maps; work with text, dates, JSON, errors, and other library tools as the task requires. |
| 12 | Iterators and Generators | Understand the iteration contract and when lazy production helps. |
| 13 | Asynchronous JavaScript | Model promises, errors, sequencing, concurrency, and asynchronous iteration. |

**Stage evidence:** collection comparisons, deterministic timing experiments, and **Research Queue**, a collector with explicit failure and cancellation policies. Move on when you can explain what happens if results arrive out of order or one operation fails.

**Common traps:** assuming request completion means success, starting too much concurrent work, leaving a promise rejection unhandled, and allowing an old result to replace newer state.

## Stage 5 · Build a complete browser experience

**Lessons:** 25–30. **Reading:** chapter 15. Chapter 14 is deliberately deferred to stage 6 so browser practice can build directly on asynchronous fundamentals.

| Chapter | Book topic | Practice emphasis |
| --- | --- | --- |
| 15 | JavaScript in Web Browsers | DOM updates, events, forms, requests, state, storage, and browser capabilities. |

Chapter 15 is broad. Begin with the mechanisms needed for a complete everyday application. Treat specialized topics such as graphics, workers, and component techniques as targeted reading or project extensions when they solve a concrete problem.

**Stage evidence:** a keyboard walkthrough, state and recovery checks, and **Field Notes**, a persistent personal workspace with export/import. Move on when a user can complete the main task, recover from an error, and keep their data through a reload.

**Common traps:** rendering external strings as executable markup, forgetting labels and focus, storing secrets in client code, corrupting existing data during import, and designing only the happy path.

## Stage 6 · Integrate, verify, and release

**Lessons:** 31–36. **Reading:** chapters 14, 16, and 17.

| Chapter | Book topic | Practice emphasis |
| --- | --- | --- |
| 14 | Metaprogramming | Understand property behavior, symbols, reflection, and proxies; choose advanced mechanisms only when justified. |
| 16 | Server-Side JavaScript with Node | Work with files, asynchronous I/O, requests, and server boundaries in the Node environment. |
| 17 | JavaScript Tools and Extensions | Connect development tools, testing, and delivery practices to a reproducible workflow. |

**Stage evidence:** API contracts, automated checks at appropriate boundaries, a clean setup walkthrough, and **Signal Desk**, a local full application. The capstone should demonstrate reliable behavior and explain its limits. Authentication and public production deployment are optional additional projects, not assumed properties of a local demo.

**Common traps:** copying runtime-specific APIs into the wrong environment, hiding dependency requirements, testing only internal helpers, and claiming release readiness without running the documented setup.

## Modern companion references

The seventh edition covers the language as of its publication era. Use current references to confirm API availability and tooling details in the environment you actually run. This curriculum keeps the book’s conceptual foundation and uses current documentation for implementation questions.

- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide): language behavior and links to the full reference.
- [MDN modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules): current module-loading details.
- [MDN promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) and [Fetch guide](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch): asynchronous contracts and browser networking.
- [Node.js documentation](https://nodejs.org/api/test.html): use the documentation version corresponding to your installed runtime when selecting test-runner features.
- [Playwright documentation](https://playwright.dev/docs/intro): browser testing for a complete user journey.
- [web.dev accessibility course](https://web.dev/learn/accessibility/): semantic and interactive interface design.
- [OWASP DOM XSS guidance](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html): output boundaries for data entering the browser.

The portal’s **Library** also includes author-published free books, structured courses, practice tracks, and verified YouTube links. Older talks remain useful for foundational concepts; use current documentation to resolve present-day API details.

## How evidence accumulates

| Artifact | What it demonstrates | What it cannot establish alone |
| --- | --- | --- |
| A correct prediction | A usable mental model for one case. | Transfer to unfamiliar inputs. |
| A passing lab | The solution satisfies the visible checks. | Exhaustive correctness or independent authorship. |
| An explained variation | Transfer beyond the original example. | Application integration. |
| A complete project | Multiple skills working together. | Production readiness in every environment. |
| A release walkthrough | Reproducibility and communication. | Absence of all defects. |

For each stage, combine these forms of evidence. Use the 100-point project rubric as a review aid and retain examples of your reasoning in **My notebook**. A completion badge is a useful milestone; the real outcome is work you can explain, change, and defend.

## Source and distribution boundary

The local PDF is the learner’s own reference material. The portal ships original companion explanations, lab specifications, article text, and project briefs. It does not ship the book, reproduce its pages, or provide unofficial download links. Resource metadata links to publishers, authors, and official project documentation. Verification date: **2026-10-20**.
