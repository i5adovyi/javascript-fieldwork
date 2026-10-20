# Approach notes · Research Queue

The fake service deliberately finishes `language` later than most topics, rejects `missing`, and returns an invalid shape for `malformed`. It supports AbortSignal through the Node timer API. Use it to explore failure without relying on an external service.

1. Write the state model and output-order policy. Decide whether duplicate input topics are separate jobs.
2. Start with sequential collection, preserving individual failures in the report.
3. Add a bounded scheduler. In a test adapter, increment an active counter before awaiting and decrement it in `finally`; capture the maximum.
4. Define cancellation precisely. Distinguish work never started from running work that was aborted.
5. Replace timing guesses with controllable promises when testing ordering. Resolve the second operation before the first and inspect the final report.

A new batch needs its own state. Avoid shared mutable arrays at module scope. A failure must not prevent cleanup or contaminate the next batch. Enable the pending tests before adding retries or a real API adapter.
