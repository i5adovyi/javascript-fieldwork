# JavaScript Fieldwork · Learner handbook

A reference book becomes a skill when you use it to make predictions, write programs, investigate failures, and explain your decisions. This program pairs your own copy of David Flanagan’s *JavaScript: The Definitive Guide, Seventh Edition* with 36 lessons across six stages, practical labs, original field notes, curated resources, and six portfolio project briefs.

The objective is independent capability: you can take a small problem, choose a representation, build a solution, test its boundaries, and explain how it works. Progress indicators record activity. Your programs and explanations provide stronger evidence of learning.

## Start here

1. Open **Overview** and choose the first lesson in **Learning path**. Read the stated objective before opening any reference.
2. Select **Read beside lesson**, then **Choose PDF**, and select your own local copy. The reader sits beside the lesson on desktop and stacks with it on mobile. Choose an assigned reading range to open its first PDF page. The book is not included in the portal or its downloadable materials.
3. Keep an editor, browser developer tools, and a notebook available. The built-in **Practice lab** is suitable for focused language exercises; larger portfolio projects belong in their own working folders.
4. Write a prediction, attempt the exercise, and use **Run tests**. If you are stuck, use **Hint** before **View solution**. A passing lab is marked complete automatically. Use **Mark complete** for a lesson when you have done the work; quizzes help you check understanding but do not replace an implementation.
5. End the session in **My notebook**. Write what changed in your understanding and the next experiment you will run.

The portal is a local learning workspace. It has no account or cloud synchronization. Once it has loaded and its assets are cached, the app can be used offline; external courses, documentation, and YouTube videos still need a connection. Your locally selected book must be available on your device.

## Read and annotate your own book

The reader maps all 36 lessons to 97 reading ranges in the supplied 1,245-page PDF of *JavaScript: The Definitive Guide*, seventh edition (2020). A page jump means a physical position in that PDF, counted from its first page; it is not a printed page number. If your edition or PDF pagination differs, use the assignment’s chapter and section reference and navigate manually. A boundary page may belong to two neighboring ranges because it contains the end of one section and the start of another.

Use **Read beside lesson** to keep the explanation and the assigned reading together. After choosing your PDF, select a reading range or use the reader’s page navigation. On a narrow screen, the reader and lesson stack so you can move between them without reducing the book to an unreadable column.

To leave evidence of your reading, select text and choose a highlight color. Add a note either to that selection or to the current page. Write a prediction, a question, or an explanation in your own words. You can edit or delete annotations and use undo to reverse an annotation change. Page notes help when a thought concerns a whole example rather than one selectable phrase. Book annotations stay separate from your lesson reflections and project logs.

The bundled PDF.js reader reads the selected file’s bytes on your device. Select **Remember PDF** to store one private copy in this browser’s IndexedDB and reopen it after reload. The PDF is never uploaded, added to the application’s offline cache, or copied into the repository. A fingerprint identifies the matching copy and restores its last page, highlights, and notes. A different PDF may have a different fingerprint even if its title looks the same.

Closing the reader keeps it closed after reload; opening it again restores the remembered PDF without a chooser. Choosing another PDF does not replace the remembered copy until you select **Remember PDF**. **Forget PDF** removes only the remembered copy; your original file and annotations remain. **Release PDF** closes the session’s document while retaining its remembered copy. If browser storage is unavailable or full, the reader reports the failure and lets you keep reading for the session.

Private book notes have their own export and import controls in the reader. Export them separately from your general progress backup, and keep the annotation file somewhere you control. Neither export includes the PDF itself. There is no account or cloud synchronization; clearing browser data removes annotations unless you have a backup. On another browser or device, choose the matching PDF and import your private book notes to restore them.

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

Every stage contains six lessons. Use the mapped reading ranges in the lesson’s reader for the supplied PDF, and consult [CURRICULUM-MAP.md](CURRICULUM-MAP.md) for chapter and section coverage. The reader uses physical PDF positions; printed page numbers and differently paginated copies can differ.

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

A general progress backup is separate from a private book annotation backup. Use the reader’s export/import controls for reading positions, highlights, and book notes; **My notebook → Export backup** preserves your learning workspace instead. Export both before changing browsers or clearing site data. Inspect a highlighted passage and a book note after restoring annotations.

These backups are files you own; the portal does not provide cloud retention. Keep at least one copy outside the browser profile. The selected book PDF is not part of either backup and is not cached with the app. After choosing **Remember PDF**, reloads restore the local copy automatically. On a new browser, device, or URL, select the matching original file and remember it once. Clearing browser data, private browsing, and browser storage eviction can remove the remembered copy.

**Download handbook** provides this guide for offline reference. The built-in lab executes code in a worker with a three-second timeout. It is a learning aid with visible checks, not a secure remote grading service. Larger programs, DOM experiments, and Node projects should be run in their appropriate environments.

## Changing your OpenAI account

The public portal has no learner login, and the complete local app runs without ChatGPT. Save the full source ZIP or project folder, your progress backup, your private book-note backup, and your original PDF before switching accounts. The study pack is only the learning documents; it is not the full app.

A new account’s in-app browser may have separate storage. Import both JSON backups there and select your original PDF once, then choose **Remember PDF**. To keep working on the code, attach the existing project folder to a local project under the new account. The source backup does not transfer the old conversation or hosted Site ownership.

For independent access on macOS, open **Start Fieldwork.command** in the full project folder, or run `npm start` with Node.js 20.11 or newer. Use the same printed localhost URL on later visits. The app also supports static HTTPS hosting of `dist/`. The full [account-switch guide](account-switch.md) explains restoration and continued development.

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
