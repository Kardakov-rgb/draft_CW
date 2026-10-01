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
- **Testauswahl pro Kind:** Nicht jedes Kind macht beide Tests. Button "Tests auswählen" öffnet ein
  Fenster (mindestens ein Test muss gewählt sein). Nicht ausgewählte Tests sind ausgegraut und weder
  per QR-Code noch per Direktstart bedienbar. Die Auswahl ist jederzeit änderbar. Die Testleitung
  erkennt den Stand an den aktiven Buttons.
- **Voreinstellung aus der Datenbank:** Solange nichts gespeichert wurde, bestimmt der
  **Förderschwerpunkt** (aus einer Datenbank, Schnittstelle nötig) die aktiven Tests. Ohne Eintrag
  sind beide Tests aktiv. Zuordnung in `FOCUS` in `src/js/config.js`.
  **Annahme:** Werte `math`, `german`, `both`. Echte Werte der Datenbank mit dem Dienstleister klären.
- **Archiv:** Kinder, die nicht getestet werden sollen (z. B. abwesend), werden per Button in eine Liste
  weiter unten archiviert und können von dort wiederhergestellt werden. Archivierte Kinder haben
  keine Test-Buttons.
- **Ampel pro Fach:** Je Kind und Fach wird das Datum des letzten Tests (aus der Datenbank,
  Schnittstelle nötig) bewertet. Weniger als 28 Tage her: grün, ab 28 Tagen: orange, ab 42 Tagen oder noch
  nie getestet: rot (Kalendertage). Die Farbe liegt dezent als Hintergrund hinter den drei Zellen des Fachs
  (Letzter Test, QR-Code, Test). Fächer, die für das Kind nicht ausgewählt sind, bleiben ohne Farbe.
  Eine Spalte "Letzter Test" zeigt Datum und "vor N Tagen", damit die Information nicht nur an der
  Farbe hängt (Barrierefreiheit, z. B. Rot-Grün-Schwäche). Grenzwerte: `STATUS_THRESHOLDS` in `src/js/config.js`.
- **Sortierung:** Rot oben, dann orange, dann grün. Für die Zeile zählt die schlechteste Farbe der
  ausgewählten Fächer, innerhalb einer Farbe steht der am längsten zurückliegende Test zuerst
  (noch nie getestet ganz oben, bei Gleichstand alphabetisch). Sortiert wird **nur beim Laden der Seite**,
  damit Zeilen nicht unter den Händen der Testleitung springen. Farben aktualisieren sich sofort.
  Das Archiv ist weder gefärbt noch nach Farbe sortiert.
- Später kommen weitere Spalten dazu: Die Tabelle ist daher konfigurationsgetrieben (`src/js/config.js`).

## Was in der Demo simuliert ist und vom Dienstleister ersetzt wird

| Demo                                      | Produktiv                                                              |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| `src/js/data/students.js` (erfundene Namen) | Gruppenliste aus der Lernplattform, nur für berechtigte Testleitungen |
| `src/js/services/testLinkService.js` (Zufalls-Token im Browser) | Schnittstelle der Lernplattform: pro Aufruf neuer, kurzlebiger, einmal nutzbarer Token; Link auf die bestehende Startseite |
| `src/js/services/studentStateService.js` (localStorage, nur im Browser) | Speichern von Testauswahl und Archiv-Status in der Plattform/Datenbank |
| `src/js/data/lastTests.js` (Demo-Daten, relativ zu heute) | `getLastTestDates()`: Datum des letzten Tests je Kind und Fach (`JJJJ-MM-TT` oder `null`) aus der Datenbank |
| `focus` in `src/js/data/students.js` (erfundene Werte) | Förderschwerpunkt aus der Datenbank                                   |
| `src/test-start.html` (Platzhalter-Zielseite) | Entfällt, Link zeigt auf die bestehende Startseite                  |
| Anzeige der URL im QR-Dialog              | Entfernen (nur Demo-Hilfe)                                             |
| Keine Anmeldung der Testleitung           | Anmeldung und Rechtekonzept (nur eigene Gruppen sehen)                 |

Die Oberfläche bleibt unverändert, solange Signatur und Rückgabeformat der beiden Funktionen
`getStudents()`, `getLastTestDates()`, `createTestLink()`, `getStates()` und `saveState()` erhalten bleiben.

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

## Qualitätssicherung

`npm test` führt Tests der Fachlogik aus (Ampel-Grenzen, Sortierung, Testauswahl), ohne
Abhängigkeiten, benötigt nur Node.js. Die Fachlogik liegt bewusst in `src/js/domain/` ohne DOM-Zugriff,
damit sie sich auch in ein anderes System übernehmen lässt.

## Übergabe-Checkliste

- [ ] README aktuell, Schnellstart funktioniert auf frischem Klon
- [ ] Alle Entscheidungen oben beantwortet
- [ ] Keine Zugangsdaten oder personenbezogene Daten im Repo
- [ ] Drittinhalte (Bilder, Schriften) mit Lizenz dokumentiert
- [ ] Browser-Test und Barrierefreiheits-Check durchgeführt
