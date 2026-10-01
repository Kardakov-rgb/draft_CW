/* Zentrale Konfiguration der Testübersicht.
   Neue Spalte hinzufügen = Eintrag in COLUMNS (ggf. neuer Typ in components/studentTable.js). */

/* Testfächer. Neues Fach = Eintrag hier, die Spalten dazu in COLUMNS. */
export const SUBJECTS = {
  math: { label: "Mathe" },
  german: { label: "Deutsch" },
};

/* Förderschwerpunkt (aus der Datenbank) -> vorausgewählte Tests.
   Gilt, solange für ein Kind noch keine Auswahl gespeichert wurde.
   Ohne Förderschwerpunkt (oder unbekannter Wert) sind alle Tests aktiv.
   ANNAHME: Werte "math", "german", "both". Mit dem Dienstleister an die echten Werte der
   Datenbank anpassen. */
export const FOCUS = {
  math: { label: "Mathe", tests: ["math"] },
  german: { label: "Deutsch", tests: ["german"] },
  both: { label: "Mathe und Deutsch", tests: ["math", "german"] },
};

/* Ampel nach Tagen seit dem letzten Test (pro Fach):
   unter orangeAfterDays grün, ab orangeAfterDays orange, ab redAfterDays rot.
   Noch nie getestet = rot. */
export const STATUS_THRESHOLDS = { orangeAfterDays: 28, redAfterDays: 42 };

/* Spalten der Tabelle, in dieser Reihenfolge.
   group: Fach-Schlüssel aus SUBJECTS. Aufeinanderfolgende Spalten derselben Gruppe bekommen
          eine gemeinsame Überschrift.
   type:
     "text"    zeigt student[field]
     "lastTest" Datum des letzten Tests für `subject`
     "pageLink" Link auf eine bestehende Seite (`page` aus PAGES), öffnet in neuem Tab.
               Mit `icon`: Symbol-Button, sonst Text (`field`)
     "select"  Button, öffnet das Fenster zur Testauswahl
     "qr"      Button, öffnet den QR-Code für `subject` (grau, wenn Test nicht ausgewählt)
     "start"   Button, startet den Test für `subject` (grau, wenn Test nicht ausgewählt)
     "archive" Button, verschiebt das Kind ins Archiv
     "restore" Button, holt das Kind aus dem Archiv zurück */
export const COLUMNS = [
  { id: "name", label: "Name", type: "pageLink", page: "dashboard", field: "name" },
  { id: "select", label: "Tests", type: "select" },
  { id: "last-math", label: "Letzter Test", type: "lastTest", group: "math", subject: "math" },
  { id: "qr-math", label: "QR-Code", type: "qr", group: "math", subject: "math" },
  { id: "start-math", label: "Test", type: "start", group: "math", subject: "math" },
  {
    id: "last-german",
    label: "Letzter Test",
    type: "lastTest",
    group: "german",
    subject: "german",
  },
  { id: "qr-german", label: "QR-Code", type: "qr", group: "german", subject: "german" },
  { id: "start-german", label: "Test", type: "start", group: "german", subject: "german" },
  { id: "results", label: "Ergebnisse", type: "pageLink", page: "results", icon: "results" },
  { id: "archive", label: "Archiv", type: "archive" },
];

/* Spalten der Archiv-Liste. */
export const ARCHIVE_COLUMNS = [
  { id: "name", label: "Name", type: "text", field: "name" },
  { id: "restore", label: "", type: "restore" },
];

/* Bestehende Seiten des Systems, auf die verlinkt wird. {studentId} wird durch die ID des Kindes
   ersetzt (URL-kodiert). Hier die echten Adressen eintragen; braucht das System andere Parameter
   oder signierte Links, dann pageUrl() in services/pageLinks.js anpassen.
   Die Demo verweist auf Platzhalterseiten. */
export const PAGES = {
  dashboard: { label: "Teacher-Dashboard", url: "teacher-dashboard.html?student={studentId}" },
  results: { label: "Ergebnisse", url: "results.html?student={studentId}" },
};

/* Gültigkeit eines Test-Links in Minuten (nur Anzeige in der Demo). */
export const LINK_VALIDITY_MINUTES = 15;
