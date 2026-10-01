/* Tabelle der Kinder. Spalten kommen aus config.js (COLUMNS).
   Neuer Spaltentyp = neuer Eintrag in CELL_RENDERERS (Funktion: Kind, Spalte, Kontext -> DOM-Knoten). */
import { COLUMNS, SUBJECTS } from "../config.js";
import { createTestLink } from "../services/testLinkService.js";

function button(label, className, onClick) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = className;
  el.textContent = label;
  el.addEventListener("click", onClick);
  return el;
}

const CELL_RENDERERS = {
  text: (student, column) => document.createTextNode(student[column.field] ?? ""),

  qr: (student, column, { qrDialog }) =>
    button("QR-Code anzeigen", "button button--secondary", () =>
      qrDialog.open(student, column.subject),
    ),

  start: (student, column) =>
    button(`${SUBJECTS[column.subject].label} starten`, "button", async (event) => {
      event.currentTarget.disabled = true;
      const { url } = await createTestLink({ studentId: student.id, subject: column.subject });
      window.location.assign(url);
    }),
};

export function renderStudentTable(container, students, context) {
  const table = document.createElement("table");
  table.className = "student-table";

  const headRow = table.createTHead().insertRow();
  COLUMNS.forEach((column) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = column.label;
    headRow.append(th);
  });

  const body = table.createTBody();
  students.forEach((student) => {
    const row = body.insertRow();
    COLUMNS.forEach((column) => {
      const cell = row.insertCell();
      cell.append(CELL_RENDERERS[column.type](student, column, context));
    });
  });

  container.replaceChildren(table);
}
