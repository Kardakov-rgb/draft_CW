/* Eigene Symbole als Inline-SVG (24x24, Linien in currentColor, folgen also der Textfarbe).
   Neues Symbol = neuer Eintrag in ICONS. Die Symbole sind dekorativ (aria-hidden),
   der Name steht am umgebenden Button (aria-label). */
const ICONS = {
  /* QR-Code: drei Suchmuster plus ein paar Datenpunkte */
  qr: `<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
       <rect x="3" y="14" width="7" height="7" rx="1"/>
       <path d="M14 14h3v3h-3zM19 14h2M14 19h2M18 18h3v3h-3z"/>`,
  /* Play: gefülltes Dreieck */
  play: `<path d="M8 5.5v13l11-6.5z" fill="currentColor"/>`,
  /* Auswahl: Liste mit Häkchen */
  select: `<path d="M3 6l1.5 1.5L7.5 4.5M3 12l1.5 1.5L7.5 10.5M3 18l1.5 1.5L7.5 16.5M11 6h10M11 12h10M11 18h10"/>`,
  /* Archiv: Ablagebox */
  archive: `<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 12h4"/>`,
  /* Ergebnisse: Balkendiagramm */
  results: `<rect x="3" y="12" width="4.5" height="8" rx="1"/><rect x="9.75" y="4" width="4.5" height="16" rx="1"/><rect x="16.5" y="9" width="4.5" height="11" rx="1"/>`,
  /* Wiederherstellen: Pfeil gegen den Uhrzeigersinn */
  restore: `<path d="M3 4v6h6"/><path d="M3.5 14a9 9 0 1 0 2.1-8.9L3 10"/>`,
};

/** @returns {SVGElement} */
export function createIcon(name) {
  const template = document.createElement("template");
  template.innerHTML = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
    focusable="false">${ICONS[name]}</svg>`;
  return template.content.firstElementChild;
}
