# Morgendehnen – Plan für die Weiterentwicklung

## Ziel
Eine morgendliche Dehn-Routine (ca. 11 Min.), die sich nicht langweilig anfühlt: Während der Übungen läuft je nach Stimmung ein Nachrichten-Podcast, ein Wissens-Podcast, ein Radiosender oder Lo-Fi-Musik. Alles muss **vollautomatisch** gehen. Die Nutzerin tippt morgens genau einmal (iOS verlangt eine Geste für Audio), und mit diesem Tipp wählt sie gleichzeitig die Stimmung.

Genutzt wird die Seite auf dem iPhone in Safari. Eine iOS-Kurzbefehl-Automation („Ladegerät getrennt“) öffnet die URL automatisch.

## Ausgangslage
`index.html` ist eine fertige, in sich geschlossene Seite (Vanilla JS/CSS, kein Build):
- 5 Dehnungen × 2 Seiten, Haltezeit 60 s (kurze Runde: 30 s), Vorbereitungsphasen 10 s bzw. 6 s
- Deutsche Sprachansage über `speechSynthesis`
- Lo-Fi-Musik live per Web Audio API synthetisiert, inkl. Ducking bei Sprache
- Stilles `<audio>`-Element als iOS-Workaround gegen den Stummschalter (muss erhalten bleiben)
- Screen Wake Lock, SVG-Sonne als Fortschrittsanzeige
- Wochenziel-Balken (5 Runden/Woche) in `localStorage`
- Enthält noch Code für die claude.ai-Runtime (`window.claude.use("db")`). Der ist außerhalb von claude.ai wirkungslos und kann entfernt werden.

## Architektur
- **Hosting:** GitHub Pages (statisch). Hinweis: Pages für private Repos braucht einen bezahlten GitHub-Plan; sonst ist das Repo öffentlich.
- **Datenbeschaffung:** GitHub Action per Cron holt jeden Morgen die Podcast-Feeds (der Browser kann die RSS-Feeds wegen CORS meist nicht direkt lesen) und schreibt `data/today.json` ins Repo. Die MP3s selbst spielt der Browser direkt von den Original-URLs ab.
- Cron in UTC: Winter- und Sommerzeit beachten. Lieber zwei Läufe planen (z. B. 04:30 und 05:30 UTC), da GitHub-Cron sich verspäten kann.
- Kein Framework. Aufteilen in `index.html`, `app.js`, `style.css` ist ok.

### `data/today.json` (Vorschlag)
```json
{
  "updated": "2026-10-29T05:31:00Z",
  "channels": {
    "news":   { "title": "...", "show": "...", "audio": "https://...mp3", "duration": 640, "published": "..." },
    "welt":   { "title": "...", "show": "...", "audio": "https://...mp3", "duration": 720, "published": "..." }
  }
}
```

## Kanäle
| Kanal | Quelle (Vorschlag) | Hinweise |
|---|---|---|
| Nachrichten | „Was jetzt?“ (ZEIT, ~12 Min., 6 Uhr) und „15 Minuten“ (tagesschau, ~15 Min.) | Jüngste Folge aus beiden; Feeds verifiziert am 28.10.2026 |
| Welt (`welt`) | „ABC News Daily“ (Australien, englisch, ~14,5 Min., ein Weltthema im Gespräch) | Neueste Folge; Quarks Daily entfiel (24 Min. zu lang) |
| Radio | egoFM, `https://streams.egofm.de/egoFM-hq` | Stream-URL direkt im `<audio>`, CORS offen, verifiziert |
| Lo-Fi | bestehende Web-Audio-Synthese | Standard-Fallback |

**Wichtig:** Feed- und Stream-URLs recherchieren und verifizieren, nicht raten. Feeds in einer Konfigurationsdatei (`feeds.json`) ablegen, damit sie leicht austauschbar sind.

## Verhalten im Player
- **Startseite:** vier große Stimmungs-Knöpfe (Nachrichten, Welt, Radio, Nur Lo-Fi) statt „Ganze Runde starten“. Zuletzt gewählte Stimmung hervorheben. Kurze Runde bleibt als zweite Option erhalten.
- **iOS-Einschränkung:** `HTMLMediaElement.volume` ist auf iOS schreibgeschützt; Podcast/Radio lässt sich nicht unter die Ansage ducken. Daher:
  - Bei **neuer Übung**: Podcast pausieren, Ansage sprechen, nach `onend` fortsetzen.
  - Bei **Seitenwechsel** und **10 s vor Ende**: nur ein dezenter Gong über Web Audio, keine Sprache.
  - Beim Radio-Stream nach der Pause neu verbinden, falls nötig.
- Lo-Fi-Synthese läuft nur im Lo-Fi-Kanal.
- Pause/Überspringen/Beenden müssen Podcast und Timer gemeinsam steuern.
- Media Session API (Titel der Folge auf dem Sperrbildschirm) ist ein Nice-to-have.

## Fehlerfälle
- `today.json` fehlt oder ist älter als 36 h: trotzdem die letzte bekannte Folge spielen und klein „Folge von gestern“ anzeigen.
- Audio lädt nicht innerhalb von ca. 8 s: automatisch auf Lo-Fi wechseln und kurz Bescheid geben.
- Ohne Netz: Lo-Fi und Ansagen funktionieren weiterhin.

## Phasen
1. Repo anlegen, bestehende `index.html` übernehmen, claude.ai-Code entfernen, GitHub Pages aktivieren.
2. `feeds.json` + Node-Skript + GitHub Action, die `data/today.json` erzeugt. Lokal testbar machen (`npm run fetch`).
3. Stimmungs-Knöpfe und Audio-Player mit Pause-Logik aus „Verhalten im Player“.
4. Test auf dem iPhone in Safari: Stummschalter, Sperrbildschirm, Pausieren, Fallbacks.
5. Optional: KI-Briefing. Action holt Schlagzeilen per RSS (inkl. Lokales aus Tübingen), lässt ein Sprachmodell ein ca. 8-minütiges Briefing schreiben (API-Key als GitHub Secret) und legt den Text in `today.json` ab; die Seite liest ihn per `speechSynthesis` vor.

## Abnahmekriterien
- Morgens Handy abstecken → Seite öffnet sich → ein Tipp auf eine Stimmung → Routine und Audio laufen ohne weiteres Zutun bis zum Ende.
- Jeden Tag läuft automatisch die aktuelle Folge.
- Ansagen sind trotz Podcast verständlich, ohne dass der Podcast unnötig oft unterbrochen wird.
