/* DEMO-DATEN (frei erfundene Namen). Im echten System kommt die Liste aus der Lernplattform.
   Ersatzpunkt: getStudents() durch einen API-Aufruf ersetzen, Rückgabeformat beibehalten. */
const DEMO_NAMES = [
  "Aylin Demir",
  "Ben Schneider",
  "Clara Wolf",
  "Deniz Yildiz",
  "Emil Hartmann",
  "Fatima Khalil",
  "Greta Lange",
  "Hannes Roth",
  "Ida Kowalski",
  "Jonas Berger",
  "Kerem Aydin",
  "Lena Fischer",
  "Mats Becker",
  "Nora Schulz",
  "Omar Haddad",
  "Paula Neumann",
  "Quentin Vogel",
  "Rana Ahmadi",
  "Samuel Keller",
  "Tamara Jovanović",
  "Umut Çelik",
  "Vera Hoffmann",
  "Wanja Peters",
  "Yusuf Kaya",
  "Zoe Brandt",
];

export const GROUP_NAME = "Demo-Gruppe Klasse 5";

export async function getStudents() {
  return DEMO_NAMES.map((name, i) => ({ id: `demo-${i + 1}`, name }));
}
