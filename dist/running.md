# Run JavaScript Fieldwork online or locally

Both modes use the same `dist/` application. No separate code branch or build is needed.
Open **Run anywhere** in the portal to see the current mode and the links for each copy.

## OpenAI Sites

Open <https://javascript-fieldwork-igor.igor-sadovyi87.chatgpt.site/>.
You can also run `npm run open:hosted` from this project to open that URL.
No local server is needed to visit the hosted copy.

The existing deployment identity is in `.openai/hosting.json`. To update this same Site,
ask Codex to publish the project through Sites. The Sites workflow synchronizes source,
packages `dist/`, saves a version, and deploys it. A GitHub push alone does not publish
to Sites. Do not put source credentials or API keys into the repository.

Hosting availability and pricing follow the provider's current terms. This static
app does not invoke an AI model while you read or run exercises.

## Localhost

Install Node.js 20.11 or newer if needed. No package installation is required for the
checked-in application.

From the project folder:

```sh
npm start
```

Open <http://localhost:4187>. Keep that terminal open; Control-C stops the server.
To start the server and open your default browser together:

```sh
npm run start:open
```

On macOS, double-click `Start Fieldwork.command`. On Windows, double-click
`Start Fieldwork.cmd`. Both launch the same local server and browser.
On Linux, `npm run start:open` uses `xdg-open`; if no desktop opener is available,
use the printed address yourself.

If port 4187 is occupied, use a chosen alternative:

```sh
PORT=4197 npm start
```

In PowerShell:

```powershell
$env:PORT=4197
npm start
```

The server binds only to loopback, not the local network. Use the same hostname
and port on future visits: `localhost` and `127.0.0.1`, or two different ports,
have separate browser storage. Do not open `dist/index.html` using `file://`.

Local learning needs no OpenAI account, subscription, API key, or hosted backend.
External videos and documentation still require internet access.

## Transfer your progress

There is no automatic synchronization between the two copies.

1. In the source copy, use **My notebook → Export backup**.
2. In the reader, separately use **Your book notes → Export notes**.
3. Open the destination copy. Export any existing work there before importing.
4. Import the progress backup in **My notebook**.
5. Choose your original local PDF, import book notes, and select **Remember PDF**.
6. Check a completed lesson, an edited lab, and a book note.

Neither backup includes the PDF. Keep the original book and private exports outside
the project folder. The app never uploads your selected PDF.

## GitHub source and continued development

The private source repository is [i5adovyi/javascript-fieldwork](https://github.com/i5adovyi/javascript-fieldwork). Sign in to GitHub with an authorized account.

```sh
git clone https://github.com/i5adovyi/javascript-fieldwork.git
cd javascript-fieldwork
npm start
```

Keep the complete project source in a repository you control. Clone or download
the repository, enter its folder, and run `npm start`. GitHub is a source backup;
it is not required while the app runs locally.

In this original checkout the remote is named `github`; use `git push github main` for future commits. A fresh clone normally uses `origin`, so use `git push origin main` there.

For a checkout without the GitHub remote, after configuring Git authentication:

```sh
git remote add github https://github.com/i5adovyi/javascript-fieldwork.git
git push -u github main
```

Do not force-push over an existing repository. Keep the Sites identity for updates
to the original hosted Site; it does not transfer Site ownership to another account.
A new Site under another account needs its own identity.

This project does not enable GitHub Actions, GitHub Pages, automatic cloud deployment,
or a paid hosting integration. You choose when to publish a Sites update.

Run `npm test` before publishing. Run `npm run materials` after editing learner
manuals. Node 20.11+ is the runtime floor; Windows/Linux browser launchers should
be verified on those operating systems if you plan to distribute them.
