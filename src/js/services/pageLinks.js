/* Adressen der bestehenden Seiten des Systems (Teacher-Dashboard, Ergebnisse).
   ERSATZPUNKT FÜR DAS SYSTEM: Muster stehen in PAGES (config.js). Braucht das Zielsystem weitere
   Parameter, Anmeldung per Token o. Ä., hier anpassen. Die Zielseiten selbst prüfen die Berechtigung. */
import { PAGES } from "../config.js";

/** @param {keyof typeof PAGES} page @param {{id: string}} student @returns {string} */
export function pageUrl(page, student) {
  return PAGES[page].url.replace("{studentId}", encodeURIComponent(student.id));
}
