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
  (Letzter Test, QR-Code, Test). Die Bedienelemente sind Symbole (QR-Code, Play, Liste mit Häkchen,
  Archivbox), jeweils mit Tooltip und vollständigem Namen für Screenreader (z. B. "Test Mathe für Max Beispiel starten"). Bei Kindern, die nur einen Test machen, zieht sich die Farbe dieses Tests auch über die ausgegrauten Zellen des anderen Fachs (einheitliche Zeile).
  Eine Spalte "Letzter Test" zeigt den Abstand in Tagen ("12 Tage"), damit die Information nicht nur an der
  Farbe hängt (Barrierefreiheit, z. B. Rot-Grün-Schwäche). Grenzwerte: `STATUS_THRESHOLDS` in `src/js/config.js`.
- **Sortierung:** Rot oben, dann orange, dann grün. Für die Zeile zählt die schlechteste Farbe der
  ausgewählten Fächer, innerhalb einer Farbe steht der am längsten zurückliegende Test zuerst
  (noch nie getestet ganz oben, bei Gleichstand alphabetisch). Sortiert wird **nur beim Laden der Seite**,
  damit Zeilen nicht unter den Händen der Testleitung springen. Farben aktualisieren sich sofort.
  Das Archiv ist weder gefärbt noch nach Farbe sortiert.
- **Verlinkungen:** Der Name des Kindes ist ein Link auf sein **Teacher-Dashboard**, eine eigene Spalte
  "Ergebnisse" (Balkensymbol) führt zu den **Ergebnissen**. Beide Seiten gibt es bereits im System. Die
  Links öffnen in einem neuen Tab, damit die Liste stehen bleibt. Die Adressmuster stehen in `PAGES` in
  `src/js/config.js` (Platzhalter `{studentId}`), die Demo verweist auf Platzhalterseiten
  (`teacher-dashboard.html`, `results.html`). Offen für den Dienstleister: echte Adressen, welche ID
  übergeben wird, und dass die Zielseiten die Berechtigung der Testleitung prüfen.
- **KPF-Auswahl:** Oben wählt die Testleitung die **KPF** (eine KPF fasst eine Klasse zusammen). Die
  Kinder werden je KPF geladen. Schnittstellen: `getKpfs()` und `getStudents(kpfId)` in
  `src/js/data/students.js`. Die zuletzt gewählte KPF merkt sich der Browser.
- **Suche und Ampel-Filter:** Suche nach Name (ignoriert Groß-/Kleinschreibung und Akzente) und Filter
  Alle / Rot / Orange / Grün. Die Filterknöpfe zeigen zugleich die Anzahl je Farbe (Zusammenfassung).
  Die Farbe einer Zeile ist die schlechteste Farbe der ausgewählten Tests.
- **Sortierung umschaltbar:** Dringlichkeit (Standard), Name (A–Z), Letzter Test Mathe oder Deutsch
  (längster Abstand zuerst). Die Reihenfolge wird bei KPF- oder Sortierwechsel neu berechnet, nicht bei
  jeder Änderung, damit Zeilen nicht springen.
- **Bestätigung vor dem Direktstart:** Ein Fenster fragt nach ("Test für <Name> jetzt auf diesem Gerät
  starten?"). Der Fokus liegt auf "Abbrechen", Esc bricht ab.
- **Sammelauswahl:** "Tests für alle setzen" öffnet ein Fenster mit **allen Kindern der KPF** (ohne
  Archiv). Die Testleitung wählt per Kästchen individuell, wer dazugehört (Suche im Fenster, "Alle" für die
  gefundenen Kinder, "Keine"), und legt fest, welche Tests gesetzt werden. Zu jedem Kind stehen die aktuell
  aktiven Tests. Ist auf der Seite ein Filter oder eine Suche aktiv, sind die dort
  sichtbaren Kinder vorausgewählt, sonst ist niemand vorausgewählt. Gespeichert wird erst mit
  "Für N Kinder speichern", Abbrechen ändert nichts.
- **QR-Sammelblatt je Fach:** Ein druckbares Blatt mit Karten (Name, QR-Code, Gültigkeit) für alle Kinder
  der aktuellen Ansicht, die den Test ausgewählt haben. Dafür werden **länger gültige** Links angefordert
  (`purpose: "sheet"`, Demo-Annahme 8 Stunden, `LINK_VALIDITY_MINUTES` in `src/js/config.js`).
  **Sicherheitshinweis für den Dienstleister:** Ein gedruckter Code ist ein Zugangsschlüssel auf Papier.
  Empfohlen: nur für das jeweilige Fach und Kind gültig, einmal nutzbar, kurze Laufzeit (Schultag),
  Protokollierung der Ausstellung. Die Seite warnt die Testleitung vor Weitergabe und Fotos.
- Später kommen weitere Spalten dazu: Die Tabelle ist daher konfigurationsgetrieben (`src/js/config.js`).

## Was in der Demo simuliert ist und vom Dienstleister ersetzt wird

| Demo                                      | Produktiv                                                              |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| `getKpfs()`, `getStudents(kpfId)` in `src/js/data/students.js` (erfundene Namen) | KPFs und Kinder aus der Datenbank, nur für berechtigte Testleitungen |
| `src/js/services/testLinkService.js` (Zufalls-Token im Browser) | Schnittstelle der Lernplattform: pro Aufruf neuer, einmal nutzbarer Token (`purpose` "single" kurz, "sheet" länger); Link auf die bestehende Startseite |
| `src/js/services/studentStateService.js` (localStorage, nur im Browser) | Speichern von Testauswahl und Archiv-Status in der Plattform/Datenbank |
| `src/js/data/lastTests.js` (Demo-Daten, relativ zu heute) | `getLastTestDates()`: Datum des letzten Tests je Kind und Fach (`JJJJ-MM-TT` oder `null`) aus der Datenbank |
| `focus` in `src/js/data/students.js` (erfundene Werte) | Förderschwerpunkt aus der Datenbank                                   |
| `src/teacher-dashboard.html`, `src/results.html` (Platzhalterseiten) | Entfallen, `PAGES` in `config.js` zeigt auf die bestehenden Seiten |
| `src/test-start.html` (Platzhalter-Zielseite) | Entfällt, Link zeigt auf die bestehende Startseite                  |
| Anzeige der URL im QR-Dialog              | Entfernen (nur Demo-Hilfe)                                             |
| Keine Anmeldung der Testleitung           | Anmeldung und Rechtekonzept (nur eigene Gruppen sehen)                 |

Die Oberfläche bleibt unverändert, solange Signatur und Rückgabeformat der beiden Funktionen
`getKpfs()`, `getStudents(kpfId)`, `getLastTestDates()`, `createTestLink()`, `getStates()` und `saveState()` erhalten bleiben.

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
