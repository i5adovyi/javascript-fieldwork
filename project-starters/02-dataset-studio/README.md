# Dataset Studio / records with integrity

**Stage 2 · Foundation → intermediate · 10 estimated project hours**

A small data toolkit that can explain every transformation.

## Brief

A community organizer receives inconsistent participant records. Build a toolkit to validate, normalize, deduplicate, search, and summarize them. Use a supplied fixture you create with at least 50 records, including intentional duplicates and invalid fields. Preserve the original input and report rejected records with reasons. Keep business rules separate from display formatting.

## Start the scaffold

```sh
cd 02-dataset-studio
npm test
npm start
```

Run these commands from the parent `project-starters` directory for the first line, then remain in this numbered folder. Node.js 22+ is required. No dependencies or installation are needed. The scaffold contains named TODO functions that deliberately throw until implemented. They are not invoked by the initial demo. Browser shells label unfinished actions clearly.

The initial test run has one passing test for a provided utility and three pending acceptance tests. Replace a `test.todo` with an actual test and write its assertions before implementing that behavior. Do not treat pending tests as completed requirements.

## Deliverables

- 50-record fixture with documented anomalies
- Functions for normalize, deduplicate, query, and summarize
- Before/after report with rejected-record reasons
- Tests for ownership, ordering, and duplicates

## Milestones and acceptance

### 1 · Establish the data contract

- [ ] Choose identifier, displayName, email, tags, and joinedAt fields.
- [ ] Define a duplicate policy, including which version wins and why.
- [ ] Record expected summary counts by hand for a small five-record fixture.

### 2 · Implement a pipeline

- [ ] Return accepted and rejected records separately.
- [ ] Keep stable order where the contract promises it.
- [ ] Prove that processing does not modify the original records or their tag arrays.

### 3 · Deliver useful queries

- [ ] Support case-insensitive name search and tag filtering.
- [ ] Summarize counts without losing duplicate or rejection information.
- [ ] Show empty, all-invalid, and duplicate-only datasets produce meaningful results.

## Rubric · 100 points

| Criterion | Points |
| --- | ---: |
| Correct normalization, queries, and summaries | 30 |
| Duplicate and invalid-record policies | 25 |
| Ownership and non-mutation guarantees | 20 |
| Tests and realistic fixtures | 15 |
| Usage guide and example report | 10 |

## Optional extensions

- Add CSV export with correct quoting for commas and double quotes.
- Benchmark a 10,000-record synthetic fixture and document the environment.
- Make a configurable pipeline from small functions.

## Guidance

Read `SOLUTION-NOTES.md` for a sequence of experiments and design questions. It is an approach guide, not a finished solution. Preserve fixtures, run tests, and keep a short decision log as you work.
