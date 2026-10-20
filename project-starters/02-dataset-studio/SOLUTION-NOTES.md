# Approach notes · Dataset Studio

`fixtures/participants.json` has 50 synthetic records. Known anomalies include a duplicate identifier, an invalid email, a blank display name, tags stored as a string, an empty identifier, and an invalid date. Begin with the five records in `small.json`; write expected accepted IDs and rejected reasons by hand.

1. Define required fields and how strict each validation should be. An email check in a training project should have a documented scope; it is not proof of deliverability.
2. Normalize into new records. Copy nested tag arrays when your function promises ownership independence.
3. Choose first-wins, last-wins, or rejection for duplicates. Preserve a clear report of what happened.
4. Build queries over accepted records, then summaries. Decide whether tag names are case-sensitive.
5. Enable the acceptance checks. Capture input with `structuredClone` before a call and compare afterward; also inspect nested reference behavior if that is part of your contract.

Keep normalization and reporting separate enough that a rejected row does not disappear without explanation. Never derive expected test totals by calling the same helper you are testing.
