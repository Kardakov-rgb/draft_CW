# Übergabe an den IT-Dienstleister

Dieses Dokument wird mit dem Projekt weiterentwickelt. Offene Punkte sind mit `TODO` markiert.

## Zu klären (vom Auftraggeber)

- [ ] Zielsystem / CMS / Framework, in das übernommen wird (TODO, beim Dienstleister erfragen, siehe Fragenliste unten)
- [x] Unterstützte Browser: alle gängigen, mindestens Chrome, Safari, Firefox (jeweils aktuelle Version; genaue Mindestversionen mit Dienstleister abstimmen)
- [ ] Barrierefreiheits-Anforderung: aktuell keine festgelegt. Empfehlung: WCAG 2.1 AA als Zielwert vereinbaren (TODO, bei öffentlichen Seiten ggf. rechtlich verpflichtend)
- [x] Corporate Design: Farben und Schriften siehe unten
- [ ] Logo, Bildsprache und Abstands-/Layout-Vorgaben (TODO)
- [ ] Hosting- und Datenschutzvorgaben (externe Ressourcen, Cookies, Tracking) (TODO)

## Corporate Design

| Rolle in `tokens.css`        | Wert      | Textfarbe auf Weiß? (Kontrast) |
| ---------------------------- | --------- | ------------------------------ |
| `--color-green-dark`         | `#006359` | ja (ca. 7,3:1)                 |
| `--color-gray`               | `#4d4d4d` | ja (ca. 8,5:1)                 |
| `--color-green-light`        | `#afca00` | nein, nur Flächen/Akzente (ca. 1,9:1) |
| `--color-orange`             | `#e28807` | nein, nur Flächen/Akzente (ca. 2,5:1) |
| `--color-yellow`             | `#f4d627` | nein, nur Flächen/Akzente (ca. 1,5:1) |

Schriften: **Montserrat** (Überschriften, UI) und **Noto Serif** (Fließtext), beide unter SIL OFL 1.1,
lokal in `src/assets/fonts/` (kein Google-Fonts-Abruf). Welche Schrift wo eingesetzt wird, ist als
Startwert gesetzt und noch mit dem Design abzugleichen (TODO).

## Fragenliste an den Dienstleister (Zielsystem)

1. Welches CMS / Framework / Shop-System ist im Einsatz (inkl. Version)?
2. Gibt es ein bestehendes Theme, Template-System oder Design-System, in das der Entwurf soll?
3. Dürfen eigenes CSS/JS und selbst gehostete Schriften eingebunden werden, oder gibt es Build-Vorgaben?
4. Wie läuft Übergabe und Abnahme (Staging-Umgebung, Code-Review, Format der Lieferung)?
5. Gibt es Vorgaben zu Barrierefreiheit, Cookie-Consent und Tracking?

## Zusagen dieser Codebasis

- Kein Build-Schritt nötig, keine Laufzeit-Abhängigkeiten.
- Design-Werte zentral in `src/css/tokens.css` und damit leicht auf das Zielsystem abbildbar.
- Komponenten sind getrennt (CSS-Abschnitt + JS-Modul) und einzeln portierbar.

## Übergabe-Checkliste

- [ ] README aktuell, Schnellstart funktioniert auf frischem Klon
- [ ] Alle Entscheidungen oben beantwortet
- [ ] Keine Zugangsdaten oder personenbezogene Daten im Repo
- [ ] Drittinhalte (Bilder, Schriften) mit Lizenz dokumentiert
- [ ] Browser-Test und Barrierefreiheits-Check durchgeführt
