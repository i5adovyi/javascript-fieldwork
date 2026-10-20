import { createApp } from "./app.js";
const port = 4176;
const server = createApp();
server.on("error", error => { console.error(`Server could not start: ${error.message}`); process.exitCode = 1; });
server.listen(port, "127.0.0.1", () => console.log(`Signal Desk starter: http://127.0.0.1:${port} — Ctrl-C to stop`));
// TODO SD5: Create and inject the repository, then define graceful shutdown behavior.
