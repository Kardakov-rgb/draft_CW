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

/* Spalten der Tabelle, in dieser Reihenfolge.
   type:
     "text"    zeigt student[field]
     "select"  Button, öffnet das Fenster zur Testauswahl
     "qr"      Button, öffnet den QR-Code für `subject` (grau, wenn Test nicht ausgewählt)
     "start"   Button, startet den Test für `subject` (grau, wenn Test nicht ausgewählt)
     "archive" Button, verschiebt das Kind ins Archiv
     "restore" Button, holt das Kind aus dem Archiv zurück */
export const COLUMNS = [
  { id: "name", label: "Name", type: "text", field: "name" },
  { id: "select", label: "Tests", type: "select" },
  { id: "qr-math", label: "QR-Code Mathe", type: "qr", subject: "math" },
  { id: "qr-german", label: "QR-Code Deutsch", type: "qr", subject: "german" },
  { id: "start-math", label: "Test Mathe", type: "start", subject: "math" },
  { id: "start-german", label: "Test Deutsch", type: "start", subject: "german" },
  { id: "archive", label: "Archiv", type: "archive" },
];

/* Spalten der Archiv-Liste. */
export const ARCHIVE_COLUMNS = [
  { id: "name", label: "Name", type: "text", field: "name" },
  { id: "restore", label: "", type: "restore" },
];

/* Gültigkeit eines Test-Links in Minuten (nur Anzeige in der Demo). */
export const LINK_VALIDITY_MINUTES = 15;
