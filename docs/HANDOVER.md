# Übergabe an den IT-Dienstleister

## Zweck der Demo

Nachhilfe an Schulen (Klasse 5 und 6) wird mit Lernverlaufsdiagnostiken (Mathe, Deutsch) belegt. Bisher
melden sich Kinder mit Nutzername und Passwort an der Lernplattform an, das dauert zu lange.
Diese **Demo** zeigt die gewünschte Oberfläche, damit der Dienstleister sie sich vorstellen kann:

- Testleitung (bei uns "Schuko" und "Leko") sieht eine Liste der Kinder einer Gruppe (bis zu 25).
- Pro Kind und Fach (Mathe, Deutsch): entweder **QR-Code anzeigen** (Kind scannt mit Endgerät mit
  Kamera und landet direkt im Test) oder **Test direkt starten** (Testleitung startet am Gerät).
- Jeder Test hat einen individuellen Link. Bei **jedem** Öffnen eines QR-Codes (und bei "Neu erzeugen")
  wird ein neuer Link angefordert. Die Startseite, auf der das Kind landet, existiert bereits.
- Später kommen weitere Spalten dazu: Die Tabelle ist daher konfigurationsgetrieben (`src/js/config.js`).

## Was in der Demo simuliert ist und vom Dienstleister ersetzt wird

| Demo                                      | Produktiv                                                              |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| `src/js/data/students.js` (erfundene Namen) | Gruppenliste aus der Lernplattform, nur für berechtigte Testleitungen |
| `src/js/services/testLinkService.js` (Zufalls-Token im Browser) | Schnittstelle der Lernplattform: pro Aufruf neuer, kurzlebiger, einmal nutzbarer Token; Link auf die bestehende Startseite |
| `src/test-start.html` (Platzhalter-Zielseite) | Entfällt, Link zeigt auf die bestehende Startseite                  |
| Anzeige der URL im QR-Dialog              | Entfernen (nur Demo-Hilfe)                                             |
| Keine Anmeldung der Testleitung           | Anmeldung und Rechtekonzept (nur eigene Gruppen sehen)                 |

Die Oberfläche bleibt unverändert, solange Signatur und Rückgabeformat der beiden Funktionen
`getStudents()` und `createTestLink()` erhalten bleiben.

Bekannte Einschränkungen der Demo: Die Tabelle scrollt auf Smartphones seitlich (Zielgerät der
Testleitung: Laptop/Tablet). Datenschutz, Token-Sicherheit und Rechtekonzept sind bewusst Aufgabe des
Dienstleisters.

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
| `--color-green-dark`         | `#006359` | ja (ca. 7,2:1)                 |
| `--color-gray`               | `#4d4d4d` | ja (ca. 8,5:1)                 |
| `--color-green-light`        | `#afca00` | nein, nur Flächen/Akzente (ca. 1,9:1) |
| `--color-orange`             | `#e28807` | nein, nur Flächen/Akzente (ca. 2,7:1) |
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
