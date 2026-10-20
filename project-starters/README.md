# JavaScript Fieldwork · Project starter kits

Six small, dependency-free starting points accompany the portfolio briefs. **These are teaching scaffolds, not completed projects.** Named TODOs identify the work you will do. Implemented utilities have passing checks; unimplemented acceptance behavior is clearly marked with `test.todo` and does not count as delivered functionality.

Use Node.js 22 or newer and npm. No `npm install` is required: every script uses Node built-ins. Keep this directory together because the browser starter uses the shared `tools/serve.mjs` utility. All supplied data is synthetic.

| Folder | Project | Start command | Current scaffold |
| --- | --- | --- | --- |
| 01-dispatch | Dispatch / a decision engine | `npm start` | Prints a request fixture and the next TODO. |
| 02-dataset-studio | Dataset Studio / records with integrity | `npm start` | Loads 50 records with known anomalies. |
| 03-workflow-kit | Workflow Kit / a tiny reusable SDK | `npm start` | Shows the proposed state vocabulary. |
| 04-research-queue | Research Queue / resilient async work | `npm start` | Runs one deterministic fake request. |
| 05-field-notes | Field Notes / a personal research workspace | `npm start` | Serves a labelled form and safe text rendering at http://127.0.0.1:4175. |
| 06-signal-desk | Signal Desk / the release capstone | `npm start` | Serves an API health check and a browser shell at http://127.0.0.1:4176. |

## Working on a starter

1. Change into the numbered directory. Read its README and `SOLUTION-NOTES.md`.
2. Run `npm test`. Expect one passing utility test and three TODO acceptance cases in each starter. The TODO count is intentional and is not evidence that the project requirements are already met.
3. Run `npm start`, then open the local address for browser projects. Stop a server with Ctrl-C.
4. Turn one `test.todo(...)` into a real `test(...)` with the described assertions. First confirm it fails for the missing behavior, then implement the smallest change that makes it pass.
5. Work through the milestones, add tests for additional risks, and score the rubric honestly.

The provided tests explain contracts; they do not exhaust the project requirements. The larger briefs, rubrics, and stretch tasks remain your definition of the work. Do not ship TODO functions as completed features. Server starters bind only to the local machine and are not production deployments.

The kits do not contain the reference book, accounts, secrets, or external service credentials. Progress in these separate projects is independent of the portal's browser progress storage. Commit your own code or back it up as normal project files.
