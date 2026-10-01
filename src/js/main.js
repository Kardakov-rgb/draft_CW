/* Einstiegspunkt. Importiert Module und initialisiert sie nach DOM-Ready.
   Keine Logik hier – nur Verdrahtung. */

function init() {
  // Beispiel: import { initNav } from "./components/nav.js"; initNav();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
