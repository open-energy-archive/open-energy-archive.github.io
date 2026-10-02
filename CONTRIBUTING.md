# Mitwirken

Danke, dass du hilfst! Es gibt drei Wege:

## 1. Dokument vorschlagen (ohne Git)

Öffne ein [Issue «Dokument vorschlagen»](../../issues/new?template=dokument-vorschlagen.yml) mit Link und kurzer Begründung. Die Maintainer erfassen die Metadaten.

## 2. Eintrag selbst erfassen

1. Repository forken und einen Branch anlegen, z. B. `add/ch-elcom-weisung-1-2026`
2. Eine neue Datei anlegen: `data/documents/<rechtsraum>/<typ>/<id>.yaml` (Vorlage: [templates/document.yaml](templates/document.yaml))
3. `npm install && npm run validate`
4. Pull Request öffnen – die Checkliste im PR ausfüllen

### Regeln für gute Einträge

- **ID:** `<rechtsraum>-<kurzbezeichnung>`, nur Kleinbuchstaben, Ziffern, Bindestriche. Beispiele: `ch-sr-734-7-stromvg`, `ch-bger-2c-609-2024`, `de-bgh-en-vr-12-23`. Muss dem Dateinamen entsprechen.
- **Titel:** Originaltitel in der Originalsprache.
- **Datum:** Erlass-, Entscheid- oder Publikationsdatum, Format `JJJJ-MM-TT`. Ist nur der Monat bekannt, `date_precision: month`.
- **Quelle:** immer die amtliche oder ursprüngliche Quelle (`https://…`). Kopien auf Drittseiten nur, wenn es keine andere gibt – dann in `status_note` erwähnen.
- **Zusammenfassung:** 1–3 Sätze, neutral, in eigenen Worten. Nicht aus dem Dokument abschreiben, keine Wertungen.
- **Englisch:** `title_en`, `summary_en` und gegebenenfalls `status_note_en` ergänzen, damit der Eintrag auf der englischen Website vollständig erscheint.
- **Rechte:** Siehe [RIGHTS.md](RIGHTS.md). Im Zweifel `unclear` und `mirror_allowed: false`.
- **Status aktuell halten:** `last_checked` auf das Datum setzen, an dem du Quelle und Stand geprüft hast.
- **Schweizer Einträge** in Schweizer Rechtschreibung (ss statt ß).

## 3. Als Fach-Reviewer mitwirken

Du kennst dich im Energierecht aus? Wir suchen Fachpersonen, zuerst für die Schweiz, die Musterverträge und Zusammenfassungen prüfen. Melde dich über ein Issue. Geprüfte Inhalte erhalten im Eintrag `reviewed_by` und `reviewed_on`.

## 4. Fehler melden

Auf jeder Dokumentseite gibt es den Link «Fehler melden». Oder direkt ein [Issue](../../issues/new?template=fehler-melden.yml) öffnen.

## Neue Themen oder Dokumenttypen

Änderungen an `taxonomy/taxonomy.yaml` bitte zuerst als Issue diskutieren (siehe [GOVERNANCE.md](GOVERNANCE.md)).

## Verhaltenskodex

Es gilt der [Verhaltenskodex](CODE_OF_CONDUCT.md).
