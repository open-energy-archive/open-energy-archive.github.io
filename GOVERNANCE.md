# Governance

## 1. Mission und Neutralität

Das Archiv hat eine klare **Mission**: den Ausbau erneuerbarer Energie beschleunigen, indem die Grundlagen – Recht, Rechtsprechung, Praxis, Verträge – frei zugänglich werden.

Die **Kuratierung ist sachlich**: Das Archiv sammelt Dokumente, keine Meinungen. Aufnahme richtet sich nach Relevanz und Qualität, nicht danach, ob ein Dokument eine bestimmte Position stützt. Zusammenfassungen beschreiben den Inhalt neutral und in eigenen Worten.

## 2. Aufnahmekriterien

Ein Dokument wird aufgenommen, wenn es

1. **relevant** ist für Erzeugung, Netz, Speicherung, Handel, Nutzung oder Förderung von Elektrizität und Energie;
2. **öffentlich zugänglich** ist oder vom Rechteinhaber freigegeben wurde;
3. eine **überprüfbare Quelle** hat (Primärquelle bevorzugt: Fedlex, Gerichte, Regulatoren, Ministerien);
4. **vollständig beschrieben** ist (Pflichtfelder gemäss Schema, korrekter Rechtestatus).

Nicht aufgenommen werden Werbung, Dokumente ohne nachvollziehbare Herkunft und Inhalte, deren Verbreitung Rechte Dritter verletzt. Stellungnahmen und Positionspapiere von Verbänden oder Parteien können in einer eigenen, klar gekennzeichneten Kategorie aufgenommen werden, wenn sie für das Verständnis eines Rechtsetzungsverfahrens wichtig sind – dann möglichst ausgewogen (alle wesentlichen Seiten).

## 3. Rollen

- **Maintainer:** Bernhard Weber (Gründer). Merge, Revert, Releases, Taxonomie.
- **Fach-Reviewer:** Personen mit Fachwissen für einen Rechtsraum oder ein Thema. Werden von den Maintainern ernannt.
- **Contributors:** alle, die Dokumente vorschlagen oder Metadaten korrigieren.

Interessenbindungen (z. B. Tätigkeit für einen Energieversorger, eine Kanzlei oder einen Verband) legen Maintainer und Reviewer in `docs/interessenbindungen.md` offen.

## 4. Ablauf von Änderungen

1. Vorschlag per Issue oder Pull Request
2. Automatische Prüfung (Schema, Taxonomie, Rechte, Links)
3. Review durch mindestens eine Maintainerin oder einen Reviewer – bei neuen Kategorien oder Taxonomie-Werten 7 Tage öffentliche Kommentarfrist
4. Merge oder begründete Ablehnung

## 5. Beständigkeit

- IDs sind stabil und werden nie wiederverwendet. Links auf `/d/<id>/` bleiben gültig.
- Aufgehobene oder ersetzte Dokumente werden nicht gelöscht, sondern mit `status: repealed` / `superseded` und `supersedes` gekennzeichnet.
- Ausnahme: Entfernung aus rechtlichen Gründen (siehe [RIGHTS.md](RIGHTS.md)).

## 6. Versionierung

Releases folgen [Semantic Versioning](https://semver.org/lang/de/): Major = Strukturänderungen am Schema, Minor = neue Dokumente oder Kategorien, Patch = Korrekturen.

## 7. Finanzierung

Das Projekt ist nicht gewinnorientiert. Spenden oder Förderungen werden offengelegt und dürfen keinen Einfluss auf die Aufnahme einzelner Dokumente haben.
