/* DEMO-DATEN (frei erfundene Namen). Im echten System kommt die Liste aus der Lernplattform bzw.
   der Datenbank. Ersatzpunkt: getStudents() durch einen API-Aufruf ersetzen, Rückgabeformat beibehalten.
   focus = Förderschwerpunkt aus der Datenbank (Schlüssel aus FOCUS in config.js) oder null. */
const DEMO_STUDENTS = [
  ["Aylin Demir", "math"],
  ["Ben Schneider", "german"],
  ["Clara Wolf", "both"],
  ["Deniz Yildiz", null],
  ["Emil Hartmann", "math"],
  ["Fatima Khalil", "german"],
  ["Greta Lange", "both"],
  ["Hannes Roth", "math"],
  ["Ida Kowalski", null],
  ["Jonas Berger", "german"],
  ["Kerem Aydin", "both"],
  ["Lena Fischer", "math"],
  ["Mats Becker", "german"],
  ["Nora Schulz", "both"],
  ["Omar Haddad", null],
  ["Paula Neumann", "math"],
  ["Quentin Vogel", "german"],
  ["Rana Ahmadi", "both"],
  ["Samuel Keller", "math"],
  ["Tamara Jovanović", "german"],
  ["Umut Çelik", "both"],
  ["Vera Hoffmann", null],
  ["Wanja Peters", "math"],
  ["Yusuf Kaya", "german"],
  ["Zoe Brandt", "both"],
];

export const GROUP_NAME = "Demo-Gruppe Klasse 5";

/** @returns {Promise<{id: string, name: string, focus: string|null}[]>} */
export async function getStudents() {
  return DEMO_STUDENTS.map(([name, focus], i) => ({ id: `demo-${i + 1}`, name, focus }));
}
