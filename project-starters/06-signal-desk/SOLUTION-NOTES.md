# Approach notes · Signal Desk

Start the server and inspect `/api/health`. The incident endpoints return HTTP 501 deliberately. The server binds only to your own machine. No authentication, database, or deployment service is provided.

1. Write the request/response contract and transition table. Define stable validation errors without exposing stack traces to the client.
2. Implement domain operations and an in-memory repository. Inject IDs and time so tests can state exact expectations.
3. Add one route at a time. Bound request body size, parse JSON safely, validate it, and map errors to HTTP outcomes.
4. Build one browser journey before adding more endpoints. Use actual labels and buttons, render text safely, and show failures clearly.
5. Add file persistence or a database adapter. Decide how simultaneous writes are serialized and how failed writes leave prior state recoverable.
6. Enable the pending tests; add the browser journey and a restart check. Update the initial scaffold test when 501 endpoints become implemented routes.

Keep persistence paths injected and never concatenate an incident identifier directly into a filesystem path. Use synthetic data. Document the limitations of the local single-user scope. A deployed multi-user version requires additional security and operational work; it is an extension, not a property conferred by passing these starter tests.
