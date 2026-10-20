# Signal Desk / the release capstone

**Stage 6 · Advanced · 24 estimated project hours**

Ship a full application with evidence behind every claim.

## Brief

Create a small incident-tracking application with a Node.js API and a browser client. Use synthetic incidents, explicit status transitions, filtering, and a summary dashboard. Persist data using a documented local format or database adapter. Deliver the project so another developer can start it from a clean checkout, run its tests, and inspect one complete workflow. The default scope is a local single-user learning application; authentication and internet deployment are optional extensions.

## Start the scaffold

```sh
cd 06-signal-desk
npm test
npm start
```

Run these commands from the parent `project-starters` directory for the first line, then remain in this numbered folder. Node.js 22+ is required. No dependencies or installation are needed. The scaffold contains named TODO functions that deliberately throw until implemented. They are not invoked by the initial demo. Browser shells label unfinished actions clearly.

The initial test run has one passing test for a provided utility and three pending acceptance tests. Replace a `test.todo` with an actual test and write its assertions before implementing that behavior. Do not treat pending tests as completed requirements.

Open **http://127.0.0.1:4176** after starting. `/api/health` works; incident endpoints return explicit HTTP 501 responses until you implement them. Restarting currently retains no new incidents because persistence is a TODO.

## Deliverables

- Node API, browser client, and documented persistence model
- Unit and integration tests plus one meaningful browser journey
- Setup guide, architecture note, and release checklist
- Demo script, known limitations, and rubric self-assessment

## Milestones and acceptance

### 1 · Contract before implementation

- [ ] Define endpoints, request schemas, response shapes, and error categories.
- [ ] Choose an incident lifecycle and reject forbidden state transitions.
- [ ] Keep secrets and machine-specific paths out of source and fixtures.

### 2 · Integrate a complete journey

- [ ] Create an incident, update its state, filter the list, and verify the summary.
- [ ] Restart the server and prove documented persistence behavior.
- [ ] Handle invalid requests, unknown identifiers, and storage failure without misleading success messages.

### 3 · Produce release evidence

- [ ] Run the documented setup from a clean directory.
- [ ] Cover important domain rules, API validation, and one browser workflow with appropriate tests.
- [ ] Demonstrate keyboard access and inspect the distribution for private data.

### 4 · Present the work

- [ ] Record a five-minute demo script focused on user value and one difficult technical decision.
- [ ] Document one real bug and the regression test that protects against it.
- [ ] Score the rubric honestly and identify the next improvement with the highest value.

## Rubric · 100 points

| Criterion | Points |
| --- | ---: |
| Reliable end-to-end behavior and domain rules | 30 |
| API validation, persistence, and failure handling | 25 |
| Meaningful automated and manual verification | 20 |
| Usable interface and accessible interactions | 10 |
| Reproducible setup, architecture, and release evidence | 15 |

## Optional extensions

- Add authentication only with an explicit threat model and secure server-side session handling.
- Add a CI workflow that runs the documented checks.
- Deploy a demo with synthetic data and verify the deployed primary flow.

## Guidance

Read `SOLUTION-NOTES.md` for a sequence of experiments and design questions. It is an approach guide, not a finished solution. Preserve fixtures, run tests, and keep a short decision log as you work.
