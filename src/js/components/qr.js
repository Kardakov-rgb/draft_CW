/* QR-Code als Inline-SVG (Bibliothek uqr, selbst gehostet). */
import { encode } from "../vendor/uqr.mjs";

const SVG_NS = "http://www.w3.org/2000/svg";

/** @returns {SVGElement} schwarz auf weiß, mit Ruhezone, skaliert auf die Breite des Containers */
export function renderQr(text, className) {
  const { data, size } = encode(text, { ecc: "M", border: 4 });
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.setAttribute("shape-rendering", "crispEdges");
  svg.setAttribute("role", "img");
  svg.setAttribute("class", className);

  const background = document.createElementNS(SVG_NS, "rect");
  background.setAttribute("width", size);
  background.setAttribute("height", size);
  background.setAttribute("fill", "#fff");
  svg.append(background);

  let path = "";
  data.forEach((row, y) =>
    row.forEach((dark, x) => {
      if (dark) path += `M${x} ${y}h1v1h-1z`;
    }),
  );
  const modules = document.createElementNS(SVG_NS, "path");
  modules.setAttribute("d", path);
  modules.setAttribute("fill", "#000");
  svg.append(modules);
  return svg;
}
