/* Tests der Fachlogik (ohne Abhängigkeiten): npm test */
import test from "node:test";
import assert from "node:assert/strict";
import {
  daysSince,
  overallStatus,
  sortByUrgency,
  subjectStatus,
} from "../src/js/domain/ranking.js";
import { activeTests } from "../src/js/domain/tests.js";

const NOW = new Date(2026, 9, 1, 15, 0); // 1.10.2026, nachmittags
const ago = (days) => {
  const d = new Date(2026, 9, 1 - days);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

test("Ampel: Grenzen bei 28 und 42 Tagen", () => {
  const status = (days) => subjectStatus(ago(days), NOW).status;
  assert.equal(status(0), "green");
  assert.equal(status(27), "green");
  assert.equal(status(28), "orange");
  assert.equal(status(41), "orange");
  assert.equal(status(42), "red");
  assert.equal(status(-3), "green"); // Datum in der Zukunft
});

test("Ampel: noch nie getestet ist rot", () => {
  assert.deepEqual(subjectStatus(null, NOW), { status: "red", days: null });
});

test("Kalendertage zählen über Monatsgrenzen", () => {
  assert.equal(daysSince("2026-08-31", NOW), 31);
});

test("Sortierung: rot vor orange vor grün, längster Abstand zuerst", () => {
  const kids = [
    { id: "a", name: "Anna", focus: null },
    { id: "b", name: "Bert", focus: null },
    { id: "c", name: "Cem", focus: null },
    { id: "d", name: "Dora", focus: "math" },
    { id: "e", name: "Eva", focus: null },
  ];
  const last = {
    a: { math: ago(2), german: ago(3) },
    b: { math: ago(30), german: ago(1) },
    c: { math: ago(50), german: ago(60) },
    d: { math: ago(5), german: ago(100) }, // Deutsch zählt nicht: Förderschwerpunkt Mathe
    e: { math: null, german: ago(1) },
  };
  const names = sortByUrgency(kids, {}, last, NOW).map((k) => k.name);
  assert.deepEqual(names, ["Eva", "Cem", "Bert", "Dora", "Anna"]);
});

test("Nicht ausgewählte Tests zählen nicht für die Sortierung", () => {
  const kid = { id: "x", name: "Xaver", focus: null };
  const last = { x: { math: ago(1), german: ago(90) } };
  const onlyMath = { x: { tests: ["math"], archived: false } };
  const [first] = sortByUrgency([kid], onlyMath, last, NOW);
  assert.equal(first.id, "x");
  assert.deepEqual(activeTests(kid, onlyMath.x), ["math"]);
});

test("Gesamtstatus: nur ausgewählte Tests zählen, schlechtester gewinnt", () => {
  const kid = { id: "y", name: "Yara", focus: null };
  const last = { y: { math: ago(30), german: ago(1) } };
  assert.equal(overallStatus(kid, undefined, last, NOW), "orange"); // beide Tests aktiv
  assert.equal(overallStatus(kid, { tests: ["german"] }, last, NOW), "green");
  assert.equal(overallStatus(kid, { tests: ["math"] }, last, NOW), "orange");
});
