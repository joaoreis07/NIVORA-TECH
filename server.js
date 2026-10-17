import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png' };

createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let path = pathname.startsWith('/images/')
      ? normalize(join(root, 'public', pathname.slice(1)))
      : normalize(join(root, pathname));
    if (!path.startsWith(root)) throw new Error('Invalid path');
    try {
      if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
      const body = await readFile(path);
      res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      if (pathname === '/projetos' || pathname === '/projetos/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(await readFile(join(root, 'index.html')));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Página não encontrada');
      }
    }
  } catch {
    res.writeHead(400);
    res.end('Solicitação inválida');
  }
}).listen(4173, '127.0.0.1', () => console.log('NIVORA TECH disponível em http://127.0.0.1:4173'));
