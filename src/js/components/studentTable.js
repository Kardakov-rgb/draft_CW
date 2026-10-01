/* Tabellen der Kinder (aktive Liste und Archiv). Spalten kommen aus config.js.
   Neuer Spaltentyp = neuer Eintrag in CELL_RENDERERS
   (Funktion: Kind, Spalte, Kontext -> DOM-Knoten).
   Kontext: { state, qrDialog, selectDialog, actions: { saveTests, archive, restore } } */
import { activeTests, isTestActive } from "../domain/tests.js";
import { createTestLink } from "../services/testLinkService.js";

const INACTIVE_HINT = "Für dieses Kind nicht vorgesehen";

function button(label, className, onClick) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = className;
  el.textContent = label;
  el.addEventListener("click", onClick);
  return el;
}

/* Test-Button, der für nicht ausgewählte Tests grau und nicht klickbar ist. */
function testButton(student, column, ctx, label, className, onClick) {
  const el = button(label, className, onClick);
  if (!isTestActive(student, ctx.state[student.id], column.subject)) {
    el.disabled = true;
    el.title = INACTIVE_HINT;
  }
  return el;
}

const CELL_RENDERERS = {
  text: (student, column) => document.createTextNode(student[column.field] ?? ""),

  select: (student, column, ctx) =>
    button("Tests auswählen", "button button--secondary", () =>
      ctx.selectDialog.open(student, activeTests(student, ctx.state[student.id]), (tests) =>
        ctx.actions.saveTests(student, tests),
      ),
    ),

  qr: (student, column, ctx) =>
    testButton(student, column, ctx, "QR-Code", "button button--secondary", () =>
      ctx.qrDialog.open(student, column.subject),
    ),

  start: (student, column, ctx) =>
    testButton(student, column, ctx, "Starten", "button", async (event) => {
      event.currentTarget.disabled = true;
      const { url } = await createTestLink({ studentId: student.id, subject: column.subject });
      window.location.assign(url);
    }),

  archive: (student, column, ctx) =>
    button("Archivieren", "button button--secondary", () => ctx.actions.archive(student)),

  restore: (student, column, ctx) =>
    button("Wiederherstellen", "button button--secondary", () => ctx.actions.restore(student)),
};

export function renderStudentTable(container, columns, students, ctx) {
  if (students.length === 0) {
    const empty = document.createElement("p");
    empty.className = "table-empty";
    empty.textContent = "Keine Kinder in dieser Liste.";
    container.replaceChildren(empty);
    return;
  }

  const table = document.createElement("table");
  table.className = "student-table";

  const headRow = table.createTHead().insertRow();
  columns.forEach((column) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = column.label;
    headRow.append(th);
  });

  const body = table.createTBody();
  students.forEach((student) => {
    const row = body.insertRow();
    columns.forEach((column) => {
      row.insertCell().append(CELL_RENDERERS[column.type](student, column, ctx));
    });
  });

  container.replaceChildren(table);
}
