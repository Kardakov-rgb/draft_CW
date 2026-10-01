/* Speichert pro Kind: ausgewählte Tests und Archiv-Status.
   ERSATZPUNKT FÜR DIE LERNPLATTFORM: In der Demo liegt der Stand im localStorage des Browsers
   (nur auf diesem Gerät sichtbar). Im echten System durch Aufrufe der Plattform ersetzen,
   Signaturen und Rückgabeformate beibehalten.
   Stand pro Kind: { tests: string[] | null, archived: boolean }
   tests === null bedeutet "noch nichts gespeichert" (dann gilt der Förderschwerpunkt). */

const STORAGE_KEY = "draft_cw.studentState.v1";

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {}; // localStorage nicht verfügbar oder Inhalt defekt
  }
}

/** @returns {Promise<Record<string, {tests: string[]|null, archived: boolean}>>} */
export async function getStates() {
  return readAll();
}

/** Führt `patch` ({tests?, archived?}) mit dem gespeicherten Stand des Kindes zusammen. */
export async function saveState(studentId, patch) {
  const all = readAll();
  all[studentId] = { tests: null, archived: false, ...all[studentId], ...patch };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* Demo: Speichern nicht möglich, Stand gilt nur bis zum Neuladen */
  }
  return all[studentId];
}
