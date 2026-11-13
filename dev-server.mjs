// Local preview: npm run dev, then open http://localhost:3000
// Serves /public and runs the /api functions. Data is kept in memory and
// the admin password is "admin123" unless you set ADMIN_PASSWORD.
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

process.env.ABT_MEMORY_DB ??= "1";
process.env.ADMIN_PASSWORD ??= "admin123";

const root = path.dirname(fileURLToPath(import.meta.url));
const pub = path.join(root, "public");
const port = Number(process.env.PORT) || 3000;
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".json": "application/json", ".txt": "text/plain", ".xml": "application/xml", ".png": "image/png", ".ico": "image/x-icon" };

async function api(name, req, res, url) {
  let mod;
  try { mod = await import(pathToFileURL(path.join(root, "api", name + ".js")).href); }
  catch { res.statusCode = 404; return res.end("not found"); }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString();
  try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = {}; }
  req.query = Object.fromEntries(url.searchParams);
  res.status = (c) => { res.statusCode = c; return res; };
  res.json = (o) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(o)); return res; };
  await mod.default(req, res);
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  try {
    if (url.pathname.startsWith("/api/")) return await api(url.pathname.slice(5).replace(/[^a-z_]/g, ""), req, res, url);
    let p = decodeURIComponent(url.pathname);
    if (p.endsWith("/")) p += "index.html";
    if (!path.extname(p)) p += ".html";
    const file = path.join(pub, path.normalize(p));
    if (!file.startsWith(pub)) { res.statusCode = 403; return res.end(); }
    const data = await fs.readFile(file);
    res.setHeader("Content-Type", types[path.extname(file)] || "application/octet-stream");
    res.end(data);
  } catch {
    res.statusCode = 404; res.end("Not found");
  }
}).listen(port, () => console.log(`AB Traders preview: http://localhost:${port}  (admin password: ${process.env.ADMIN_PASSWORD})`));
