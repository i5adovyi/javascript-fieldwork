# JavaScript Fieldwork · Learner handbook

A reference book becomes a skill when you use it to make predictions, write programs, investigate failures, and explain your decisions. This program pairs your own copy of David Flanagan’s *JavaScript: The Definitive Guide, Seventh Edition* with 36 lessons across six stages, practical labs, original field notes, curated resources, and six portfolio project briefs.

The objective is independent capability: you can take a small problem, choose a representation, build a solution, test its boundaries, and explain how it works. Progress indicators record activity. Your programs and explanations provide stronger evidence of learning.

## Start here

1. Open **Overview** and choose the first lesson in **Learning path**. Read the stated objective before opening any reference.
2. Use **Read book** to select your own PDF. The file is read locally; it is not uploaded. After a page reload, select the PDF again. The book is not included in the portal or its downloadable materials.
3. Keep an editor, browser developer tools, and a notebook available. The built-in **Practice lab** is suitable for focused language exercises; larger portfolio projects belong in their own working folders.
4. Write a prediction, attempt the exercise, and use **Run tests**. If you are stuck, use **Hint** before **View solution**. A passing lab is marked complete automatically. Use **Mark complete** for a lesson when you have done the work; quizzes help you check understanding but do not replace an implementation.
5. End the session in **My notebook**. Write what changed in your understanding and the next experiment you will run.

The portal is a local learning workspace. It has no account or cloud synchronization. Once it has loaded and its assets are cached, the app can be used offline; external courses, documentation, and YouTube videos still need a connection. Your locally selected book must be available on your device.

## The five-part study loop

| Step | Action | Evidence to leave behind |
| --- | --- | --- |
| Read | Read the assigned book section with one question in mind. | A rule in your own words and a section reference. |
| Predict | State the output and the reason before running the code. | Your original prediction, including mistakes. |
| Implement | Solve the smallest useful problem without copying a finished answer. | A runnable attempt with a clear input/output contract. |
| Test | Check normal input, a boundary, and a plausible failure. | Assertions or a repeatable manual check. |
| Reflect | Explain the assumption you corrected and choose the next variation. | Three precise sentences and a follow-up experiment. |

A good 60-minute session is ten minutes of reading, five of prediction, twenty-five of implementation, ten of testing, and ten of reflection. Adjust the allocation to the problem. A productive session may finish with a minimal bug reproduction rather than a solved exercise.

### How to use assistance without losing the practice

Make a real attempt first. When asking an AI or another person for help, share the contract, your expected result, the actual result, and your current hypothesis. Ask for one hint or one counterexample. After seeing a solution, close it, rebuild it in a fresh file, and change a requirement. If you cannot handle the variation, return to the underlying rule.

A useful help request is: “I expect this function to preserve the input array. This test shows the nested tags changed. Which assumption should I inspect next?” A weak request is: “Write the exercise for me.”

### What to do when you are stuck

Shrink the input. Remove unrelated interface code. Identify the first point where the observed value differs from your prediction. Inspect its type, identity, and source. Use a breakpoint when call order or scope matters. Change one hypothesis at a time. Keep the failing example after the fix and turn it into a regression check.

After twenty minutes with no new evidence, write the smallest reproduction and consult one relevant resource in **Library**. Avoid opening five new courses. More explanations help only when they answer the question you have identified.

## Your route through the program

Every stage contains six lessons. Use the chapter map in [CURRICULUM-MAP.md](CURRICULUM-MAP.md) to navigate the book by chapter and section rather than PDF page number. Printed pages and PDF viewer pages can differ.

| Stage | Focus | Portfolio artifact | Estimated project effort |
| --- | --- | --- | --- |
| 1 | Values, expressions, control flow, and explicit decisions | Dispatch: a decision engine | 6 hours |
| 2 | Objects, arrays, functions, and ownership | Dataset Studio: a data toolkit | 10 hours |
| 3 | Classes, modules, and public contracts | Workflow Kit: a reusable SDK | 12 hours |
| 4 | Standard-library tools, iteration, and async coordination | Research Queue: a resilient collector | 14 hours |
| 5 | Browser interfaces, networking, storage, and usability | Field Notes: a personal workspace | 16 hours |
| 6 | Advanced mechanisms, Node.js, testing, and release | Signal Desk: a full application | 24 hours |

Project estimates are planning aids for a first complete version, not deadlines or guarantees. Optional extensions can substantially increase the effort. Budget additional time for unfamiliar HTML/CSS, debugging, and reviewing previous lessons.

## The 16-week route

Plan approximately 8–12 focused hours per week. Spread work over four sessions: two lesson sessions, one lab/review session, and one project block. The weekly lesson ranges describe pacing, not a requirement to move on with gaps.

| Week | Lessons | Primary work | Evidence checkpoint |
| --- | --- | --- | --- |
| 1 | 1–2 | Runtime orientation and value predictions | A prediction journal and working local setup. |
| 2 | 3–4 | Expressions, conversions, and decisions | Boundary examples you can explain aloud. |
| 3 | 5–6 | Control flow and stage 1 consolidation | Dispatch engine with a decision table. |
| 4 | 7–9 | Structured data and transformations | A small dataset with known expected results. |
| 5 | 10–12 | Functions, ownership, and composition | Dataset Studio with rejection reports. |
| 6 | 13–15 | Objects, classes, and invariants | A workflow transition table and draft API. |
| 7 | 16–18 | Module boundaries and integration | Workflow Kit used by an independent consumer. |
| 8 | 19–20 | Collections and standard-library tools | A justified data-structure choice. |
| 9 | 21–22 | Iteration and asynchronous models | A deterministic timing experiment. |
| 10 | 23–24 | Failure, concurrency, and async practice | Research Queue with failure and cancellation checks. |
| 11 | 25–26 | DOM, events, and forms | One complete keyboard-operable interaction. |
| 12 | 27–28 | Requests, state, and persistence | A reload and recovery walkthrough. |
| 13 | 29–30 | Browser consolidation and polish | Field Notes export/import plus usability review. |
| 14 | 31–32 | Node and advanced integration | Signal Desk contracts and one vertical slice. |
| 15 | 33–34 | Testing and delivery practices | API checks and a primary browser journey. |
| 16 | 35–36 | Capstone integration and release review | Clean setup, demo script, and rubric assessment. |

The topic summaries above describe the broader stage emphasis. Use the lesson’s own title and objective as the exact session assignment.

## The 8-week intensive route

Plan approximately 16–24 focused hours per week. This route assumes you can sustain longer project blocks and have basic comfort using an editor and browser tools. Keep one review block each week; compress the calendar, not the evidence standard.

| Week | Scope | Finish with |
| --- | --- | --- |
| 1 | Stage 1, lessons 1–6 | Dispatch and a reliable prediction habit. |
| 2 | Stage 2, lessons 7–12 | Dataset Studio with explicit ownership rules. |
| 3 | Stage 3, lessons 13–18 | Workflow Kit with a documented public interface. |
| 4 | Stage 4, lessons 19–21 | Standard-library experiments and the collector state model. |
| 5 | Stage 4, lessons 22–24 | Research Queue, including hostile timing scenarios. |
| 6 | Stage 5, lessons 25–30 | Field Notes with persistence and keyboard review. |
| 7 | Stage 6, lessons 31–33 | Signal Desk API, client, and persistence integration. |
| 8 | Stage 6, lessons 34–36 | Tests, clean setup, final demo, and portfolio reflection. |

If a stage takes longer, move the calendar. Do not count an inspected solution as an independent implementation. A finished smaller project teaches more than an oversized collection of disconnected starter files.

## Review and mastery checks

After a day, retry one exercise without notes. After a week, solve a variation. At the end of a stage, explain one key mechanism, debug one intentional defect, and demonstrate the project. A useful advancement threshold is:

- You can explain the stage’s main ideas without reading a definition.
- You can solve a small new problem using them, with documentation available.
- You can show at least one meaningful failure case and how the program handles it.
- Your stage project meets its required milestones and you can justify your rubric score.

The project rubrics total 100 points each. Aim for at least 80, with no missing core workflow, before beginning optional extensions. This is a self-assessment guideline, not an accredited examination or external certification.

Use external practice selectively. Exercism and small Codewars kata support fluency. JavaScript30 supports browser building. The Odin Project provides additional project structure. Full Stack Open is an extension after the core route. Free books in the library are published or maintained by their authors; link out to them rather than copying them into your own distribution.

## Saving, backups, and device changes

The portal stores learning progress, notebook content, and saved lab code in your browser’s local storage. This storage belongs to the site origin and browser profile. A different browser, port, hostname, or device can have a separate workspace. Clearing site data or using a temporary private-browsing session can remove saved work.

Use **My notebook → Export backup** at the end of each week and before clearing browser data or changing devices. Save the downloaded JSON somewhere you control. To restore it, open the destination portal and use **Import backup**. Export the destination’s current workspace first so you retain a recovery copy. Inspect your progress, notebook, and a saved lab after import.

A backup is a file you own; the portal does not provide cloud retention. Keep at least one copy outside the browser profile. The selected book PDF is not part of a progress backup. Select it again from your local files after a reload or on a new device.

**Download handbook** provides this guide for offline reference. The built-in lab executes code in a worker with a three-second timeout. It is a learning aid with visible checks, not a secure remote grading service. Larger programs, DOM experiments, and Node projects should be run in their appropriate environments.

## The notebook template

```text
Date / lesson:
Today I will be able to:
Book chapter or section:
My prediction:
Observed result:
The assumption I corrected:
The test or example that proves it:
One variation I solved without help:
Next experiment:
```

For project work, add “current milestone,” “known limitation,” and “next smallest deliverable.” Before a review session, read the corrected assumptions first; they are the most personal and useful part of your learning record.

## Portfolio delivery standard

A project is ready to present when someone else can understand its purpose, run it from documented steps, and complete its main workflow. Include source, realistic synthetic data, tests appropriate to the risks, a README, known limitations, and a short demo script. Document one tradeoff and one bug you investigated. Do not claim production readiness or security properties you have not established.

Keep the original book PDF and personal progress backups outside any public distribution. This program provides original companion explanations, exercises, and project specifications; it does not replace or redistribute the book. External resource availability and course terms can change. Resource entries record the verification date so future maintenance can be deliberate.
