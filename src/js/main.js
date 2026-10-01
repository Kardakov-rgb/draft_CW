/* Einstiegspunkt: lädt Daten, verdrahtet Komponenten und zeichnet die Listen neu,
   sobald sich Ansicht oder Stand ändern. Fachlogik liegt in domain/, Datenzugriff in services/ und data/. */
import { ARCHIVE_COLUMNS, COLUMNS, SUBJECTS } from "./config.js";
import { getKpfs, getStudents } from "./data/students.js";
import { getLastTestDates } from "./data/lastTests.js";
import { sortStudents } from "./domain/ranking.js";
import { filterStudents, statusCounts } from "./domain/view.js";
import { isTestActive } from "./domain/tests.js";
import { getStates, saveState } from "./services/studentStateService.js";
import { createConfirmDialog } from "./components/confirmDialog.js";
import { createQrDialog } from "./components/qrDialog.js";
import { createQrSheet } from "./components/qrSheet.js";
import { createTestSelectDialog } from "./components/testSelectDialog.js";
import { initToolbar } from "./components/toolbar.js";
import { renderStudentTable } from "./components/studentTable.js";

const KPF_STORAGE_KEY = "draft_cw.kpf.v1";

/* Zuletzt gewählte KPF merken (nur Komfort, die Seite funktioniert auch ohne). */
function loadKpfId(kpfs) {
  try {
    const saved = localStorage.getItem(KPF_STORAGE_KEY);
    if (kpfs.some((kpf) => kpf.id === saved)) return saved;
  } catch {
    /* localStorage nicht verfügbar */
  }
  return kpfs[0]?.id;
}

function rememberKpfId(id) {
  try {
    localStorage.setItem(KPF_STORAGE_KEY, id);
  } catch {
    /* ignorieren */
  }
}

async function init() {
  const now = new Date();
  const kpfs = await getKpfs();
  const state = await getStates();
  const view = { kpfId: loadKpfId(kpfs), query: "", status: "all", sort: "urgency" };

  let students = []; // Kinder der gewählten KPF
  let order = []; // Reihenfolge, wird nur bei KPF- oder Sortierwechsel neu berechnet
  const ctx = { state, lastTests: {}, now };

  const listEl = document.querySelector("[data-student-table]");
  const archiveEl = document.querySelector("[data-archive-table]");
  const archiveCount = document.querySelector("[data-archive-count]");
  const visible = () => {
    const active = order.filter((s) => state[s.id]?.archived !== true);
    return filterStudents(active, view, state, ctx.lastTests, now);
  };

  async function patch(student, change) {
    state[student.id] = await saveState(student.id, change);
  }

  Object.assign(ctx, {
    qrDialog: createQrDialog(),
    selectDialog: createTestSelectDialog(),
    confirmDialog: createConfirmDialog(),
    actions: {
      saveTests: async (student, tests) => {
        await patch(student, { tests });
        render();
      },
      archive: async (student) => {
        await patch(student, { archived: true });
        render();
      },
      restore: async (student) => {
        await patch(student, { archived: false });
        render();
      },
    },
  });
  const sheet = createQrSheet();

  const updateToolbar = initToolbar({
    kpfs,
    view,
    onChange: async (change) => {
      if (change === "kpf") {
        rememberKpfId(view.kpfId);
        view.query = "";
        view.status = "all";
        document.querySelector("[data-search]").value = "";
        await loadKpf();
      } else if (change === "sort") {
        resort();
      }
      render();
    },
    onBulkSelect: () => {
      const targets = visible();
      ctx.selectDialog.open({
        title: `Tests für ${targets.length} Kinder`,
        hint: "Überschreibt die gespeicherte Auswahl aller Kinder in der aktuellen Ansicht (Filter und Suche beachtet).",
        currentTests: Object.keys(SUBJECTS),
        save: async (tests) => {
          for (const student of targets) await patch(student, { tests });
          render();
        },
      });
    },
    onSheet: (subject) => {
      const targets = visible();
      const withTest = targets.filter((s) => isTestActive(s, state[s.id], subject));
      sheet.open({
        kpfName: kpfs.find((kpf) => kpf.id === view.kpfId)?.name ?? "",
        subject,
        students: withTest,
        skipped: targets.length - withTest.length,
      });
    },
  });

  function resort() {
    order = sortStudents(view.sort, students, state, ctx.lastTests, now);
  }

  async function loadKpf() {
    students = await getStudents(view.kpfId);
    ctx.lastTests = await getLastTestDates(students, now);
    resort();
  }

  function render() {
    const archived = order.filter((s) => state[s.id]?.archived === true);
    const active = order.filter((s) => state[s.id]?.archived !== true);
    const shown = filterStudents(active, view, state, ctx.lastTests, now);
    archiveCount.textContent = archived.length;
    updateToolbar({
      counts: statusCounts(active, state, ctx.lastTests, now),
      visibleCount: shown.length,
    });
    renderStudentTable(
      listEl,
      COLUMNS,
      shown,
      ctx,
      active.length === 0
        ? "Keine Kinder in dieser KPF."
        : "Keine Kinder passen zu Filter und Suche.",
    );
    renderStudentTable(archiveEl, ARCHIVE_COLUMNS, archived, ctx);
  }

  await loadKpf();
  render();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
