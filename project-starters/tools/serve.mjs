import { createServer } from "node:http";
import { resolve } from "node:path";
import { serveStatic } from "./static-files.mjs";
const directory = resolve(process.argv[2] || "public");
const port = Number(process.argv[3] || 4175);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Provide a valid port");
const server = createServer((request, response) => { void serveStatic(request, response, directory); });
server.on("error", error => { console.error(`Server could not start: ${error.message}`); process.exitCode = 1; });
server.listen(port, "127.0.0.1", () => console.log(`Starter available at http://127.0.0.1:${port} — Ctrl-C to stop`));
