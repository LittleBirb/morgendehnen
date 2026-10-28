// Minimaler statischer Server für lokale Tests: npm run serve -> http://localhost:8080
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(import.meta.url), "..", "..");
const types = { ".html": "text/html; charset=utf-8", ".json": "application/json", ".js": "text/javascript", ".css": "text/css" };

createServer(async (req, res) => {
  let p = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (p.endsWith("\\") || p.endsWith("/")) p += "index.html";
  try {
    const body = await readFile(join(root, p));
    res.writeHead(200, { "content-type": types[extname(p)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404); res.end("not found");
  }
}).listen(8080, () => console.log("http://localhost:8080"));
