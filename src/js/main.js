/* Einstiegspunkt. Importiert Module und initialisiert sie nach DOM-Ready.
   Keine Logik hier – nur Verdrahtung. */
import { getStudents, GROUP_NAME } from "./data/students.js";
import { createQrDialog } from "./components/qrDialog.js";
import { renderStudentTable } from "./components/studentTable.js";

async function init() {
  document.querySelector("[data-group-name]").textContent = GROUP_NAME;
  const students = await getStudents();
  renderStudentTable(document.querySelector("[data-student-table]"), students, {
    qrDialog: createQrDialog(),
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
