/* Fachlogik: Ampel-Status und Sortierung nach dem Datum des letzten Tests.
   Reine Funktionen, keine DOM-Zugriffe. Grenzwerte stehen in config.js (STATUS_THRESHOLDS). */
import { STATUS_THRESHOLDS } from "../config.js";
import { activeTests } from "./tests.js";

const SEVERITY = { green: 0, orange: 1, red: 2 };

/* Datum "JJJJ-MM-TT" als lokaler Kalendertag (ohne Zeitzonen-Verschiebung). */
function parseDay(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Ganze Kalendertage zwischen `iso` und heute (0 = heute). */
export function daysSince(iso, now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((today - parseDay(iso)) / 86400000);
}

/** @returns {{status: "green"|"orange"|"red", days: number|null}} days null = noch nie getestet */
export function subjectStatus(lastTestDate, now = new Date()) {
  if (!lastTestDate) return { status: "red", days: null };
  const days = daysSince(lastTestDate, now);
  if (days >= STATUS_THRESHOLDS.redAfterDays) return { status: "red", days };
  if (days >= STATUS_THRESHOLDS.orangeAfterDays) return { status: "orange", days };
  return { status: "green", days };
}

/* Dringlichkeit einer Zeile: schlechtester Status der ausgewählten Tests,
   bei Gleichstand der am längsten zurückliegende Test (noch nie = unendlich lang). */
function urgency(student, state, lastTests, now) {
  let severity = SEVERITY.green;
  let days = -Infinity;
  for (const subject of activeTests(student, state)) {
    const result = subjectStatus(lastTests[student.id]?.[subject], now);
    severity = Math.max(severity, SEVERITY[result.status]);
    days = Math.max(days, result.days ?? Infinity);
  }
  return { severity, days };
}

/** Sortiert rot vor orange vor grün, innerhalb einer Farbe den längsten Abstand zuerst. */
export function sortByUrgency(students, states, lastTests, now = new Date()) {
  const rank = new Map(students.map((s) => [s.id, urgency(s, states[s.id], lastTests, now)]));
  return [...students].sort((a, b) => {
    const [ra, rb] = [rank.get(a.id), rank.get(b.id)];
    if (ra.severity !== rb.severity) return rb.severity - ra.severity;
    if (ra.days !== rb.days) return rb.days > ra.days ? 1 : -1;
    return a.name.localeCompare(b.name, "de");
  });
}
