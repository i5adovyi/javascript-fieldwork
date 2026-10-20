# Run JavaScript Fieldwork online or locally

The same `dist/` app supports two storage modes. **Local mode saves to a SQLite database on your computer. Hosted mode saves in your browser.** Source code, private learner data, and hosted Site ownership stay separate.

Open **Run anywhere** in the portal to see where you are running and whether local saves have reached the database.

| Mode | Start | Where learning data lives |
| --- | --- | --- |
| Local desktop project | `npm start` or `npm run start:open` | SQLite in your user application-data directory; browser keeps pending edits |
| OpenAI Site | Open your published URL or `npm run open:hosted` | Browser storage for that URL and browser profile |
| Static preview | `npm run start:static` | Browser storage; does not open the SQLite database |

The PDF itself stays in the browser's private IndexedDB if you select **Remember PDF**. It is never placed in SQLite, GitHub, or a Site deployment.

## Start the local desktop project

Install **Node.js 22.13 or newer**; Node.js 24 LTS is recommended. The bundled app needs no package installation and uses Node's built-in SQLite support.

```sh
cd javascript-fieldwork
npm run start:open
```

Open <http://localhost:4187> if your browser does not open automatically. Keep Terminal open while studying; Control-C stops the server. `npm start` starts without opening a browser.

On macOS, double-click **Start Fieldwork.command**. On Windows, double-click **Start Fieldwork.cmd**. On Linux, `npm run start:open` uses `xdg-open` when available. The application runs in your browser with a local Node process; it is not an installed native desktop binary.

The server listens only on loopback. Local learning needs no OpenAI account, subscription, API key, database service, or internet connection. External courses, videos, and documentation need their own internet access.

If port 4187 is occupied, choose another port:

```sh
PORT=4197 npm start
```

PowerShell:

```powershell
$env:PORT=4197
npm start
```

Keep using the same hostname and port for the PDF and browser state. The SQLite file is independent of the port, but browser storage is not: `localhost`, `127.0.0.1`, different ports, and browser profiles have different pending edits and remembered PDFs. Do not open `dist/index.html` with `file://`.

## Where local saves live

The local server stores progress, quiz answers, project and incident notes, lab/example drafts, and private reader annotations in:

| Operating system | Default database |
| --- | --- |
| macOS | `~/Library/Application Support/JavaScript Fieldwork/fieldwork.sqlite` |
| Windows | `%LOCALAPPDATA%\JavaScript Fieldwork\fieldwork.sqlite` |
| Linux | `${XDG_DATA_HOME:-~/.local/share}/javascript-fieldwork/fieldwork.sqlite` |

The server prints the actual directory. These files are outside the Git checkout and are not served as website assets. The database survives server restarts, browser sessions, code updates, moving the project folder, and OpenAI account changes on the same operating-system user account. It is ordinary private local data, not an encrypted vault or an off-device backup.

Use `FIELDWORK_DATA_DIR` to choose a separate data directory, for example for another learner or a test profile:

```sh
FIELDWORK_DATA_DIR="$HOME/Fieldwork-personal-data" npm start
```

PowerShell:

```powershell
$env:FIELDWORK_DATA_DIR="$env:LOCALAPPDATA\Fieldwork-personal-data"
npm start
```

Do not choose the repository, `dist`, a publicly served folder, or a shared/cloud-sync directory for private data. The server rejects the deployment directory. A different data directory starts a different database; changing it does not migrate the old one.

The interface reports database availability, pending writes, and conflicts. Let pending changes finish before closing the server. If a database write fails, preserve the browser's pending changes and follow the displayed retry/recovery action. Do not clear browser storage to fix a saving error. If another session changed the same record, resolve the conflict explicitly instead of assuming the older tab should win.

## Back up and recover

Open **Data & backups** for complete textual-data backups. **Export this window** includes this browser's current records, including pending edits; **Export database** downloads the committed SQLite snapshot and is available when connected locally. **Import all-data backup** validates the file, asks before replacing matching keys, and keeps a recovery copy before applying it. Neither export includes the PDF.

Use these full backups to move all supported records together. The original, smaller exports remain available:

1. In **My notebook**, export a progress backup.
2. In the private reader, use **Your book notes → Export notes** for reading position and annotations.
3. Keep both JSON files and your original PDF outside the source folder.
4. In the destination, export any existing work before importing. Import progress in **My notebook**, then book notes in the reader.
5. Choose the original PDF and optionally select **Remember PDF**.
6. Check a completed lesson, an edited lab, and a book note. In local mode, wait for the database save status before closing.

For a complete file-level backup of the local database, finish pending saves, stop Fieldwork with Control-C, and copy the whole application-data directory to a private backup location. Stop the server before restoring that directory, too. Do not copy only `fieldwork.sqlite` while the app is running: SQLite may have recent changes in its `-wal` sidecar. A database backup does not contain the PDF, which stays in browser storage; keep your original book file separately.

To move the entire local database to another computer, stop both servers, preserve the destination's current database directory, copy the backed-up directory into its appropriate application-data location, then start Fieldwork. Avoid overwriting an existing learner's data accidentally. Use JSON import when you want to merge supported learner records instead of replacing the whole database.

Browser pending edits that have not reached SQLite are not part of a file-level database backup. Resolve failures or export from the active browser before moving machines. Hosted browser storage can be lost through data clearing, private browsing, or eviction; keep exported backups even when you usually use the hosted app.

## OpenAI Sites

The original published copy is <https://javascript-fieldwork-igor.igor-sadovyi87.chatgpt.site/>. `npm run open:hosted` opens the URL configured for this source checkout. A new-account export starts with that link blank until its own Site is published and configured.

The existing deployment identity is in `.openai/hosting.json`. To update the same Site, use its owning account and the Sites skill. That workflow synchronizes source, packages `dist`, saves a version, and deploys it. Preserve the existing audience. A GitHub push alone does not publish a Site.

The local SQLite server is **not** deployed with `dist`. A hosted Site does not reach into your laptop or upload your local saves. There is no automatic cloud synchronization. This app makes no AI API calls while you study. Hosting access, availability, and limits follow the provider's current terms.

For a different account, follow [Open Fieldwork in another account](NEW-ACCOUNT.md). Use `npm run prepare:new-account` to make a clean source copy with no old Site identity. The command never changes the original Site and never publishes by itself. Do not paste credentials into source files.

## GitHub and continued development

Source repository: [i5adovyi/javascript-fieldwork](https://github.com/i5adovyi/javascript-fieldwork). It is private; sign into GitHub with an authorized account.

```sh
git clone https://github.com/i5adovyi/javascript-fieldwork.git
cd javascript-fieldwork
npm start
```

Open that folder as a local project in Codex to work on it under the OpenAI account you choose. See [the new-account guide](NEW-ACCOUNT.md) for the exact workflow and a ready-to-paste prompt. GitHub permissions are independent of your OpenAI subscription.

In the original checkout, the remote is named `github`; use `git push github main`. A fresh clone normally calls its remote `origin`, so use `git push origin main` there. Do not force-push over an existing repository. Changes to the second account's Site identity belong in its separate source history, not on the original main branch.

No GitHub Actions, GitHub Pages, automatic cloud deployment, or paid hosting integration is enabled. You choose when to publish a Site update.

Run `npm test` before committing or publishing. Run `npm run materials` after editing learner manuals. Windows/Linux launcher behavior should be verified on those operating systems before distribution; the automated tests check command construction and local server behavior.
