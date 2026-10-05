/* Tests für Suche und Filter: npm test */
import test from "node:test";
import assert from "node:assert/strict";
import { filterStudents, matchesQuery, statusCounts } from "../src/js/domain/view.js";

const NOW = new Date(2026, 9, 1, 15, 0);
const ago = (days) => {
  const d = new Date(2026, 9, 1 - days);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const kids = [
  { id: "a", name: "Umut Çelik", focus: null },
  { id: "b", name: "Lena Fischer", focus: null },
  { id: "c", name: "Omar Haddad", focus: null },
];
const last = {
  a: { math: ago(50), german: ago(50) }, // rot
  b: { math: ago(30), german: ago(1) }, // orange
  c: { math: ago(2), german: ago(3) }, // grün
};

test("Suche ignoriert Groß-/Kleinschreibung und Akzente", () => {
  assert.equal(matchesQuery(kids[0], "celik"), true);
  assert.equal(matchesQuery(kids[0], "ÇELI"), true);
  assert.equal(matchesQuery(kids[1], "  fisch "), true);
  assert.equal(matchesQuery(kids[1], "xyz"), false);
  assert.equal(matchesQuery(kids[1], ""), true);
});

test("Zähler je Ampelfarbe", () => {
  assert.deepEqual(statusCounts(kids, {}, last, NOW), { all: 3, red: 1, orange: 1, green: 1 });
});

test("Filter nach Ampel und Suche kombinierbar", () => {
  const ids = (f) => filterStudents(kids, f, {}, last, NOW).map((k) => k.id);
  assert.deepEqual(ids({ query: "", status: "all" }), ["a", "b", "c"]);
  assert.deepEqual(ids({ query: "", status: "red" }), ["a"]);
  assert.deepEqual(ids({ query: "a", status: "green" }), ["c"]);
  assert.deepEqual(ids({ query: "lena", status: "red" }), []);
});

test("Filter berücksichtigt die ausgewählten Tests", () => {
  // Lena: Mathe orange, Deutsch grün. Nur Deutsch ausgewählt -> grün.
  const states = { b: { tests: ["german"], archived: false } };
  const ids = filterStudents(kids, { query: "", status: "green" }, states, last, NOW).map(
    (k) => k.id,
  );
  assert.deepEqual(ids, ["b", "c"]);
});
