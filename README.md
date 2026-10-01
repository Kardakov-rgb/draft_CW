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

## Struktur

```
src/
  index.html          Einstiegsseite
  css/                tokens -> base -> layout -> components
  js/main.js          Einstiegspunkt (ES-Module)
  js/components/      ein Modul pro UI-Komponente
  assets/             Bilder, Schriften
docs/
  HANDOVER.md         Übergabe-Checkliste für den Dienstleister
```

## Konventionen

- Keine Build-Pipeline, keine Laufzeit-Abhängigkeiten: Dateien sind direkt lauffähig.
- Alle Farben, Abstände, Schriften nur in `src/css/tokens.css`.
- CSS-Klassen nach BEM (`block__element--modifier`), keine IDs für Styling.
- JavaScript: ES-Module, eine Verantwortung pro Datei, keine globalen Variablen.
- Formatierung: Prettier (`npm run format`), Einstellungen in `.editorconfig`.

Details zur Übergabe: [docs/HANDOVER.md](docs/HANDOVER.md)
