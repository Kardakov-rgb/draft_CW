/* Fenster "Tests für alle setzen": Die Testleitung wählt selbst, für welche Kinder der KPF die
   Tests gesetzt werden (Kästchen je Kind, Suche, Alle/Keine) und welche Tests das sind.
   Das Fenster speichert nicht selbst, sondern ruft `save(kinder, tests)` auf. */
import { SUBJECTS } from "../config.js";
import { matchesQuery } from "../domain/view.js";

export function createBulkSelectDialog() {
  const dialog = document.createElement("dialog");
  dialog.className = "qr-dialog bulk-dialog";
  dialog.innerHTML = `
    <form method="dialog" class="bulk-dialog__form">
      <h2 class="qr-dialog__title">Tests für mehrere Kinder setzen</h2>
      <p class="bulk-dialog__hint"></p>
      <div class="bulk-dialog__tools">
        <input class="field__control" type="search" placeholder="Name suchen" aria-label="Kinder suchen" data-search />
        <button type="button" class="button button--secondary" data-action="all">Alle</button>
        <button type="button" class="button button--secondary" data-action="none">Keine</button>
      </div>
      <p class="bulk-dialog__count" role="status"></p>
      <ul class="bulk-dialog__list"></ul>
      <fieldset class="select-dialog__tests">
        <legend>Diese Tests setzen</legend>
      </fieldset>
      <p class="select-dialog__error" role="alert" hidden></p>
      <div class="qr-dialog__actions">
        <button type="button" class="button button--secondary" data-action="cancel">Abbrechen</button>
        <button type="submit" class="button" data-save></button>
      </div>
    </form>`;
  document.body.append(dialog);

  const form = dialog.querySelector("form");
  const hint = dialog.querySelector(".bulk-dialog__hint");
  const search = dialog.querySelector("[data-search]");
  const count = dialog.querySelector(".bulk-dialog__count");
  const list = dialog.querySelector(".bulk-dialog__list");
  const fieldset = dialog.querySelector("fieldset");
  const error = dialog.querySelector(".select-dialog__error");
  const saveButton = dialog.querySelector("[data-save]");

  let students = [];
  let describe = () => ({ tests: "" });
  let selected = new Set();
  let onSave = null;

  Object.entries(SUBJECTS).forEach(([id, subject]) => {
    const label = document.createElement("label");
    label.className = "select-dialog__option";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "tests";
    input.value = id;
    input.checked = true;
    label.append(input, document.createTextNode(` ${subject.label}`));
    fieldset.append(label);
  });

  const checkedTests = () => [...fieldset.querySelectorAll("input:checked")].map((i) => i.value);
  const listed = () => students.filter((student) => matchesQuery(student, search.value));

  function row(student) {
    const info = describe(student);
    const item = document.createElement("li");
    const label = document.createElement("label");
    label.className = "bulk-row";
    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = selected.has(student.id);
    box.addEventListener("change", () => {
      if (box.checked) selected.add(student.id);
      else selected.delete(student.id);
      updateState();
    });
    const name = document.createElement("span");
    name.className = "bulk-row__name";
    name.textContent = student.name;
    const tests = document.createElement("span");
    tests.className = "bulk-row__tests";
    tests.textContent = info.tests;
    label.append(box, name, tests);
    item.append(label);
    return item;
  }

  function renderList() {
    const rows = listed();
    list.replaceChildren(...rows.map(row));
    if (rows.length === 0) {
      const empty = document.createElement("li");
      empty.className = "table-empty";
      empty.textContent = "Kein Kind passt zur Suche.";
      list.append(empty);
    }
    updateState();
  }

  function updateState() {
    const n = selected.size;
    count.textContent = `${n} von ${students.length} Kindern ausgewählt`;
    const problem =
      n === 0
        ? "Bitte mindestens ein Kind auswählen."
        : checkedTests().length === 0
          ? "Bitte mindestens einen Test auswählen."
          : "";
    error.textContent = problem;
    error.hidden = problem === "" || n === 0; // fehlende Kinder zeigt schon der Zähler
    saveButton.disabled = problem !== "";
    saveButton.textContent =
      n === 0 ? "Speichern" : `Für ${n} ${n === 1 ? "Kind" : "Kinder"} speichern`;
  }

  search.addEventListener("input", renderList);
  fieldset.addEventListener("change", updateState);
  dialog.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "cancel") dialog.close();
    if (action === "all") {
      listed().forEach((student) => selected.add(student.id)); // "Alle" gilt für die angezeigten Kinder
      renderList();
    }
    if (action === "none") {
      selected.clear();
      renderList();
    }
    if (event.target === dialog) dialog.close(); // Klick auf den Hintergrund
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (saveButton.disabled) return;
    saveButton.disabled = true;
    await onSave(
      students.filter((student) => selected.has(student.id)),
      checkedTests(),
    );
    dialog.close();
  });

  return {
    /**
     * @param {object} options
     * @param {{id: string, name: string}[]} options.students alle auswählbaren Kinder der KPF
     * @param {Set<string>} options.preselectedIds vorausgewählte Kinder
     * @param {string} options.hint Erklärtext
     * @param {(student: object) => {tests: string}} options.describe
     * @param {(students: object[], tests: string[]) => Promise<void>} options.save
     */
    open({ students: all, preselectedIds, hint: text, describe: describeStudent, save }) {
      students = all;
      selected = new Set(preselectedIds);
      describe = describeStudent;
      onSave = save;
      hint.textContent = text;
      search.value = "";
      fieldset.querySelectorAll("input").forEach((input) => (input.checked = true));
      renderList();
      dialog.showModal();
    },
  };
}
