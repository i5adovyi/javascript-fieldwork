# Workflow Kit / a tiny reusable SDK

**Stage 3 · Intermediate · 12 estimated project hours**

Design a public interface that protects its own rules.

## Brief

Create an ES module library for a task workflow with open, active, blocked, and done states. The library owns transition rules, identifiers, and task lookup. A small demo consumes only the public exports. Choose a class or a factory deliberately, document the decision, and keep persistence outside the core model. A forbidden transition must leave the task unchanged.

## Start the scaffold

```sh
cd 03-workflow-kit
npm test
npm start
```

Run these commands from the parent `project-starters` directory for the first line, then remain in this numbered folder. Node.js 22+ is required. No dependencies or installation are needed. The scaffold contains named TODO functions that deliberately throw until implemented. They are not invoked by the initial demo. Browser shells label unfinished actions clearly.

The initial test run has one passing test for a provided utility and three pending acceptance tests. Replace a `test.todo` with an actual test and write its assertions before implementing that behavior. Do not treat pending tests as completed requirements.

## Deliverables

- ES module library with a documented public API
- State-transition table and invalid-transition examples
- Two independent instances proving state isolation
- Consumer demo, focused tests, and an architecture note

## Milestones and acceptance

### 1 · Specify the interface

- [ ] Define add, find, list, and transition operations and their return values.
- [ ] Write the allowed transition table before implementation.
- [ ] Choose and document error behavior for unknown identifiers and duplicate identifiers.

### 2 · Protect the invariants

- [ ] Keep independent instances from sharing mutable task state.
- [ ] Prevent consumers from accidentally mutating internal records through returned data.
- [ ] Ensure a rejected transition cannot partially update a task.

### 3 · Test the public promise

- [ ] Exercise every allowed transition and at least three forbidden ones.
- [ ] Create a second consumer without importing implementation internals.
- [ ] Document one design tradeoff and a realistic extension point.

## Rubric · 100 points

| Criterion | Points |
| --- | ---: |
| Correct transitions and invariant protection | 35 |
| Clear public API and module boundaries | 25 |
| Isolation, ownership, and failure behavior | 20 |
| Consumer demo, tests, and documentation | 20 |

## Optional extensions

- Add an adapter that persists serialized data without coupling storage to domain logic.
- Expose task history as an iterable.
- Add a versioned serialization format and a migration example.

## Guidance

Read `SOLUTION-NOTES.md` for a sequence of experiments and design questions. It is an approach guide, not a finished solution. Preserve fixtures, run tests, and keep a short decision log as you work.
