# Open Fieldwork in another account

Your source, learner data, and hosted Site are separate. Changing an OpenAI account does not change ownership of the GitHub repository or automatically transfer the old Site. Local learning does not need an OpenAI account at all.

## 1. Get the source

Sign in to GitHub with an account that can access the private repository. An OpenAI login alone does not grant that access.

```sh
git clone https://github.com/i5adovyi/javascript-fieldwork.git
cd javascript-fieldwork
```

If this folder is already on your computer, keep using it for local work. Do not copy a personal PDF, learner backup, or database into the project.

Install Node.js 22.13 or newer; Node.js 24 LTS is recommended. The checked-in app needs no package installation:

```sh
npm run start:open
```

The browser opens `http://localhost:4187`. Keep Terminal open while studying. Local progress, drafts, and notes are saved in SQLite outside the repository; signing into another OpenAI account does not remove that file. The remembered PDF is still private browser storage.

## 2. Open the folder in Codex

Sign into the desired OpenAI account, then use the desktop app's local project/folder picker to select the project directory. In a project that supports attached folders, use **Edit project → Add folder**. If you use the Codex CLI, run:

```sh
codex -C /absolute/path/to/javascript-fieldwork
```

The CLI must already be installed and signed in. These are folder workflows, not a one-click URL that installs or logs into Codex. See the official [Projects and chats guide](https://learn.chatgpt.com/docs/projects).

Start a chat with:

> Continue JavaScript Fieldwork from this local folder. Read AGENTS.md, README.md, and docs/RUNNING.md. Keep it runnable with npm start, with local SQLite data outside the repository and the PDF only in my browser. Preserve the existing lessons, labs, reader, code editors, and saved-data safeguards. Run the relevant checks before committing. GitHub access is separate from my OpenAI account. Do not publish my database, PDF, notes, backups, or credentials.

This carries the project source and instructions forward. It does not import the previous chat history.

## 3. Prepare a separate Site for the new account

This step is needed only if you want a new hosted URL owned by the other account. You can continue studying locally without doing it.

From the Git checkout, commit any source changes you want included, then run:

```sh
npm run prepare:new-account
```

The command creates a **new sibling folder** named `javascript-fieldwork-new-account`. To choose a different destination:

```sh
npm run prepare:new-account -- --dest /absolute/path/to/fieldwork-another-account
```

The destination’s parent directory must exist. The destination itself must not already exist or be inside the source folder. The export uses **committed HEAD only**: uncommitted edits and untracked files are excluded. It also filters private file patterns, removes Git metadata and the old Site identity, clears the configured hosted URL, and writes `.openai/hosting.json` containing only the static `dist` configuration. The original checkout, Site, GitHub remote, and local database are unchanged. The export does not publish anything or create an account.

Open that new folder in Codex under the new account. Use this prompt:

> Create a new OpenAI Site for JavaScript Fieldwork using this account and this clean folder. Read AGENTS.md and docs/NEW-ACCOUNT.md. This copy has no project_id; do not reuse or modify the old account's Site. Use the Sites skill and this account's available Sites tools. Create a new private Site, persist the exact returned project ID immediately, and follow the supported source, validation, packaging, and publication workflow. Publish dist only. Keep SQLite, PDFs, private notes, backups, and credentials out of source and deployment. After publication, set the returned URL with npm run configure:hosted, validate, and publish the final source. Preserve the local SQLite launch mode. Report the new URL and any account access limitation. Do not claim this transfers the old Site or my browser data.

Sites must be available to the new account. Availability and limits follow that account's current plan and access; this repository cannot grant them. The official [Sites guide](https://learn.chatgpt.com/docs/sites) describes supported publication workflows. If your current Codex surface does not expose Sites tools, continue local development and publish through a supported ChatGPT surface with Sites access.

New Sites start private. The new account can choose a wider audience later. Public launch links do not change access controls. A private Site may require its owner to sign in.

After publication, this command changes only the stored public link:

```sh
npm run configure:hosted -- --url https://the-returned-site.chatgpt.site/
```

Use the exact URL returned by the publishing tool. It does not register a Site, authenticate an account, or change `.openai/hosting.json`. The hosted app also recognizes the current `chatgpt.site` origin so a copied deployment does not send learners to the old account's URL. Run checks and publish the final source after configuring the link.

Keep the second account's Site identity in its own repository or an explicitly chosen branch. Do not push its identity over the original repository's main branch. A source-only update can be carried between copies without copying account identity or learner data.

## 4. Bring your learning data

On the **same computer and operating-system user**, local checkouts use the same default SQLite data directory. Changing OpenAI accounts or moving source folders does not reset it. Use one server at a time, and keep the same local URL for the browser's remembered PDF and pending edits.

A new hosted URL or browser profile has separate browser saves. Before switching, export progress from **My notebook → Export backup** and book annotations from the reader's **Your book notes → Export notes**. Import both in the destination and choose your original PDF there. Select **Remember PDF** once if desired. Neither JSON export includes the book. Hosted pages cannot access your local database automatically.

For a combined backup, open **Data & backups**. **Export this window** includes pending browser edits; **Export database** contains committed local records. **Import all-data backup** restores supported records with an explicit confirmation before replacing matching keys. Neither includes the PDF. For full local backup/recovery and moving to another computer, follow [Run online or locally](running.md). Keep private backups outside the source folder and GitHub. There is no automatic synchronization between a hosted Site and your local database.

## What is ready, and what still requires your new account

The repository supplies the local app, durable local saves, source export, agent instructions, setup guide, and hosted-link configuration. Creating a second account's Site requires signing into that account and running the supported Sites publication workflow there. No second account or Site is created by the export command.
