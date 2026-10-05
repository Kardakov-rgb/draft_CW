/* Bestätigungsfenster. ask() liefert true bei Bestätigung, false bei Abbrechen, Esc oder Klick daneben.
   Der Fokus startet auf "Abbrechen", damit ein versehentliches Enter nichts auslöst. */
export function createConfirmDialog() {
  const dialog = document.createElement("dialog");
  dialog.className = "qr-dialog";
  dialog.innerHTML = `
    <form method="dialog">
      <h2 class="qr-dialog__title"></h2>
      <p class="confirm-dialog__message"></p>
      <div class="qr-dialog__actions">
        <button type="submit" value="cancel" class="button button--secondary">Abbrechen</button>
        <button type="submit" value="confirm" class="button"></button>
      </div>
    </form>`;
  document.body.append(dialog);

  const title = dialog.querySelector(".qr-dialog__title");
  const message = dialog.querySelector(".confirm-dialog__message");
  const confirmButton = dialog.querySelector("[value=confirm]");
  let resolveAnswer = null;

  dialog.addEventListener("close", () => {
    resolveAnswer?.(dialog.returnValue === "confirm");
    resolveAnswer = null;
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close("cancel"); // Klick auf den Hintergrund
  });

  return {
    /** @returns {Promise<boolean>} */
    ask({ title: heading, message: text, confirmLabel }) {
      title.textContent = heading;
      message.textContent = text;
      confirmButton.textContent = confirmLabel;
      dialog.returnValue = "";
      dialog.showModal();
      return new Promise((resolve) => {
        resolveAnswer = resolve;
      });
    },
  };
}
