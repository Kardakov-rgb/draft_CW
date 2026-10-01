/* Tabellen der Kinder (aktive Liste und Archiv). Spalten kommen aus config.js.
   Neuer Spaltentyp = neuer Eintrag in CELL_RENDERERS
   (Funktion: Kind, Spalte, Kontext -> DOM-Knoten).
   Kontext: { state, lastTests, now, qrDialog, selectDialog, actions: { saveTests, archive, restore } }
   Spalten mit `subject` bekommen die Ampelfarbe des Fachs (data-status), sofern der Test aktiv ist. */
import { SUBJECTS } from "../config.js";
import { subjectStatus } from "../domain/ranking.js";
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

function lastTestText(student, column, ctx) {
  const wrapper = document.createElement("span");
  wrapper.className = "last-test";
  if (!isTestActive(student, ctx.state[student.id], column.subject)) {
    wrapper.textContent = "–";
    return wrapper;
  }
  const iso = ctx.lastTests[student.id]?.[column.subject];
  const { days } = subjectStatus(iso, ctx.now);
  const date = document.createElement("span");
  const relative = document.createElement("span");
  relative.className = "last-test__relative";
  if (days === null) {
    date.textContent = "Noch nie";
  } else {
    const [year, month, day] = iso.split("-").map(Number);
    date.textContent = new Date(year, month - 1, day).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    relative.textContent = days === 0 ? "heute" : days === 1 ? "vor 1 Tag" : `vor ${days} Tagen`;
  }
  wrapper.append(date, relative);
  return wrapper;
}

const CELL_RENDERERS = {
  text: (student, column) => document.createTextNode(student[column.field] ?? ""),

  lastTest: lastTestText,

  select: (student, column, ctx) =>
    button("Auswählen", "button button--secondary", () =>
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

  renderHead(table, columns);

  const body = table.createTBody();
  students.forEach((student) => {
    const row = body.insertRow();
    columns.forEach((column, index) => {
      const cell = row.insertCell();
      cell.append(CELL_RENDERERS[column.type](student, column, ctx));
      if (column.subject && isTestActive(student, ctx.state[student.id], column.subject)) {
        const iso = ctx.lastTests[student.id]?.[column.subject];
        cell.dataset.status = subjectStatus(iso, ctx.now).status;
      }
      if (column.group && column.group !== columns[index - 1]?.group) {
        cell.dataset.groupStart = "";
      }
    });
  });

  container.replaceChildren(table);
}

/* Kopfzeile. Spalten mit `group` bekommen eine gemeinsame Überschrift (Fach) in einer
   zusätzlichen Zeile, alle anderen Spalten erstrecken sich über beide Zeilen. */
function renderHead(table, columns) {
  const head = table.createTHead();
  const top = head.insertRow();
  const hasGroups = columns.some((column) => column.group);
  const sub = hasGroups ? head.insertRow() : null;

  columns.forEach((column, index) => {
    if (!column.group) {
      const th = document.createElement("th");
      th.scope = "col";
      th.textContent = column.label;
      if (hasGroups) th.rowSpan = 2;
      top.append(th);
      return;
    }
    if (column.group !== columns[index - 1]?.group) {
      const th = document.createElement("th");
      th.scope = "colgroup";
      th.colSpan = columns.filter((c) => c.group === column.group).length;
      th.textContent = SUBJECTS[column.group].label;
      th.className = "student-table__group";
      top.append(th);
    }
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = column.label;
    sub.append(th);
  });
}
