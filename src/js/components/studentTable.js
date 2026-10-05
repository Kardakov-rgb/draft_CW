/* Tabellen der Kinder (aktive Liste und Archiv). Spalten kommen aus config.js.
   Neuer Spaltentyp = neuer Eintrag in CELL_RENDERERS
   (Funktion: Kind, Spalte, Kontext -> DOM-Knoten).
   Kontext: { state, lastTests, now, qrDialog, selectDialog, confirmDialog, actions: { saveTests, archive, restore } }
   Spalten mit `subject` bekommen die Ampelfarbe des Fachs (data-status). Ist der Test für das Kind
   nicht ausgewählt, übernehmen sie die Farbe der ausgewählten Tests (einheitliche Zeile). */
import { FOCUS, PAGES, SUBJECTS } from "../config.js";
import { overallStatus, subjectStatus } from "../domain/ranking.js";
import { activeTests, isTestActive } from "../domain/tests.js";
import { pageUrl } from "../services/pageLinks.js";
import { createTestLink } from "../services/testLinkService.js";
import { createIcon } from "./icons.js";

const INACTIVE_HINT = "Für dieses Kind nicht vorgesehen";

/* Symbol-Button. `label` ist der Name für Screenreader (mit Kontext), `hint` der kurze Tooltip. */
function iconButton({ icon, label, hint, className, onClick }) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = `button button--icon ${className}`;
  el.setAttribute("aria-label", label);
  el.title = hint;
  el.append(createIcon(icon));
  el.addEventListener("click", onClick);
  return el;
}

/* Test-Button, der für nicht ausgewählte Tests grau und nicht klickbar ist. */
function testButton(student, column, ctx, options) {
  const el = iconButton(options);
  if (!isTestActive(student, ctx.state[student.id], column.subject)) {
    el.disabled = true;
    el.title = INACTIVE_HINT;
  }
  return el;
}

/* Abstand zum letzten Test in Tagen ("12 Tage"), ohne Datum. */
function lastTestText(student, column, ctx) {
  const wrapper = document.createElement("span");
  wrapper.className = "last-test";
  if (!isTestActive(student, ctx.state[student.id], column.subject)) {
    wrapper.textContent = "–";
    return wrapper;
  }
  const { days } = subjectStatus(ctx.lastTests[student.id]?.[column.subject], ctx.now);
  wrapper.textContent =
    days === null ? "Noch nie" : days === 0 ? "Heute" : days === 1 ? "1 Tag" : `${days} Tage`;
  return wrapper;
}

/* Link auf eine bestehende Seite, öffnet in neuem Tab (die Liste bleibt stehen). */
function pageLink(student, column) {
  const label = PAGES[column.page].label;
  const link = document.createElement("a");
  link.href = pageUrl(column.page, student);
  link.target = "_blank";
  link.rel = "noopener";
  if (column.icon) {
    link.className = "button button--icon button--secondary";
    link.setAttribute("aria-label", `${label} von ${student.name} öffnen (neuer Tab)`);
    link.title = `${label} öffnen`;
    link.append(createIcon(column.icon));
  } else {
    link.className = "student-link";
    link.textContent = student[column.field];
    link.title = `${label} öffnen`;
    link.setAttribute("aria-label", `${student.name}: ${label} öffnen (neuer Tab)`);
  }
  return link;
}

const CELL_RENDERERS = {
  text: (student, column) => document.createTextNode(student[column.field] ?? ""),

  pageLink,

  lastTest: lastTestText,

  select: (student, column, ctx) =>
    iconButton({
      icon: "select",
      label: `Tests für ${student.name} auswählen`,
      hint: "Tests auswählen",
      className: "button--secondary",
      onClick: () =>
        ctx.selectDialog.open({
          title: student.name,
          hint: FOCUS[student.focus]
            ? `Förderschwerpunkt laut Datenbank: ${FOCUS[student.focus].label}`
            : "Kein Förderschwerpunkt hinterlegt.",
          currentTests: activeTests(student, ctx.state[student.id]),
          save: (tests) => ctx.actions.saveTests(student, tests),
        }),
    }),

  qr: (student, column, ctx) =>
    testButton(student, column, ctx, {
      icon: "qr",
      label: `QR-Code ${SUBJECTS[column.subject].label} für ${student.name} anzeigen`,
      hint: "QR-Code anzeigen",
      className: "button--secondary",
      onClick: () => ctx.qrDialog.open(student, column.subject),
    }),

  start: (student, column, ctx) =>
    testButton(student, column, ctx, {
      icon: "play",
      label: `Test ${SUBJECTS[column.subject].label} für ${student.name} starten`,
      hint: "Test starten",
      className: "",
      onClick: async (event) => {
        const button = event.currentTarget;
        const confirmed = await ctx.confirmDialog.ask({
          title: `${SUBJECTS[column.subject].label}-Test starten`,
          message: `Soll der Test für ${student.name} jetzt auf diesem Gerät gestartet werden?`,
          confirmLabel: "Test starten",
        });
        if (!confirmed) return;
        button.disabled = true;
        const { url } = await createTestLink({ studentId: student.id, subject: column.subject });
        window.location.assign(url);
      },
    }),

  archive: (student, column, ctx) =>
    iconButton({
      icon: "archive",
      label: `${student.name} archivieren`,
      hint: "Archivieren",
      className: "button--secondary",
      onClick: () => ctx.actions.archive(student),
    }),

  restore: (student, column, ctx) =>
    iconButton({
      icon: "restore",
      label: `${student.name} wiederherstellen`,
      hint: "Wiederherstellen",
      className: "button--secondary",
      onClick: () => ctx.actions.restore(student),
    }),
};

export function renderStudentTable(container, columns, students, ctx, emptyText) {
  if (students.length === 0) {
    const empty = document.createElement("p");
    empty.className = "table-empty";
    empty.textContent = emptyText ?? "Keine Kinder in dieser Liste.";
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
      if (column.subject) {
        const childState = ctx.state[student.id];
        cell.dataset.status = isTestActive(student, childState, column.subject)
          ? subjectStatus(ctx.lastTests[student.id]?.[column.subject], ctx.now).status
          : overallStatus(student, childState, ctx.lastTests, ctx.now);
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
