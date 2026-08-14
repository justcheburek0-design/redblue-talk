/* Serve Next.js static export under its configured /redblue base path. */
const http = require('node:http');
const { createReadStream, existsSync, statSync } = require('node:fs');
const { extname, join, normalize } = require('node:path');

const host = process.env.HOST ?? '127.0.0.1';
const port = Number(process.env.PORT ?? 4174);
const exportRoot = join(__dirname, '..', 'out');
const basePath = '/redblue';
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

if (!existsSync(join(exportRoot, 'index.html'))) {
  throw new Error('Static export missing. Run npm run build first.');
}

http.createServer((request, response) => {
  const requestPath = new URL(request.url, `http://${host}:${port}`).pathname;
  if (requestPath !== basePath && !requestPath.startsWith(`${basePath}/`)) {
    response.writeHead(404).end('Not found');
    return;
  }

  const relativePath = requestPath.slice(basePath.length).replace(/^\/+/, '');
  const candidate = normalize(join(exportRoot, relativePath || 'index.html'));
  if (!candidate.startsWith(`${exportRoot}/`) || !existsSync(candidate)) {
    response.writeHead(404).end('Not found');
    return;
  }

  const filePath = statSync(candidate).isDirectory() ? join(candidate, 'index.html') : candidate;
  if (!existsSync(filePath)) {
    response.writeHead(404).end('Not found');
    return;
  }

  response.writeHead(200, { 'content-type': contentTypes[extname(filePath)] ?? 'application/octet-stream' });
  createReadStream(filePath).pipe(response);
}).listen(port, host, () => console.log(`Static export: http://${host}:${port}${basePath}/`));
