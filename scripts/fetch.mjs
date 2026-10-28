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

// Liest nur so viel vom Feed, bis `items` Folgen komplett da sind (manche Feeds sind riesig und langsam).
async function readHead(res, items) {
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let text = "", count = 0;
  while (count < items) {
    const { done, value } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
    count = (text.match(/<\/item>/g) || []).length;
  }
  await reader.cancel().catch(() => {});
  return text;
}

// Pro Quelle eine Folge: die jüngste – oder, bei feed.random = N, eine der letzten N Folgen.
// Die Auswahl hängt nur vom Datum ab, damit beide Tagesläufe dieselbe Folge nehmen.
const dayIndex = Math.floor(Date.now() / 86400000);

async function pickEpisode(feed) {
  const res = await fetch(feed.url, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { "user-agent": "Mozilla/5.0 (Morgendehnen feed fetcher)" },
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const xml = await readHead(res, Math.max(MAX_ITEMS, feed.random || 0));
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
      ...(feed.skipShort ? { skipShort: true } : {}),
    });
    if (episodes.length >= Math.max(MAX_ITEMS, feed.random || 0)) break;
  }
  if (!episodes.length) throw new Error("keine Folge im Feed");
  episodes.sort((a, b) => b.published.localeCompare(a.published));
  const pool = Math.min(episodes.length, feed.random || 1);
  return episodes[dayIndex % pool];
}

// Alle Quellen eines Kanals; die App wählt beim Start zufällig eine davon.
async function allOf(feeds) {
  const results = await Promise.allSettled(feeds.map(pickEpisode));
  const ok = [];
  results.forEach((r, i) => {
    if (r.status === "fulfilled") ok.push(r.value);
    else console.error(`FEHLER ${feeds[i].show}: ${r.reason.message}`);
  });
  return ok;
}

const config = JSON.parse(await readFile(join(root, "feeds.json"), "utf8"));
let previous = { channels: {} };
try { previous = JSON.parse(await readFile(OUT, "utf8")); } catch {}

const channels = {};
for (const key of Object.keys(config)) {
  if (key === "radio") continue;
  const eps = await allOf(config[key]);
  if (eps.length) {
    channels[key] = eps;
    eps.forEach((ep) => console.log(`${key}: ${ep.show} – ${ep.title} (${ep.published})`));
  } else if (previous.channels[key]) {
    channels[key] = [].concat(previous.channels[key]);
    console.warn(`${key}: behalte vorherigen Eintrag`);
  }
}
if (config.radio) {
  channels.radio = [{ title: config.radio.title, show: config.radio.title, audio: config.radio.stream, live: true }];
}

const data = { updated: new Date().toISOString(), channels };
await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(data, null, 2) + "\n");
console.log("geschrieben:", OUT);
