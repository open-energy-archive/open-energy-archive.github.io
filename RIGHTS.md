# Rechte und Urheberrecht

Das Archiv soll rechtlich sauber sein. Jeder Eintrag hat deshalb das Feld `rights`, und die Validierung erzwingt die folgenden Regeln.

## Grundsatz: Link immer, Kopie nur wenn erlaubt

| `rights.status` | Bedeutung | Datei spiegeln? |
|---|---|---|
| `official_work` | Amtliches Werk, gesetzlich vom Urheberrecht ausgenommen | ja |
| `open_license` | Offene Lizenz (z. B. CC BY) – SPDX-Kennung in `rights.license` | ja, unter Einhaltung der Lizenz |
| `permission` | Schriftliche Freigabe des Rechteinhabers – dokumentiert in `docs/permissions/` | ja |
| `unclear` | Frei abrufbar, aber Weiterverbreitung nicht geregelt | **nein**, nur Link |
| `copyrighted` | Urheberrechtlich geschützt | **nein**, nur Link |

Frei abrufbar heisst nicht frei weiterverbreitbar. Im Zweifel `unclear` wählen.

## Amtliche Werke

- **Schweiz – Art. 5 URG:** Gesetze, Verordnungen, völkerrechtliche Verträge und andere amtliche Erlasse (lit. a) sowie Entscheidungen, Protokolle und Berichte von Behörden und öffentlichen Verwaltungen (lit. c) sind nicht geschützt.
- **Deutschland – § 5 UrhG:** Gesetze, Verordnungen, amtliche Erlasse und Bekanntmachungen sowie Entscheidungen und amtlich verfasste Leitsätze sind gemeinfrei. **Achtung:** Private Normwerke (z. B. DIN) bleiben nach § 5 Abs. 3 UrhG geschützt, auch wenn Gesetze auf sie verweisen.
- **Österreich – § 7 UrhG:** Gesetze, Verordnungen, amtliche Erlässe, Bekanntmachungen und Entscheidungen sowie vorwiegend zum amtlichen Gebrauch hergestellte amtliche Werke sind frei.
- **EU:** Dokumente der Europäischen Kommission und EUR-Lex-Inhalte dürfen grundsätzlich weiterverwendet werden (Beschluss 2011/833/EU). Quelle angeben.

Bei Studien, die eine Behörde bei Dritten in Auftrag gegeben hat, ist der Status oft nicht eindeutig → `unclear`, bis die Nutzungsbedingungen geprüft sind.

## Was nie gespiegelt wird

- **Technische Normen** (DIN, VDE, IEC, EN, SN/Electrosuisse): nur Metadaten und Link zum Normenverlag.
- **Branchendokumente** von Verbänden (z. B. VSE, BDEW), sofern keine offene Lizenz oder Freigabe vorliegt.
- **Verträge Dritter** ohne ausdrückliche Freigabe. Muster, die das Projekt selbst erarbeitet, erscheinen unter CC BY 4.0.
- **Fachartikel** von Verlagen, ausser bei Open-Access-Lizenz.

## Personendaten

Gerichtsentscheide nur in der von der Behörde veröffentlichten (anonymisierten) Fassung aufnehmen. Veröffentlichte Verträge vor der Aufnahme von Personendaten, Preisen und Geschäftsgeheimnissen bereinigen – nur mit Freigabe.

## Entfernung auf Anfrage

Rechteinhaber können die Entfernung einer Datei oder eines Eintrags verlangen: Issue mit Vorlage «Rechte / Entfernung» oder E-Mail an die Maintainer. Gespiegelte Dateien werden bei begründeter Anfrage sofort entfernt und erst nach Klärung wieder aufgenommen.
