/* Nur Demo: Platzhalterseiten für Teacher-Dashboard und Ergebnisse. Zeigt die übergebene ID. */
const params = new URLSearchParams(window.location.search);
document.querySelector("[data-student]").textContent = params.get("student") ?? "–";
