// Development-only QA server. It serves the real dist assets and an original,
// synthetic-PDF test harness; it never reads the user's reference book.
import {createServer} from 'node:http';
import {readFile, realpath} from 'node:fs/promises';
import {dirname, extname, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const tests = dirname(fileURLToPath(import.meta.url));
const dist = await realpath(resolve(tests, '../dist'));
const harness = await realpath(resolve(tests, 'book-reader-browser.html'));
const port = process.env.PORT === undefined ? 4197 : Number(process.env.PORT);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new RangeError('PORT must be an integer from 1 through 65535.');
}
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.wasm': 'application/wasm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf'
};

createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, {'Allow': 'GET, HEAD'}).end('Method not allowed');
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    if (pathname.includes('\0')) throw new Error('Invalid path');
    const requested = pathname === '/__reader-qa'
      ? harness
      : resolve(dist, `.${pathname === '/' ? '/index.html' : pathname}`);
    const path = await realpath(requested);
    if (path !== harness && !path.startsWith(dist + sep)) throw new Error('Invalid path');
    const body = await readFile(path);
    response.writeHead(200, {
      'Content-Type': types[extname(path)] || 'application/octet-stream',
      'Content-Length': body.byteLength,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'}).end('Not found');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Private reader QA: http://127.0.0.1:${port}/__reader-qa`);
  console.log('Uses generated synthetic PDFs only. This server is for local development.');
});
