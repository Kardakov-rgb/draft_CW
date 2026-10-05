/* QR-Sammelblatt: ein Fach, alle Kinder der aktuellen Ansicht, zum Ausdrucken (Karten zum Ausschneiden).
   Verwendet länger gültige Links (purpose "sheet"). Gedruckt wird nur dieses Fenster (siehe sheet.css). */
import { SUBJECTS } from "../config.js";
import { createTestLink } from "../services/testLinkService.js";
import { renderQr } from "./qr.js";

const DATE_FORMAT = { dateStyle: "short", timeStyle: "short" };

export function createQrSheet() {
  const dialog = document.createElement("dialog");
  dialog.className = "sheet-dialog";
  dialog.innerHTML = `
    <div class="sheet__toolbar">
      <div>
        <h2 class="sheet__title"></h2>
        <p class="sheet__info"></p>
        <p class="sheet__warning"><strong>Achtung:</strong> Die Codes melden Kinder direkt im Test an.
          Nur an die jeweiligen Kinder austeilen, nicht fotografieren oder weitergeben.</p>
      </div>
      <div class="sheet__actions">
        <button type="button" class="button" data-action="print">Drucken</button>
        <button type="button" class="button button--secondary" data-action="close">Schließen</button>
      </div>
    </div>
    <div class="sheet__grid"></div>`;
  document.body.append(dialog);

  const title = dialog.querySelector(".sheet__title");
  const info = dialog.querySelector(".sheet__info");
  const grid = dialog.querySelector(".sheet__grid");
  const printButton = dialog.querySelector("[data-action=print]");

  dialog.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "close") dialog.close();
    if (action === "print") window.print();
  });

  function card(student, subject, { url, expiresAt }) {
    const article = document.createElement("article");
    article.className = "sheet-card";
    const name = document.createElement("h3");
    name.className = "sheet-card__name";
    name.textContent = student.name;
    const svg = renderQr(url, "sheet-card__qr");
    svg.setAttribute("aria-label", `QR-Code für ${student.name}`);
    const meta = document.createElement("p");
    meta.className = "sheet-card__meta";
    meta.textContent = `${SUBJECTS[subject].label} · gültig bis ${expiresAt.toLocaleString("de-DE", DATE_FORMAT)} Uhr`;
    article.append(name, svg, meta);
    return article;
  }

  return {
    /** @param {{kpfName: string, subject: string, students: {id: string, name: string}[], skipped: number}} options */
    async open({ kpfName, subject, students, skipped }) {
      title.textContent = `QR-Sammelblatt ${SUBJECTS[subject].label} – ${kpfName}`;
      info.textContent =
        `${students.length} Kinder` +
        (skipped > 0 ? ` (${skipped} ohne ${SUBJECTS[subject].label}-Test nicht enthalten)` : "");
      grid.textContent =
        students.length === 0 ? "Keine Kinder in der aktuellen Ansicht." : "Codes werden erzeugt …";
      printButton.disabled = true;
      dialog.showModal();
      if (students.length === 0) return;

      try {
        const links = await Promise.all(
          students.map((student) =>
            createTestLink({ studentId: student.id, subject, purpose: "sheet" }),
          ),
        );
        grid.replaceChildren(...students.map((student, i) => card(student, subject, links[i])));
        printButton.disabled = false;
      } catch {
        grid.textContent = "Die Codes konnten nicht erzeugt werden. Bitte später erneut versuchen.";
      }
    },
  };
}
