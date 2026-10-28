// Holt die jeweils neueste Folge der Podcast-Feeds aus feeds.json und schreibt data/today.json.
// Keine Abhängigkeiten (Node >= 18).
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "data", "today.json");
const TIMEOUT_MS = 20000;
const MAX_ITEMS = 5; // so viele <item> pro Feed werden gelesen; die jüngste zählt

function decode(s) {
  return s
    .replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, "$1")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, "&").trim();
}
function tag(block, name) {
  const m = block.match(new RegExp("<" + name + "(?:\\s[^>]*)?>([\\s\\S]*?)</" + name + ">"));
  return m ? decode(m[1]) : "";
}
function duration(s) {
  if (!s) return null;
  const p = s.split(":").map(Number);
  if (p.some(Number.isNaN)) return null;
  return p.reduce((acc, n) => acc * 60 + n, 0);
}

async function latestEpisode(feed) {
  const res = await fetch(feed.url, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { "user-agent": "Mozilla/5.0 (Morgendehnen feed fetcher)" },
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const xml = await res.text();
  const episodes = [];
  for (const m of xml.matchAll(/<item[\s>][\s\S]*?<\/item>/g)) {
    const block = m[0];
    const enc = block.match(/<enclosure\s[^>]*url="([^"]+)"/);
    const published = new Date(tag(block, "pubDate"));
    if (!enc || Number.isNaN(published.getTime())) continue;
    episodes.push({
      title: tag(block, "title"),
      show: feed.show,
      audio: decode(enc[1]),
      duration: duration(tag(block, "itunes:duration")),
      published: published.toISOString(),
    });
    if (episodes.length >= MAX_ITEMS) break;
  }
  if (!episodes.length) throw new Error("keine Folge im Feed");
  return episodes.sort((a, b) => b.published.localeCompare(a.published))[0];
}

async function bestOf(feeds) {
  const results = await Promise.allSettled(feeds.map(latestEpisode));
  const ok = [];
  results.forEach((r, i) => {
    if (r.status === "fulfilled") ok.push(r.value);
    else console.error(`FEHLER ${feeds[i].show}: ${r.reason.message}`);
  });
  if (!ok.length) return null;
  return ok.sort((a, b) => b.published.localeCompare(a.published))[0];
}

const config = JSON.parse(await readFile(join(root, "feeds.json"), "utf8"));
let previous = { channels: {} };
try { previous = JSON.parse(await readFile(OUT, "utf8")); } catch {}

const channels = {};
for (const key of Object.keys(config)) {
  if (key === "radio") continue;
  const ep = await bestOf(config[key]);
  if (ep) { channels[key] = ep; console.log(`${key}: ${ep.show} – ${ep.title} (${ep.published})`); }
  else if (previous.channels[key]) { channels[key] = previous.channels[key]; console.warn(`${key}: behalte vorherigen Eintrag`); }
}
if (config.radio) {
  channels.radio = { title: config.radio.title, show: config.radio.title, audio: config.radio.stream, live: true };
}

const data = { updated: new Date().toISOString(), channels };
await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(data, null, 2) + "\n");
console.log("geschrieben:", OUT);
