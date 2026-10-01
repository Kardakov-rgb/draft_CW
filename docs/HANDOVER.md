# Übergabe an den IT-Dienstleister

Dieses Dokument wird mit dem Projekt weiterentwickelt. Offene Punkte sind mit `TODO` markiert.

## Zu klären (vom Auftraggeber)

- [ ] Zielsystem / CMS / Framework, in das übernommen wird (TODO)
- [ ] Unterstützte Browser (TODO)
- [ ] Barrierefreiheits-Anforderung, z. B. WCAG 2.1 AA (TODO)
- [ ] Vorgaben zu Corporate Design, Schriften, Lizenzen (TODO)
- [ ] Hosting- und Datenschutzvorgaben (externe Ressourcen, Cookies, Tracking) (TODO)

## Zusagen dieser Codebasis

- Kein Build-Schritt nötig, keine Laufzeit-Abhängigkeiten.
- Design-Werte zentral in `src/css/tokens.css` und damit leicht auf das Zielsystem abbildbar.
- Komponenten sind getrennt (CSS-Abschnitt + JS-Modul) und einzeln portierbar.

## Übergabe-Checkliste

- [ ] README aktuell, Schnellstart funktioniert auf frischem Klon
- [ ] Alle Entscheidungen oben beantwortet
- [ ] Keine Zugangsdaten oder personenbezogene Daten im Repo
- [ ] Drittinhalte (Bilder, Schriften) mit Lizenz dokumentiert
- [ ] Browser-Test und Barrierefreiheits-Check durchgeführt
