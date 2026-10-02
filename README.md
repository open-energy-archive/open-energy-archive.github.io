# Open Energy Archive

**Offenes, durchsuchbares Archiv für Dokumente zu Elektrizität und Energie.**
Gesetze, Verordnungen, Gerichts- und Behördenentscheide, Leitfäden, Studien und Verträge – gesammelt, verschlagwortet und an einem Ort auffindbar. Ziel ist es, den Ausbau erneuerbarer Energie zu beschleunigen, indem die rechtlichen und praktischen Grundlagen für alle leicht zugänglich werden.

> ⚠️ **Keine Rechtsberatung.** Das Archiv verweist auf öffentlich zugängliche Dokumente. Massgebend ist immer die verlinkte amtliche Quelle.

## Stand

| Phase | Raum | Status |
|---|---|---|
| 1 | Schweiz | 🟢 im Aufbau (90 Einträge, davon 25 kantonale Gesetze und 1 eigener Mustervertrag) |
| 2 | Deutschland, Österreich, Liechtenstein | 🟡 begonnen (Deutschland: 21 Einträge – 8 Bundesgesetze, 4 Verordnungen, 3 Landesgesetze BW/BY/BE, BGH, BVerfG, 2 × Bundesnetzagentur, EEG-Novelle 2027 und Netzpaket als Entwurf) |
| 3 | EU und englischsprachiger Raum | ⚪ geplant |
| 4 | Weltweit | ⚪ geplant |

Details: [docs/roadmap.md](docs/roadmap.md)

## So funktioniert das Archiv

Jedes Dokument ist eine kleine **YAML-Datei** mit Metadaten (Titel, Herausgeber, Datum, Status, Themen, Zusammenfassung, Link zur Originalquelle, Rechtestatus). Daraus erzeugt ein Build-Skript eine **zweisprachige statische Website (Deutsch und Englisch) mit Volltextsuche** ([Pagefind](https://pagefind.app)), die kostenlos auf GitHub Pages läuft.

**Hybrid-Prinzip:** Das Archiv speichert immer die Metadaten und den Link. Eine Kopie der Datei selbst wird nur abgelegt, wenn das rechtlich eindeutig erlaubt ist (amtliche Werke, offene Lizenzen, schriftliche Freigabe). Siehe [RIGHTS.md](RIGHTS.md).

```
data/documents/<rechtsraum>/<typ>/<id>.yaml   ← ein Dokument = eine Datei
files/                                        ← gespiegelte Dateien (nur wenn erlaubt)
taxonomy/taxonomy.yaml                        ← Typen, Themen, Status, Rechte
schema/document.schema.json                   ← Pflichtfelder und Formate
scripts/                                      ← Validierung, Website-Build, Linkprüfung
site/assets/                                  ← CSS und JavaScript der Website
```

Ein Beispiel-Eintrag: [data/documents/ch/law/ch-sr-734-7-stromvg.yaml](data/documents/ch/law/ch-sr-734-7-stromvg.yaml)

## Lokal starten

Voraussetzung: Node.js 20 oder neuer.

```bash
npm install
npm run validate     # Metadaten prüfen
npm run build        # Website in dist/ erzeugen und Suchindex bauen
npm run serve        # http://localhost:8080
npm run check-links  # Prüft, ob alle Quell-Links noch erreichbar sind
```

## Wer steht dahinter

Eine Initiative von Bernhard Weber, Zürich – [bwlaw.ch](https://www.bwlaw.ch/).

## Mitwirken

Dokument vorschlagen, ohne Git zu kennen: [Issue «Dokument vorschlagen»](../../issues/new?template=dokument-vorschlagen.yml).
Direkt beitragen: siehe [CONTRIBUTING.md](CONTRIBUTING.md). Regeln für Aufnahme und Neutralität: [GOVERNANCE.md](GOVERNANCE.md).

## Offene Daten

Alle Metadaten stehen als `data/documents.json` und `data/documents.csv` auf der Website zum Download bereit.

## Lizenzen

- **Metadaten** (YAML-Dateien, JSON/CSV-Exporte): [CC0 1.0](LICENSE-DATA.md) – frei nutzbar ohne Bedingungen
- **Eigene redaktionelle Inhalte** (z. B. selbst verfasste Musterverträge, Leitfäden): [CC BY 4.0](LICENSE-DATA.md)
- **Code**: [MIT](LICENSE)
- **Archivierte Dokumente Dritter** behalten ihren eigenen Rechtsstatus (in jedem Eintrag unter `rights` vermerkt)
