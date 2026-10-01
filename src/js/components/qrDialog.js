/* Dialog, der einen QR-Code für einen Test anzeigt. Bei jedem Öffnen und bei "Neu erzeugen"
   wird über den Service ein neuer Link angefordert. */
import { SUBJECTS } from "../config.js";
import { createTestLink } from "../services/testLinkService.js";
import { renderQr } from "./qr.js";

export function createQrDialog() {
  const dialog = document.createElement("dialog");
  dialog.className = "qr-dialog";
  dialog.innerHTML = `
    <h2 class="qr-dialog__title"></h2>
    <div class="qr-dialog__code"></div>
    <p class="qr-dialog__hint"></p>
    <p class="qr-dialog__url"></p>
    <div class="qr-dialog__actions">
      <button type="button" class="button button--secondary" data-action="renew">Neu erzeugen</button>
      <button type="button" class="button" data-action="close">Schließen</button>
    </div>`;
  document.body.append(dialog);

  const title = dialog.querySelector(".qr-dialog__title");
  const code = dialog.querySelector(".qr-dialog__code");
  const hint = dialog.querySelector(".qr-dialog__hint");
  const urlLine = dialog.querySelector(".qr-dialog__url");
  let current = null;

  async function load() {
    code.replaceChildren();
    const { url, expiresAt } = await createTestLink(current);
    const svg = renderQr(url, "qr-dialog__qr");
    svg.setAttribute(
      "aria-label",
      `QR-Code für ${current.name}, ${SUBJECTS[current.subject].label}`,
    );
    code.append(svg);
    hint.textContent = `Gültig bis ${expiresAt.toLocaleTimeString("de-DE", { timeStyle: "short" })} Uhr`;
    urlLine.textContent = url; // Demo-Hilfe: zeigt den Link, im Produktivsystem entfernen
  }

  dialog.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "close") dialog.close();
    if (action === "renew") load();
    if (event.target === dialog) dialog.close(); // Klick auf den Hintergrund
  });

  return {
    open(student, subject) {
      current = { studentId: student.id, name: student.name, subject };
      title.textContent = `${student.name} – ${SUBJECTS[subject].label}`;
      dialog.showModal();
      return load();
    },
  };
}
