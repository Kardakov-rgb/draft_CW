/* Dialog zur Auswahl der Tests für ein Kind oder (Sammelauswahl) für mehrere Kinder.
   Speichern nur mit mindestens einem Test (Kinder, die nicht getestet werden, werden archiviert). */
import { SUBJECTS } from "../config.js";

export function createTestSelectDialog() {
  const dialog = document.createElement("dialog");
  dialog.className = "qr-dialog";
  dialog.innerHTML = `
    <form method="dialog" class="select-dialog__form">
      <h2 class="qr-dialog__title"></h2>
      <p class="select-dialog__focus"></p>
      <fieldset class="select-dialog__tests">
        <legend>Welche Tests soll das Kind machen?</legend>
      </fieldset>
      <p class="select-dialog__error" role="alert" hidden>Bitte mindestens einen Test auswählen.</p>
      <div class="qr-dialog__actions">
        <button type="button" class="button button--secondary" data-action="cancel">Abbrechen</button>
        <button type="submit" class="button">Speichern</button>
      </div>
    </form>`;
  document.body.append(dialog);

  const form = dialog.querySelector("form");
  const title = dialog.querySelector(".qr-dialog__title");
  const focusLine = dialog.querySelector(".select-dialog__focus");
  const fieldset = dialog.querySelector("fieldset");
  const error = dialog.querySelector(".select-dialog__error");
  const saveButton = dialog.querySelector("[type=submit]");
  let onSave = null;

  Object.entries(SUBJECTS).forEach(([id, subject]) => {
    const label = document.createElement("label");
    label.className = "select-dialog__option";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "tests";
    input.value = id;
    label.append(input, document.createTextNode(` ${subject.label}`));
    fieldset.append(label);
  });

  const checked = () => [...form.querySelectorAll("input:checked")].map((i) => i.value);
  function validate() {
    const valid = checked().length > 0;
    saveButton.disabled = !valid;
    error.hidden = valid;
  }

  form.addEventListener("change", validate);
  dialog.querySelector("[data-action=cancel]").addEventListener("click", () => dialog.close());
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (checked().length === 0) return;
    await onSave(checked());
    dialog.close();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close(); // Klick auf den Hintergrund
  });

  return {
    /**
     * @param {{title: string, hint: string, currentTests: string[], save: (tests: string[]) => Promise<void>}} options
     */
    open({ title: heading, hint, currentTests, save }) {
      onSave = save;
      title.textContent = heading;
      focusLine.textContent = hint;
      form.querySelectorAll("input").forEach((i) => (i.checked = currentTests.includes(i.value)));
      validate();
      dialog.showModal();
    },
  };
}
