# Morgendehnen – Plan für die Weiterentwicklung

## Ziel
Eine morgendliche Dehn-Routine (ca. 11 Min.), die sich nicht langweilig anfühlt: Während der Übungen läuft je nach Stimmung ein Nachrichten-Podcast, ein Wissens-Podcast, ein Radiosender oder Lo-Fi-Musik. Alles muss **vollautomatisch** gehen. Die Nutzerin tippt morgens genau einmal (iOS verlangt eine Geste für Audio), und mit diesem Tipp wählt sie gleichzeitig die Stimmung.

Genutzt wird die Seite auf dem iPhone in Safari. Eine iOS-Kurzbefehl-Automation („Ladegerät getrennt“) öffnet die URL automatisch.

## Ausgangslage
`index.html` ist eine fertige, in sich geschlossene Seite (Vanilla JS/CSS, kein Build):
- Programm A/B im Wechsel (ca. 12 Min., 8 Stationen: Dehnen, Kräftigen für Fuß, Hüfte und oberen Rücken, ruhiger Abschluss); kurze Runde ca. 5 Min. Haltezeiten je Übung in `EXERCISES`, Reihenfolge in `PROGRAM`/`SHORT_PROGRAM` (index.html)
- Deutsche Sprachansage über `speechSynthesis`
- Lo-Fi-Musik live per Web Audio API synthetisiert, inkl. Ducking bei Sprache
- Stilles `<audio>`-Element als iOS-Workaround gegen den Stummschalter (muss erhalten bleiben)
- Screen Wake Lock, SVG-Sonne als Fortschrittsanzeige
- Wochenziel-Balken (5 Runden/Woche) in `localStorage`
- Enthält noch Code für die claude.ai-Runtime (`window.claude.use("db")`). Der ist außerhalb von claude.ai wirkungslos und kann entfernt werden.

## Übungen: Zielmuskel und warum sie drin sind
Persönlicher Hintergrund: Plattfüße, Knieschmerzen beim Joggen, Rundrücken, viel Sitzen, 31 Jahre, Ziel Vorbeugung. Die Begründungen sind plausible Zusammenhänge aus der Recherche, keine Diagnose; Evidenzlage siehe Chat-Verlauf bzw. Plan (Dehnen allein hilft bei Knieschmerz kaum, Kräftigen am meisten).

| Prog. | Übung | Zeit/Seite | Zielmuskel | Warum für dich |
|---|---|---|---|---|
| A | Brustwirbelsäule („Buch aufklappen“) | 60 s | Brustwirbelsäule, Rumpfdrehung, Zwischenrippenmuskeln | Rundrücken und Sitzalltag: ein beweglicher oberer Rücken richtet auf. Leichter, angenehmer Einstieg. |
| B | Brustmuskel (Türrahmen) | 60 s | Großer Brustmuskel | Rundrücken: Schultern rutschen nach vorn, die Brust ist vorn verkürzt. |
| A, B | Oberschenkel-Rückseite (Fußspitze zu dir) | 60 s | Hamstrings, dabei auch der große Wadenmuskel (Gastrocnemius) | Dein Wunsch. Wird beim Sitzen kurz, spielt beim Laufen und für ein stabiles Becken mit. Die gezogene Fußspitze deckt die gestreckte Wade mit ab, deshalb gibt es keine eigene Übung dafür. |
| A, B | Hüftbeuger (hinterer Fuß zum Po, optional) | 60 s | Hüftbeuger (Iliopsoas), dabei der gerade Oberschenkelmuskel (Quadrizeps) | Durch langes Sitzen verkürzt, kippt das Becken und verstärkt den Rundrücken-/Hohlkreuz-Zug; beim Laufen fehlt Hüftstreckung. Der Quadrizeps wird mitgedehnt und entlastet die Kniescheibe beim Joggen. |
| A, B | Wade gebeugt | 45 s | Schollenmuskel (Soleus) | Plattfüße: Der Fuß kippt nach innen und das Knie dreht mit; kurze Waden verstärken das vermutlich. Der Soleus trägt beim Laufen viel Last und wird nur mit gebeugtem Knie erreicht. |
| A, B | Kurzer Fuß | 30 s | Kleine Fußmuskeln, Fußgewölbe (Tibialis posterior) | Plattfüße: stärkt das Gewölbe aktiv. Kleine Studien zeigen einen Effekt auf das Absinken. |
| A | Seitlage-Beinheben | 30 s | Mittlerer Gesäßmuskel (Gluteus medius) | Hält das Knie beim Laufen in Linie. Kräftigung der Hüfte hat bei Knieschmerz die beste Evidenz. |
| B | Einbeinige Brücke | 30 s | Großer und mittlerer Gesäßmuskel, hintere Oberschenkel | Sitzen „schaltet“ das Gesäß aus; einbeinig trainiert es zugleich die Stabilität wie beim Laufen. |
| A, B | Schulterblatt-Zug (Bauchlage, Arme als T) | 45 s (einmal) | Mittlerer und unterer Trapezmuskel, Rautenmuskeln, Rückenstrecker | Rundrücken: Dehnen allein richtet nicht auf, die Muskeln zwischen den Schulterblättern müssen kräftiger werden. Übliche Empfehlung, hier nicht per Studie geprüft. |
| A, B | Zur Ruhe kommen (Kindshaltung) | 30 s (einmal) | Unterer Rücken, Atmung | Ruhiger Abschluss; senkt die Anspannung zum Start in den Tag. |

Gestrichen wegen Überlappung: Gesäß-Dehnung (Sitzen verlängert das Gesäß eher), Wade gestreckt (von der Hamstring-Dehnung mit gezogener Fußspitze abgedeckt), Oberschenkel-Vorderseite als eigene Übung (vom Hüftbeuger-Stretch mit abgedeckt), Fußball (Wunsch der Nutzerin).

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
| Nachrichten | „Was jetzt?“ (ZEIT) oder „15 Minuten“ (tagesschau), zufällig beim Start | App wählt zufällig unter den Quellen des Kanals |
| Welt (`welt`) | „Quarks Daily“ (WDR) oder „The Moth“ (Geschichten, englisch), zufällig | The Moth hat `skipShort` und läuft nicht bei der kurzen Runde; Folge = eine der letzten 10, tagesabhängig |
| Meditation (`meditation`) | „Mindful Minutes“ (englisch, ~8 Min., täglich) | Ersetzt „Daily Meditation Podcast“ (zu leise, Feed riesig) |
| Radio | egoFM (`https://streams.egofm.de/egoFM-hq`) oder FluxLounge (`https://streams.fluxfm.de/lounge/mp3-128/audio/`), zufällig | Stream-URL direkt im `<audio>`, CORS offen, verifiziert. egoFM hat Werbung; FluxLounge laut ifun.de (2020) werbefrei, nicht bestätigt. Probelauf, danach entscheiden, ob egoFM bleibt. |
| Lo-Fi | bestehende Web-Audio-Synthese | Standard-Fallback |

**Wichtig:** Feed- und Stream-URLs recherchieren und verifizieren, nicht raten. Feeds in einer Konfigurationsdatei (`feeds.json`) ablegen, damit sie leicht austauschbar sind.

## Verhalten im Player
- **Startseite:** vier große Stimmungs-Knöpfe (Nachrichten, Meditation, Welt, Radio; „Einfach Lo-Fi“ als breiter Standard-Knopf) statt „Ganze Runde starten“. Zuletzt gewählte Stimmung hervorheben. Kurze Runde bleibt als zweite Option erhalten.
- **iOS-Einschränkung:** `HTMLMediaElement.volume` ist auf iOS schreibgeschützt; Podcast/Radio lässt sich nicht unter die Ansage ducken. Daher:
  - Bei **neuer Übung**: Podcast pausieren, Ansage sprechen, nach `onend` fortsetzen.
  - Bei **Seitenwechsel** und **10 s vor Ende**: nur ein dezenter Gong über Web Audio, keine Sprache.
  - Beim Radio-Stream nach der Pause neu verbinden, falls nötig.
- Lo-Fi-Synthese läuft nur im Lo-Fi-Kanal.
- Pause/Überspringen/Beenden müssen Podcast und Timer gemeinsam steuern.
- Media Session API (Titel der Folge auf dem Sperrbildschirm) ist ein Nice-to-have.

## Nach der Runde
Podcast und Radio laufen weiter (Lo-Fi klingt aus). Eine zufällige Nachricht aus `AFFIRMATIONS` (index.html) wird angezeigt und vorgelesen; „Ton beenden“ stoppt den Ton.

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
