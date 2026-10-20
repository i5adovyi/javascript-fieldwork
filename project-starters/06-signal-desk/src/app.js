import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { serveStatic } from "../../tools/static-files.mjs";
const publicDirectory = fileURLToPath(new URL("../public/", import.meta.url));
function json(response, status, data) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" });
  response.end(JSON.stringify(data));
}
export function createApp({ repository } = {}) {
  return createServer((request, response) => {
    const pathname = new URL(request.url, "http://localhost").pathname;
    if (pathname === "/api/health" && request.method === "GET") {
      json(response, 200, { ok: true, service: "signal-desk-starter" }); return;
    }
    if (pathname === "/api/incidents" || pathname.startsWith("/api/incidents/")) {
      // TODO SD4: Parse bounded request bodies, validate input, and call the repository.
      // Map invalid input, missing records, and storage failure to documented HTTP responses.
      json(response, 501, { error: "Incident endpoints are a learning TODO; no data has been saved." }); return;
    }
    if (pathname.startsWith("/api/")) {
      json(response, 404, { error: "Unknown API route" }); return;
    }
    void serveStatic(request, response, publicDirectory);
  });
}
