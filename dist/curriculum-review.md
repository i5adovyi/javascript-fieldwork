# JavaScript Fieldwork · Curriculum review

## Review conclusion

The core curriculum already teaches defensive programming. Its 36 lessons cover input validation, object ownership, explicit failure contracts, stale responses, bounded concurrency, cancellation, persistence failures, stream boundaries, and regression evidence. The learner handbook already asks for predictions, minimal reproductions, controlled hypotheses, and tests that preserve a fix.

The main learning gap was the starting condition of the exercises. Learners often designed their own clean interfaces and failure fixtures. They had fewer opportunities to inherit a broken implementation, work from an incomplete report, separate misleading symptoms from causes, and preserve existing behavior while repairing it.

The incident workshop adds 12 case packets, two per stage, and eight optional executable repair labs, numbered 49–56. The original 48 labs remain the core practice sequence. A packet supplies a situation to investigate; a linked repair lab isolates a mechanism that can be checked automatically. Passing that lab does not by itself complete the wider investigation or establish production readiness.

Use the [incident workbook](incident-workbook.md) for the cases and evidence prompts. The [learner handbook](handbook.md) explains where they fit into a study session. In the portal, open the incident workshop at `#/incidents`; individual case routes use `#/incident/incident-01` through `#/incident/incident-12`.

## What was already present

| Existing coverage | Where it is taught | What the review asks to deepen |
| --- | --- | --- |
| Conversion, absence policies, boundary validation, and immutable updates | `lesson-02`–`lesson-07`; projects `dispatch` and `dataset-studio` | Repair ambiguous real inputs while preserving identity and distinguishing omitted values from explicit changes. |
| Duplicate policies, rejected-record reports, and versioned JSON | `lesson-12`, `lesson-19`, `lesson-24`; project `dataset-studio` | Work from adversarial supplied records and prove that rejected input cannot change trusted state. |
| Closure retention, state isolation, dependency boundaries, and cleanup ownership | `lesson-10`, `lesson-13`–`lesson-18`, `lesson-29`; project `workflow-sdk` | Diagnose repeated-use failures and ownership bugs in an existing component or cache. |
| Unicode-related string concerns, regex limits, dates, and locale-aware presentation | `lesson-20`; supporting string/number wiki topics | Make a user-visible text operation work for combined characters instead of assuming an index is a visible character. |
| Promise propagation, stale-result protection, bounded concurrency, cancellation, and safe retry policies | `lesson-22`–`lesson-24`; project `research-queue` | Repair deterministic bad interleavings and distinguish one failed operation from a permanently broken queue. |
| HTTP status handling, failed JSON parsing, storage failures, imports, and reload behavior | `lesson-28`, `lesson-30`, `lesson-33`; projects `field-notes` and `signal-desk` | Diagnose a response that violates assumptions, preserve data on failed saves, and expose conflicting edits. |
| Chunk boundaries, backpressure, cleanup, interrupted output, and reproducible delivery | `lesson-32`, `lesson-35`–`lesson-36`; project `signal-desk` | Investigate serialized writes and mixed-release symptoms with an explicit account of what remains unproved. |

These are extensions of existing teaching, not claims that validation, races, backups, or debugging were absent. The original projects already require meaningful failure cases: `field-notes` rejects invalid imports without overwriting existing records, `research-queue` controls hostile timing, and `signal-desk` requires honest persistence failures and a regression for a real bug.

## New incident route

Follow the listed lessons before attempting a case. Numbers are stable case identifiers, not an instruction to jump ahead in the curriculum.

| Stage | Incident | Start after | Optional repair lab | Additional practice |
| --- | --- | --- | --- | --- |
| 1 | `incident-01` · Optional integer configuration | `lesson-04` | `lab-49` | Reproduce a configuration default that erases a valid value; make absence, conversion, and validation separate decisions. |
| 1 | `incident-02` · Lossy identifier normalization | `lesson-02` and `lesson-06` | — | Diagnose identifiers that collapse during conversion; preserve original identity and produce evidence for rejected records. |
| 2 | `incident-03` · Missing, null, and atomic patches | `lesson-07` | `lab-50` | Distinguish an omitted update from an explicit value and prove that a rejected patch leaves the original record unchanged. |
| 2 | `incident-04` · Hostile imports | `lesson-12` | — | Investigate untrusted input and unexpected keys using a concrete import boundary, with preservation checks around rejection. |
| 3 | `incident-05` · Resource cleanup | `lesson-17` | `lab-51` | Make repeated setup and disposal observable; prove that callbacks and other owned resources do not accumulate. |
| 3 | `incident-06` · Stale cache ownership | `lesson-18` | — | Trace who owns cached and returned values; reproduce an old or mutated value without rewriting the public contract. |
| 4 | `incident-07` · Unicode graphemes | `lesson-20` | `lab-52` | Repair a text operation with visible-character fixtures; distinguish UTF-16 units, code points, and grapheme clusters. |
| 4 | `incident-08` · Latest request wins | `lesson-23` | `lab-53` | Drive responses in a controlled order and prevent obsolete work from committing current interface state. |
| 5 | `incident-09` · HTTP JSON/HTML diagnosis | `lesson-28` | `lab-54` | Diagnose status, content, and parsing separately when an expected JSON response contains HTML; preserve useful failure evidence. |
| 5 | `incident-10` · Persistence failures and multiple-tab conflicts | `lesson-30` | `lab-55` | Exercise rejected writes and conflicting edits; keep the recovery policy and the user's unsaved work visible. |
| 6 | `incident-11` · Serialized writes after rejection | `lesson-32` | `lab-56` | Reproduce a rejected write that blocks later work; preserve ordering while giving each caller its own result or failure. |
| 6 | `incident-12` · Old tab, new release | `lesson-35` and `lesson-36` | — | Reconstruct a mixed-version failure, separate observations from assumptions, and propose containment and regression checks. |

Case estimates in the portal are planning aids. Reserve an additional optional session when a case becomes relevant, and adjust after the first reproduction. The existing 8-week and 16-week schedules have not been shortened or extended to guarantee room for these workshops. An unresolved investigation with a precise reproduction is valid progress; a checked box is not evidence of a repair.

## Evidence required for a repair

Keep the packet's contract and constraints visible. Use its fixture and reproduction before changing code, and retain the original implementation long enough to demonstrate the defect.

1. **Minimal reproduction:** record the input, initial state, environment assumptions, and exact actions or event order. State expected and observed behavior separately.
2. **Hypotheses:** write at least two plausible explanations when the evidence allows them. Record the observation that supports or rules out each one. A guess that happens to produce passing output is not yet a diagnosis.
3. **Failing test:** capture the reported defect in an assertion or repeatable browser procedure that fails against the original implementation. For races, control resolution order rather than relying on random delays.
4. **Fix:** make a focused change that honors the existing public contract and the packet's constraints. Explain which assumption was wrong and why this change addresses it.
5. **Regression evidence:** show the original reproduction passing, preserve neighboring valid behavior, and add at least one meaningful variation. Examples include the reverse completion order, a second run after failure, an unchanged input snapshot, or a rejected save followed by reload.
6. **Operational notes:** explain user impact, recovery or containment, data that might be unsaved, relevant diagnostics, and remaining limitations. Separate a simulated guarantee from behavior exercised in a real browser, filesystem, or deployment.

After completing a case, rehearse the same failure class in the stage project: `dispatch`, `dataset-studio`, `workflow-sdk`, `research-queue`, `field-notes`, or `signal-desk`. Reuse the reasoning and adapt the fixture to that project's contract. Copying a lab answer into an unrelated project is not an integration check.

## High-priority remaining extensions

The additions provide focused learning cases. The following broader systems are still extensions, not completed capabilities or guarantees of the workshop:

| Extension | Relevant lessons and project | Evidence still needed |
| --- | --- | --- |
| Distributed idempotency and uncertain commits | `lesson-23`, `lesson-24`, `lesson-33`; `signal-desk` | A request commits but its response is lost; retries, conflicting payloads, concurrent callers, and server restart must preserve one logical operation using durable state. Latest-request UI protection does not establish this guarantee. |
| Full daylight-saving and calendar policy | `lesson-20`; `dispatch` or `field-notes` | Fixtures for nonexistent and repeated local times, local-day boundaries, and explicit zone policy. The existing lesson discusses these distinctions; deadline and formatting examples do not constitute a complete calendar test suite. |
| A bounded real NDJSON parser | `lesson-21`, `lesson-32`; `signal-desk` | Arbitrary byte partitions, split UTF-8, BOM and CRLF policy, malformed records, oversized records without newlines, bounded retained memory, and end-to-end cleanup. Grapheme repair and queue ordering do not implement this parser. |
| Crash-safe writes and recovery | `lesson-32`; `signal-desk` | Interruption at each real write/replace step, partial files, platform constraints, restart recovery, and preservation of the previous good data. A promise queue that survives rejection does not establish filesystem atomicity or durability. |
| Multi-version data migrations | `lesson-19`, `lesson-28`, `lesson-35`; `workflow-sdk` and `field-notes` | Old and future schemas, interrupted migrations, repeatable retries without duplicate identities, and recovery of the original backup. Version fields and the existing migration stretch are starting points. |
| Real deployment rollback | `lesson-35`–`lesson-36`; `field-notes` and `signal-desk` | An actual release environment with old tabs, versioned assets, cache behavior, schema compatibility, failed updates, and a verified rollback. Incident 12 exercises diagnosis and planning; it is not a deployed rollback rehearsal. |
| Production conflict resolution | `lesson-28`, `lesson-33`; `field-notes` and `signal-desk` | A chosen revision/transaction model, simultaneous edits, offline reconciliation, and conflict recovery tested in the actual persistence system. The focused multiple-tab case does not substitute for a general collaborative storage design. |

## How to assess improvement

Compare the learner's before-and-after evidence, not just the number of completed packets. A useful repair explains a cause, preserves the contract, reproduces the original failure, and survives a nearby variation. Ask the learner to repeat a case later with changed input or timing and without its solution notes.

The workshop is an additional practice route. It does not turn self-assessed lessons into certification, prove every program correct, or establish commercial production readiness. Keep limitations explicit and choose the next extension from the failures the learner can now describe precisely.
