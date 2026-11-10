# Morgendehnen – Plan für die Weiterentwicklung

## Ziel
Eine morgendliche Dehn-Routine (ca. 11 Min.), die sich nicht langweilig anfühlt: Während der Übungen läuft je nach Stimmung ein Nachrichten-Podcast, ein Wissens-Podcast, ein Radiosender oder Lo-Fi-Musik. Alles muss **vollautomatisch** gehen. Die Nutzerin tippt morgens genau einmal (iOS verlangt eine Geste für Audio), und mit diesem Tipp wählt sie gleichzeitig die Stimmung.

Genutzt wird die Seite auf dem iPhone in Safari. Eine iOS-Kurzbefehl-Automation („Ladegerät getrennt“) öffnet die URL automatisch.

## Ausgangslage
`index.html` ist eine fertige, in sich geschlossene Seite (Vanilla JS/CSS, kein Build):
- Programm A/B im Wechsel (ca. 12 Min., 9 Stationen: Dehnen, Kräftigen für Fuß, Hüfte und oberen Rücken, ruhiger Abschluss); kurze Runde ca. 5 Min. Haltezeiten je Übung in `EXERCISES`, Reihenfolge in `PROGRAM`/`SHORT_PROGRAM` (index.html)
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
| A, B | Brustwirbelsäule („Buch aufklappen“) | 45 s | Brustwirbelsäule, Rumpfdrehung, Zwischenrippenmuskeln | Rundrücken und Sitzalltag: ein beweglicher oberer Rücken richtet auf. Leichter, angenehmer Einstieg. |
| A, B | Brustmuskel (Türrahmen, beide Arme zugleich) | 60 s (einmal) | Großer Brustmuskel | Rundrücken: Schultern rutschen nach vorn, die Brust ist vorn verkürzt. |
| A, B | Oberschenkel-Rückseite (Fußspitze zu dir) | 60 s | Hamstrings, dabei auch der große Wadenmuskel (Gastrocnemius) | Dein Wunsch. Wird beim Sitzen kurz, spielt beim Laufen und für ein stabiles Becken mit. Die gezogene Fußspitze deckt die gestreckte Wade mit ab, deshalb gibt es keine eigene Übung dafür. |
| A, B | Hüftbeuger (hinterer Fuß zum Po, optional) | 60 s | Hüftbeuger (Iliopsoas), dabei der gerade Oberschenkelmuskel (Quadrizeps) | Durch langes Sitzen verkürzt, kippt das Becken und verstärkt den Rundrücken-/Hohlkreuz-Zug; beim Laufen fehlt Hüftstreckung. Der Quadrizeps wird mitgedehnt und entlastet die Kniescheibe beim Joggen. |
| A, B | Wade gebeugt | 45 s | Schollenmuskel (Soleus) | Plattfüße: Der Fuß kippt nach innen und das Knie dreht mit; kurze Waden verstärken das vermutlich. Der Soleus trägt beim Laufen viel Last und wird nur mit gebeugtem Knie erreicht. |
| A, B | Kurzer Fuß (beide Füße zugleich) | 30 s (einmal) | Kleine Fußmuskeln, Fußgewölbe (Tibialis posterior) | Plattfüße: stärkt das Gewölbe aktiv. Kleine Studien zeigen einen Effekt auf das Absinken. |
| A | Seitlage-Beinheben | 30 s | Mittlerer Gesäßmuskel (Gluteus medius) | Hält das Knie beim Laufen in Linie. Kräftigung der Hüfte hat bei Knieschmerz die beste Evidenz. |
| B | Einbeinige Brücke | 30 s | Großer und mittlerer Gesäßmuskel, hintere Oberschenkel | Sitzen „schaltet“ das Gesäß aus; einbeinig trainiert es zugleich die Stabilität wie beim Laufen. |
| A, B | Schulterblatt-Zug (Bauchlage, Arme als T) | 45 s (einmal) | Mittlerer und unterer Trapezmuskel, Rautenmuskeln, Rückenstrecker | Rundrücken: Dehnen allein richtet nicht auf, die Muskeln zwischen den Schulterblättern müssen kräftiger werden. Übliche Empfehlung, hier nicht per Studie geprüft. |
| A, B | Zur Ruhe kommen (Kindshaltung) | 30 s (einmal) | Unterer Rücken, Atmung | Ruhiger Abschluss; senkt die Anspannung zum Start in den Tag. |

Gestrichen wegen Überlappung: Gesäß-Dehnung (Sitzen verlängert das Gesäß eher), Wade gestreckt (von der Hamstring-Dehnung mit gezogener Fußspitze abgedeckt), Oberschenkel-Vorderseite als eigene Übung (vom Hüftbeuger-Stretch mit abgedeckt), Fußball (Wunsch der Nutzerin).

### Wochen-Dosis (5 Runden pro Woche, alle fünf Dehnungen täglich)
Faustregel (Thomas et al. 2018): ab ca. 5 Min. pro Woche und Muskel wird Dehnen wirksam; keine feste Schwelle. Die App zeigt das nicht pro Muskel an (Mini-Balken wurden wieder entfernt, zu viel Anzeige); es bleibt beim Runden-Balken und dem Hinweis zur 5-Min.-Regel.

| Dehnung | Zeit/Seite | Min./Woche bei 5 Runden | bei 7 Runden |
|---|---|---|---|
| Oberschenkel-Rückseite | 60 s | 5,0 ✔ | 7,0 |
| Hüftbeuger | 60 s | 5,0 ✔ | 7,0 |
| Brustmuskel | 60 s | 5,0 ✔ | 7,0 |
| Brustwirbelsäule | 45 s | 3,75 | 5,25 ✔ |
| Wade gebeugt | 45 s | 3,75 | 5,25 ✔ |

### Kräftigung: wie viel? (Recherche, Info-Fenster neben „Diese Woche“)
Das „i“ neben „Diese Woche“ zeigt pro Dehnung die Minuten (Ziel 5 pro Woche) und pro Kräftigungsübung die Einheiten (Ziel 3 pro Woche). Gezählt wird nur, wenn die Haltezeit wirklich abgelaufen ist.
- **Allgemein (ACSM):** 2–3 Tage pro Woche je Muskelgruppe, 2–4 Sätze à 8–12 Wiederholungen (neuere Fassung 2–3 Sätze); Krafttraining senkt Sportverletzungen deutlich (Lauersen 2018).
- **Hüfte bei Knieschmerz:** kein Konsens über Sätze/Wiederholungen; Studien nutzen oft 3 Einheiten pro Woche über ca. 6 Wochen; die Dosis scheint für die Schmerzlinderung weniger wichtig als das Dranbleiben.
- **Kurzer Fuß:** kein Konsens; Protokolle meist täglich oder 3-mal pro Woche, 1–3 Sätze à 10–25 Wiederholungen mit ca. 5 s Halten, über 4–12 Wochen; Studien klein.
- **Schulterblatt-Zug (Bauchlage, T/Y):** Praxisempfehlung 2–3-mal pro Woche, 3 × 10–12; Studienlage dünn.
- **Folge:** 3 Einheiten pro Woche als Ziel; mit 5 Runden erreichen Kurzer Fuß, Schulterblatt-Zug und Hüfte (Beinheben + Brücke zusammen) das. Eine Einheit in der App ist ca. 1 Satz (30 s pro Seite), weniger als die Studien (2–3 Sätze). Programm bewusst nicht geändert.

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

## Zweite Version „Kraft & Dehnen“ (`schmieren-dehn/`)
Für die Schwester (gleiche Probleme, macht es nicht morgens). Liegt als Unterordner im selben Repo und nutzt dieselben Daten (`../data/today.json`, gleiche GitHub Action). Adresse: `https://littlebirb.github.io/morgendehnen/schmieren-dehn/`. Eigene `localStorage`-Schlüssel (`kraftdehnen-…`), eigener Fortschritt.
Unterschiede zur Hauptversion:
- Überschrift „Schmieren-Dehn“ (Unterzeile „Werde biegsam wie ein Lappen“), kein „Guten Morgen“ und keine Morgen-Bezüge in den Texten.
- Nur drei Stimmungen: **Nachrichten** (tagesschau/Was jetzt?), **Wellness** (Entspannungsmusik, wird wie Lo-Fi in der App selbst erzeugt: kleine Spieluhr-Melodie in vier Takten mit leichter Begleitung und dezentem Echo, bewusst ohne Bass und tiefe Flächen, damit nichts dröhnt; immer gleich, keine Werbung, kein Netz nötig. Online-Sender wurden verworfen: SomaFM lieferte „403 Forbidden“, FluxLounge spielt Werbung vor. Bei Wellness gelten wie bei Lo-Fi die ausführlichen Ansagen) und **Nichts** (eigene Musik, z. B. Spotify).
- **Nichts:** Die Audio-Sitzung wird auf `ambient` gestellt und das stille Hintergrund-Audio nicht gestartet, damit Musik aus anderen Apps weiterläuft. Nicht auf dem iPhone getestet; `ambient` folgt dem Stummschalter, und ob die Sprachansage Spotify kurz unterbricht, hängt von iOS ab. Mit Nachrichten/Wellness übernimmt die App wie bisher den Ton.
- Im „i“-Fenster und in der Übungsliste steht zu jeder Übung, was sie trainiert und der „Nutzen“. Eigener Nachrichten-Pool: allgemein lebensfroh und gegen Gedankenkreisen.
- Programm, Haltezeiten, Wochenziel, Gong sind gleich.

### „Kraft & Dehnen“: drei Programme (A, B, C)
Die Schwester mag Abwechslung. Jede Übung gehört zu einer **Zone** (`slot`); alle Varianten einer Zone trainieren dieselben Muskeln und haben dieselben Zeiten, deshalb ist jedes Programm ca. 12,3 Min. (kurze Runde 4,9 Min.). Nach jeder vollen Runde folgt das nächste Programm (A → B → C → A), die kurze Runde ändert nichts. Der Fortschritt im „i“-Fenster zählt nach Zone und läuft über alle Programme zusammen.

| Zone | A | B | C | Zeit pro Seite |
|---|---|---|---|---|
| Brustwirbelsäule | Buch aufklappen (Seitlage) | Vierfüßler-Rotation | Drehung im Sitzen | 45 s |
| Oberschenkel-Rückseite | Liegend, Handtuch | Bein hoch am Türrahmen | Ferse auf Stuhl, Rücken gerade | 60 s |
| Hüftbeuger | Kniender Ausfallschritt | Rückenlage an der Bettkante | Stehender Ausfallschritt | 60 s |
| Brustmuskel (beide Seiten zugleich) | Türrahmen | Hände hinterm Rücken | Ellbogen hinterm Kopf öffnen | 60 s einmal |
| Wade tief (Soleus) | Wand | Sitzend, Knie nach vorn | Stufe, Ferse senken | 45 s |
| Fußgewölbe (Kraft) | Kurzer Fuß sitzend | Kurzer Fuß im Stehen | Handtuch-Raffen | 30 s einmal |
| Hüfte/Gesäß (Kraft) | Seitlage-Beinheben | Einbeinige Brücke | Beinheben im Stand | 30 s |
| Oberer Rücken (Kraft) | Bauchlage T | Bauchlage Y | Handtuch auseinanderziehen | 45 s einmal |
| Abschluss | Kindshaltung | Knie zur Brust, wiegen | Beine auf dem Stuhl | 30 s einmal |

Die Reihenfolge der Übungen innerhalb eines Programms wird bei jedem Start zufällig gemischt; nur die Abschluss-Entspannung bleibt am Ende (auch in der kurzen Runde).

Grenzen: Handtuch-Raffen trainiert vor allem die Zehenbeuger, weniger das Gewölbe selbst. Es gibt keine Studie, dass Abwechslung die Wirkung verbessert; sie hilft vermutlich nur beim Dranbleiben. Benötigt werden Stuhl, Handtuch, Türrahmen/Wand, Bettkante und eine Stufe.


### Gong-Lautstärke
Der Gong lief vorher bei Spitzenwerten um 1,7 und damit hart übersteuert. Jetzt: Eingangspegel 0,62, weiche Sättigung (WaveShaper, tanh) und Ausgangspegel 0,95. Messung offline: ca. 24–27 % mehr Lautstärke (RMS) bei Spitze 0,95; in der App gemessen RMS ca. 0,32 gegenüber 0,27 vorher. Der Hintergrund (Podcast/Radio) lässt sich auf iOS nicht leiser stellen (olume ist schreibgeschützt), deshalb wurde der Gong angehoben. In beiden Versionen gleich.


### Stimme in „Schmieren-Dehn“
Sprechtempo 0,9 statt 0,95. Die Standardstimme wird nach Qualität gewählt (Premium/Enhanced/Erweitert zuerst, die einfache Standardstimme „Anna“ zuletzt). Unter „Die Übungen“ gibt es eine Auswahl der deutschen Stimmen des Geräts mit „Probe hören“; die Wahl wird gespeichert. Grenze: Safari am iPhone zeigt Webseiten oft nur wenige Stimmen, heruntergeladene Premium-Stimmen erscheinen dort nicht zuverlässig. Auf dem iPhone nicht getestet.

### Aufgenommene Stimme in „Schmieren-Dehn“ (ersetzt die Handy-Stimme)
Die Ansagen spielt die App jetzt aus Sprachdateien ab (`schmieren-dehn/voice/`, 100 Sätze, ca. 11 MB, 16 kHz). Erzeugt mit **Piper** (MIT-Lizenz) und der deutschen Frauenstimme **Kerstin** (Qualität „low“, CC0), Einstellungen `--length_scale 0.9 --noise_scale 0.9 --noise_w 1.0` (etwas schneller, lebendiger), Lautstärke normalisiert, Stille am Rand gekürzt. `manifest.json` ordnet jeden Satz (exakter Text) seiner Datei zu.
- **Ablauf:** `say([...])` bekommt eine Liste von Sätzen (z. B. „Als Nächstes:“, Übungsname, „rechte Seite“, Anleitung). Gibt es für alle eine Datei, werden sie über Web Audio nacheinander abgespielt (mischt sich im Modus „Nichts“ mit der Audio-Sitzung „ambient“); sonst oder bei Ladefehlern nach 2,5 s spricht die Handy-Stimme den ganzen Satz. Die Dateien für das aktuelle Programm und den Schlusssatz werden beim Start geladen.
- **Neu erzeugen:** Wenn sich Übungstexte oder Sprüche ändern, müssen die zugehörigen Sätze neu aufgenommen werden (sonst spricht dafür die Handy-Stimme). Piper-Aufruf pro Satz, danach normalisieren und `manifest.json` neu schreiben (Skripte lagen im Arbeitsordner der Sitzung, nicht im Projekt).
- **Grenzen:** Klingt nach Computerstimme; nicht auf dem iPhone getestet. Die Stimmenauswahl in der Oberfläche wurde entfernt (die Handy-Stimme ist nur noch Rückfall). Thorsten (männlich, „medium“) lief nur mit gekürzter Konfiguration (Doppellaute entfernt), Ramona/Eva K wurden nicht ausprobiert.