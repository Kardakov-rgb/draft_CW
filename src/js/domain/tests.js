/* Fachlogik: welche Tests sind für ein Kind aktiv? Reine Funktionen, keine DOM-Zugriffe. */
import { FOCUS, SUBJECTS } from "../config.js";

const ALL_TESTS = Object.keys(SUBJECTS);

/** Reihenfolge: gespeicherte Auswahl, sonst Förderschwerpunkt, sonst alle Tests. */
export function activeTests(student, state) {
  if (state?.tests) return state.tests;
  return FOCUS[student.focus]?.tests ?? ALL_TESTS;
}

export function isTestActive(student, state, subject) {
  return activeTests(student, state).includes(subject);
}
