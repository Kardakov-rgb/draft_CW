/* Zentrale Konfiguration der Testübersicht.
   Neue Spalte hinzufügen = Eintrag in COLUMNS (ggf. neuer Typ in components/studentTable.js). */

/* Testfächer. Neues Fach = Eintrag hier, die Spalten dazu in COLUMNS. */
export const SUBJECTS = {
  math: { label: "Mathe" },
  german: { label: "Deutsch" },
};

/* Spalten der Tabelle, in dieser Reihenfolge.
   type:
     "text"  zeigt student[field]
     "qr"    Button, öffnet den QR-Code für `subject`
     "start" Button, startet den Test für `subject` direkt */
export const COLUMNS = [
  { id: "name", label: "Name", type: "text", field: "name" },
  { id: "qr-math", label: "QR-Code Mathe", type: "qr", subject: "math" },
  { id: "qr-german", label: "QR-Code Deutsch", type: "qr", subject: "german" },
  { id: "start-math", label: "Test Mathe", type: "start", subject: "math" },
  { id: "start-german", label: "Test Deutsch", type: "start", subject: "german" },
];

/* Gültigkeit eines Test-Links in Minuten (nur Anzeige in der Demo). */
export const LINK_VALIDITY_MINUTES = 15;
