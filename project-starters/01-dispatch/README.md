# Dispatch / a decision engine

**Stage 1 · Foundation · 6 estimated project hours**

Turn messy requests into explicit, testable decisions.

## Brief

A support team needs consistent routing for incoming requests. Build a pure JavaScript rule engine that accepts severity, customer tier, age in hours, and business-hours status, then returns a queue, response target, and explanation. Define the policy yourself in a decision table before implementing it. The result must be deterministic and must reject invalid input rather than silently inventing defaults.

## Start the scaffold

```sh
cd 01-dispatch
npm test
npm start
```

Run these commands from the parent `project-starters` directory for the first line, then remain in this numbered folder. Node.js 22+ is required. No dependencies or installation are needed. The scaffold contains named TODO functions that deliberately throw until implemented. They are not invoked by the initial demo. Browser shells label unfinished actions clearly.

The initial test run has one passing test for a provided utility and three pending acceptance tests. Replace a `test.todo` with an actual test and write its assertions before implementing that behavior. Do not treat pending tests as completed requirements.

## Deliverables

- Decision table with at least 12 representative cases
- A runnable function and example dataset
- Boundary-case checks and a short explanation of each rule
- One-page README with input/output contract

## Milestones and acceptance

### 1 · Specify the policy

- [ ] Define allowed severity and tier values and the meaning of ageHours.
- [ ] Write expected outcomes for ordinary, urgent, zero-age, and invalid inputs before coding.
- [ ] Resolve overlapping rules by an explicit precedence order.

### 2 · Build the smallest engine

- [ ] Implement routeRequest(request) without a browser or network dependency.
- [ ] Return an explanation that identifies the winning rule.
- [ ] Demonstrate the same input produces the same result on repeated calls.

### 3 · Prove the boundary

- [ ] Check the exact threshold and values immediately below and above it.
- [ ] Reject missing severity, negative age, NaN, and unsupported tiers.
- [ ] Walk a reviewer through three cases without reading your implementation.

## Rubric · 100 points

| Criterion | Points |
| --- | ---: |
| Correct routing and explicit rule precedence | 35 |
| Boundary validation and useful errors | 25 |
| Readable functions and meaningful names | 20 |
| Decision table, examples, and explanation | 20 |

## Optional extensions

- Add a batch report grouped by queue.
- Make the policy configurable without allowing arbitrary executable code.
- Compare two policy versions and report which requests change queue.

## Guidance

Read `SOLUTION-NOTES.md` for a sequence of experiments and design questions. It is an approach guide, not a finished solution. Preserve fixtures, run tests, and keep a short decision log as you work.
