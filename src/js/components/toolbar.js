/* Werkzeugleiste über der Liste: KPF-Auswahl, Suche, Sortierung, Ampel-Filter und Sammelaktionen.
   Das Markup steht in index.html (data-Attribute), diese Datei verdrahtet es und meldet Änderungen. */
import { SORT_OPTIONS, STATUS_LABELS, SUBJECTS } from "../config.js";
import { createIcon } from "./icons.js";

function option(value, label) {
  const el = document.createElement("option");
  el.value = value;
  el.textContent = label;
  return el;
}

/**
 * @param {object} options
 * @param {{id: string, name: string}[]} options.kpfs
 * @param {{kpfId: string, query: string, status: string, sort: string}} options.view
 * @param {(change: "kpf"|"sort"|"filter") => void} options.onChange
 * @param {() => void} options.onBulkSelect
 * @param {(subject: string) => void} options.onSheet
 */
export function initToolbar({ kpfs, view, onChange, onBulkSelect, onSheet }) {
  const kpfSelect = document.querySelector("[data-kpf-select]");
  const sortSelect = document.querySelector("[data-sort-select]");
  const search = document.querySelector("[data-search]");
  const chipsEl = document.querySelector("[data-status-chips]");
  const actionsEl = document.querySelector("[data-toolbar-actions]");

  kpfSelect.replaceChildren(...kpfs.map((kpf) => option(kpf.id, kpf.name)));
  kpfSelect.value = view.kpfId;
  kpfSelect.addEventListener("change", () => {
    view.kpfId = kpfSelect.value;
    onChange("kpf");
  });

  sortSelect.replaceChildren(...SORT_OPTIONS.map((sort) => option(sort.id, sort.label)));
  sortSelect.value = view.sort;
  sortSelect.addEventListener("change", () => {
    view.sort = sortSelect.value;
    onChange("sort");
  });

  search.addEventListener("input", () => {
    view.query = search.value;
    onChange("filter");
  });

  const chips = ["all", "red", "orange", "green"].map((status) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `chip chip--${status}`;
    chip.addEventListener("click", () => {
      view.status = status;
      onChange("filter");
    });
    chipsEl.append(chip);
    return { status, chip };
  });

  const bulkButton = document.createElement("button");
  bulkButton.type = "button";
  bulkButton.className = "button button--secondary button--with-text";
  bulkButton.addEventListener("click", onBulkSelect);
  actionsEl.append(bulkButton);

  const sheetButtons = Object.entries(SUBJECTS).map(([subject, { label }]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button button--secondary button--with-text";
    button.addEventListener("click", () => onSheet(subject));
    actionsEl.append(button);
    return { subject, label, button };
  });

  /** Aktualisiert Zähler, Auswahlzustand und Beschriftungen. */
  return function update({ counts, visibleCount }) {
    chips.forEach(({ status, chip }) => {
      chip.textContent = `${status === "all" ? "Alle" : STATUS_LABELS[status]} (${counts[status]})`;
      chip.setAttribute("aria-pressed", String(view.status === status));
    });
    bulkButton.replaceChildren(
      createIcon("select"),
      document.createTextNode(`Tests für alle setzen (${visibleCount})`),
    );
    bulkButton.disabled = visibleCount === 0;
    sheetButtons.forEach(({ label, button }) => {
      button.replaceChildren(createIcon("qr"), document.createTextNode(`QR-Sammelblatt ${label}`));
      button.disabled = visibleCount === 0;
    });
  };
}
