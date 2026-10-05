/* Erzeugt individuelle Test-Links.
   ERSATZPUNKT FÜR DIE LERNPLATTFORM: In der Demo wird der Token lokal erzeugt und ist wertlos.
   Im echten System muss diese Funktion die Schnittstelle der Lernplattform aufrufen, die pro
   Aufruf einen neuen, kurzlebigen, einmal nutzbaren Token ausstellt und die URL zurückgibt.
   Signatur und Rückgabeformat beibehalten, dann bleibt die Oberfläche unverändert. */
import { LINK_VALIDITY_MINUTES } from "../config.js";

/**
 * @param {{studentId: string, subject: string, purpose?: "single"|"sheet"}} request
 *   purpose "single" (Standard): kurzlebiger Link für den Bildschirm.
 *   purpose "sheet": länger gültiger Link für das gedruckte Sammelblatt.
 * @returns {Promise<{url: string, expiresAt: Date}>}
 */
export async function createTestLink({ studentId, subject, purpose = "single" }) {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const token = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

  const url = new URL("test-start.html", window.location.href);
  url.searchParams.set("subject", subject);
  url.searchParams.set("student", studentId);
  url.searchParams.set("token", token);

  return {
    url: url.toString(),
    expiresAt: new Date(Date.now() + LINK_VALIDITY_MINUTES[purpose] * 60000),
  };
}
