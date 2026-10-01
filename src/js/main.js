/* Einstiegspunkt: lädt Daten, verdrahtet Komponenten und zeichnet die Listen neu,
   sobald sich ein Stand ändert. Fachlogik liegt in domain/, Datenzugriff in services/ und data/. */
import { ARCHIVE_COLUMNS, COLUMNS } from "./config.js";
import { getStudents, GROUP_NAME } from "./data/students.js";
import { getStates, saveState } from "./services/studentStateService.js";
import { createQrDialog } from "./components/qrDialog.js";
import { createTestSelectDialog } from "./components/testSelectDialog.js";
import { renderStudentTable } from "./components/studentTable.js";

async function init() {
  document.querySelector("[data-group-name]").textContent = GROUP_NAME;
  const students = await getStudents();
  const state = await getStates();

  const listEl = document.querySelector("[data-student-table]");
  const archiveEl = document.querySelector("[data-archive-table]");
  const archiveCount = document.querySelector("[data-archive-count]");

  async function update(student, patch) {
    state[student.id] = await saveState(student.id, patch);
    render();
  }

  const ctx = {
    state,
    qrDialog: createQrDialog(),
    selectDialog: createTestSelectDialog(),
    actions: {
      saveTests: (student, tests) => update(student, { tests }),
      archive: (student) => update(student, { archived: true }),
      restore: (student) => update(student, { archived: false }),
    },
  };

  function render() {
    const isArchived = (s) => state[s.id]?.archived === true;
    const active = students.filter((s) => !isArchived(s));
    const archived = students.filter(isArchived);
    archiveCount.textContent = archived.length;
    renderStudentTable(listEl, COLUMNS, active, ctx);
    renderStudentTable(archiveEl, ARCHIVE_COLUMNS, archived, ctx);
  }

  render();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
