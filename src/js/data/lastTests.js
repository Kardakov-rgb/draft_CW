/* DEMO-DATEN. Datum des letzten Tests pro Kind und Fach, aus der Datenbank.
   Ersatzpunkt: getLastTestDates() durch einen API-Aufruf ersetzen, Rückgabeformat beibehalten:
   { [studentId]: { [subjectId]: "JJJJ-MM-TT" | null } }, null = noch nie getestet.
   Die Demo-Daten sind relativ zu heute berechnet, damit immer alle Farben vorkommen. */
const MATH_DAYS_AGO = [3, 14, 27, 28, 35, 41, 42, 60, null, 10];
const GERMAN_DAYS_AGO = [8, 29, 1, 45, 21, null, 33, 42, 27, 90];

function daysAgo(days, now) {
  if (days === null) return null;
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days);
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** @param {{id: string}[]} students */
export async function getLastTestDates(students, now = new Date()) {
  return Object.fromEntries(
    students.map((student, i) => [
      student.id,
      {
        math: daysAgo(MATH_DAYS_AGO[i % MATH_DAYS_AGO.length], now),
        german: daysAgo(GERMAN_DAYS_AGO[(i * 3 + 1) % GERMAN_DAYS_AGO.length], now),
      },
    ]),
  );
}
