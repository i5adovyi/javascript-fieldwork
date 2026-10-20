import { readFile } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8" };

export async function serveStatic(request, response, directory) {
  if (!["GET", "HEAD"].includes(request.method)) {
    response.writeHead(405, { Allow: "GET, HEAD" }); response.end("Method not allowed"); return;
  }
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname); }
  catch { response.writeHead(400); response.end("Invalid URL"); return; }
  const root = resolve(directory);
  const target = resolve(root, `.${pathname === "/" ? "/index.html" : pathname}`);
  if (!target.startsWith(root + sep)) {
    response.writeHead(403); response.end("Forbidden"); return;
  }
  try {
    const bytes = await readFile(target);
    response.writeHead(200, { "Content-Type": types[extname(target)] || "application/octet-stream", "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" });
    response.end(request.method === "HEAD" ? undefined : bytes);
  } catch (error) {
    response.writeHead(error.code === "ENOENT" || error.code === "EISDIR" ? 404 : 500);
    response.end(error.code === "ENOENT" || error.code === "EISDIR" ? "Not found" : "Unable to read file");
  }
}
