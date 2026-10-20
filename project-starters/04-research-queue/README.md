# Research Queue / resilient async work

**Stage 4 · Intermediate · 14 estimated project hours**

Collect useful results even when the network behaves badly.

## Brief

Build a research collector that accepts a list of topic identifiers and loads metadata through an injectable asynchronous adapter. Begin with a local fake service that can delay, fail, and return malformed data. Support cancellation, a configurable concurrency limit, visible progress data, and a final report. The engine must remain usable after partial failures.

## Start the scaffold

```sh
cd 04-research-queue
npm test
npm start
```

Run these commands from the parent `project-starters` directory for the first line, then remain in this numbered folder. Node.js 22+ is required. No dependencies or installation are needed. The scaffold contains named TODO functions that deliberately throw until implemented. They are not invoked by the initial demo. Browser shells label unfinished actions clearly.

The initial test run has one passing test for a provided utility and three pending acceptance tests. Replace a `test.todo` with an actual test and write its assertions before implementing that behavior. Do not treat pending tests as completed requirements.

## Deliverables

- Async collector with an injectable adapter
- Deterministic fake service and failure scenarios
- Per-item results with success, failure, or cancellation state
- Tests for ordering, concurrency, and stale results

## Milestones and acceptance

### 1 · Model the states

- [ ] Define queued, running, succeeded, failed, and cancelled items.
- [ ] Specify whether output preserves input order or completion order.
- [ ] Write the policy for malformed metadata and duplicate topic identifiers.

### 2 · Control concurrency

- [ ] Ensure active requests never exceed the configured positive integer limit.
- [ ] Preserve successful results when another item fails.
- [ ] Stop starting new work after cancellation and document how in-flight work behaves.

### 3 · Exercise hostile timing

- [ ] Resolve requests in a different order from creation and verify the report.
- [ ] Reject one request, return malformed data for another, and show both failures distinctly.
- [ ] Run a second batch after a failure and prove state from the first cannot contaminate it.

## Rubric · 100 points

| Criterion | Points |
| --- | ---: |
| Correct result and failure semantics | 30 |
| Concurrency and cancellation guarantees | 30 |
| Deterministic tests and realistic scenarios | 25 |
| Progress contract and documentation | 15 |

## Optional extensions

- Add capped retry with an explicit retryable-error policy.
- Expose progress through an async iterator.
- Connect one public API adapter while retaining deterministic offline tests.

## Guidance

Read `SOLUTION-NOTES.md` for a sequence of experiments and design questions. It is an approach guide, not a finished solution. Preserve fixtures, run tests, and keep a short decision log as you work.
