# draft_CW

Statische Seite in reinem HTML, CSS und JavaScript (ES-Module). Dient als Entwurf, den der
IT-Dienstleister in das bestehende System übernimmt.

## Schnellstart

```bash
git clone https://github.com/Kardakov-rgb/draft_CW.git
cd draft_CW
npm start        # lokaler Server auf http://localhost:3000 (benötigt Node.js)
```

Alternativ `src/index.html` über einen beliebigen statischen Webserver ausliefern
(ES-Module funktionieren nicht über `file://`).

## Was ist das?

Demo einer Testübersicht: Liste von Kindern, pro Kind und Fach ein QR-Code oder ein Direktstart
des Tests. Hintergrund und Übergabehinweise: [docs/HANDOVER.md](docs/HANDOVER.md).

## Struktur

```
src/
  index.html          Einstiegsseite
  css/                fonts -> tokens -> base -> layout -> components
  js/main.js          Einstiegspunkt (ES-Module)
  js/config.js        Fächer und Spalten der Tabelle
  js/components/      ein Modul pro UI-Komponente (Tabelle, QR-Dialog, Testauswahl)
  js/domain/          Fachlogik (welche Tests sind für ein Kind aktiv?)
  js/services/        Zugriff auf die Lernplattform (in der Demo simuliert)
  js/data/            Beispieldaten (in der Demo erfunden)
  js/vendor/          Fremdbibliothek uqr (QR-Code, MIT-Lizenz), unverändert
  assets/             Bilder, Schriften
docs/
  HANDOVER.md         Übergabe-Checkliste für den Dienstleister
```

## Neue Spalte hinzufügen

1. Eintrag in `COLUMNS` in `src/js/config.js` (`id`, `label`, `type`, ggf. `field` oder `subject`).
2. Zeigt die Spalte Text aus den Daten (`type: "text"`), ist das alles. Für ein neues Verhalten
   einen Typ in `CELL_RENDERERS` in `src/js/components/studentTable.js` ergänzen.
3. Neues Fach: Eintrag in `SUBJECTS` und die zugehörigen Spalten.

## Konventionen

- Keine Build-Pipeline, keine Laufzeit-Abhängigkeiten: Dateien sind direkt lauffähig.
- Alle Farben, Abstände, Schriften nur in `src/css/tokens.css`.
- CSS-Klassen nach BEM (`block__element--modifier`), keine IDs für Styling.
- JavaScript: ES-Module, eine Verantwortung pro Datei, keine globalen Variablen.
- Formatierung: Prettier (`npm run format`), Einstellungen in `.editorconfig`.

Details zur Übergabe: [docs/HANDOVER.md](docs/HANDOVER.md)
