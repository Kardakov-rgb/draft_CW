/* DEMO-DATEN (frei erfundene Namen). Im echten System kommen KPFs und Kinder aus der Datenbank.
   ERSATZPUNKTE: getKpfs() und getStudents(kpfId) durch API-Aufrufe ersetzen, Rückgabeformat beibehalten.
   Eine KPF fasst eine Klasse zusammen. focus = Förderschwerpunkt aus der Datenbank
   (Schlüssel aus FOCUS in config.js) oder null. */
const FOCUS_CYCLE = ["math", "german", "both", null];

const DEMO_KPFS = [
  {
    id: "kpf-1",
    name: "KPF Demo 1 (Klasse 5a)",
    idPrefix: "demo-", // bleibt wie in früheren Demo-Ständen
    names: [
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
    ],
  },
  {
    id: "kpf-2",
    name: "KPF Demo 2 (Klasse 5b)",
    idPrefix: "demo2-",
    names: [
      "Amelie Sommer",
      "Bilal Öztürk",
      "Charlotte Engel",
      "Dario Marino",
      "Elif Arslan",
      "Felix Brandt",
      "Gül Şahin",
      "Henri Dubois",
      "Ines Koch",
      "Jakob Weiß",
      "Kira Petrov",
      "Leon Vasić",
      "Mira Haas",
      "Nico Thiel",
      "Olivia Stein",
      "Piotr Nowak",
      "Sina Albrecht",
      "Theo Lindner",
    ],
  },
  {
    id: "kpf-3",
    name: "KPF Demo 3 (Klasse 6a)",
    idPrefix: "demo3-",
    names: [
      "Alina Beck",
      "Bruno Costa",
      "Cem Yavuz",
      "Dilara Polat",
      "Eric Jansen",
      "Franka Otto",
      "Gabriel Santos",
      "Hanna Lorenz",
      "Ilyas Benali",
      "Josefine Kraus",
      "Kaan Erdem",
      "Lara Möller",
      "Moritz Sauer",
      "Nele Franke",
      "Oskar Winter",
      "Pia Schubert",
      "Ramon Diaz",
      "Selin Korkmaz",
      "Tim Albers",
      "Ulla Reimann",
    ],
  },
];

/** @returns {Promise<{id: string, name: string}[]>} */
export async function getKpfs() {
  return DEMO_KPFS.map(({ id, name }) => ({ id, name }));
}

/** @returns {Promise<{id: string, name: string, focus: string|null}[]>} Kinder einer KPF */
export async function getStudents(kpfId) {
  const kpf = DEMO_KPFS.find((entry) => entry.id === kpfId);
  return (kpf?.names ?? []).map((name, i) => ({
    id: `${kpf.idPrefix}${i + 1}`,
    name,
    focus: FOCUS_CYCLE[(i * 7 + kpf.names.length) % FOCUS_CYCLE.length],
  }));
}
