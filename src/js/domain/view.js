/* Fachlogik der Ansicht: Suche und Ampel-Filter sowie Zähler. Reine Funktionen ohne DOM. */
import { overallStatus } from "./ranking.js";

/* Kleinschreibung ohne Akzente, damit "celik" auch "Çelik" findet. */
export function normalizeText(text) {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("de");
}

export function matchesQuery(student, query) {
  const needle = normalizeText(query.trim());
  return needle === "" || normalizeText(student.name).includes(needle);
}

/** Anzahl der Kinder je Ampelfarbe (Gesamtstatus über die ausgewählten Tests). */
export function statusCounts(students, states, lastTests, now = new Date()) {
  const counts = { all: students.length, red: 0, orange: 0, green: 0 };
  for (const student of students) {
    counts[overallStatus(student, states[student.id], lastTests, now)] += 1;
  }
  return counts;
}

/** @param {{query: string, status: "all"|"red"|"orange"|"green"}} filter */
export function filterStudents(students, filter, states, lastTests, now = new Date()) {
  return students.filter(
    (student) =>
      matchesQuery(student, filter.query) &&
      (filter.status === "all" ||
        overallStatus(student, states[student.id], lastTests, now) === filter.status),
  );
}
