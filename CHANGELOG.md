# Changelog

Format nach [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), Versionen nach [SemVer](https://semver.org/lang/de/).

## [0.3.0] – 2026-10-02

### Neu
- 12 Entscheide des Bundesgerichts: BGE 141 II 141 (Arealnetze), 142 I 99 (Wasserkraftkonzessionen Uri), 143 I 395 (Messwesen bei Produktionsanlagen), 147 II 164 (Grimsel), 147 II 319 (Windpark Sainte-Croix), 148 II 36 (Windpark Grenchenberg), 148 III 172 (Ausgleichsenergie Swissgrid), 149 II 187 (Durchschnittspreismethode), 150 II 334 (Einspeisevergütung Hybridanlagen), 151 II 136 (Sanierung Wasserkraft), 151 II 687 (Basisjahrprinzip), 2C_632/2016 (grenzüberschreitende Kapazitäten)
- 12 Entscheide des Bundesverwaltungsgerichts: A-438/2009 (Leitung Amsteg–Mettlen), A-212/2011 (Abgrenzung Übertragungsnetz), A-2857/2013 (Verzinsung Deckungsdifferenzen), BVGE 2015/38 (Zuständigkeit Netzanschlusskosten), A-257/2015 (Netzzugang Tunnelbaustelle), A-5561/2016 (KEV integrierte PV), A-7036/2018 (KEV-Warteliste), A-348/2019 (Einmalvergütung), A-5705/2018 (Leitung Samstagern–Zürich), A-2372/2021 und A-484/2024 (Smart Meter), A-5380/2022 (ewb-Tarife)

### Geändert
- BGer 2C_609/2024: als BGE 152 II 364 ergänzt, Vorinstanz verknüpft
- Funktionierende Link-Form für nicht publizierte Bundesgerichtsurteile (2C_609/2024, 2C_367/2012)
- ElCom 212-00282: Rechtsmittelweg bis BGE 151 II 687 ergänzt

## [0.2.0] – 2026-09-29

### Neu
- Erster eigener Mustervertrag (CC BY 4.0): Lokale Elektrizitätsgemeinschaft (LEG) als Verein – Statuten, Reglement Energie und Abrechnung, Beitrittserklärung (Markdown und Word)
- Archiv-Eintrag AS 2025 139 (StromVV-Änderung mit den LEG-Bestimmungen)
- Eigene Inhalte werden auf der Website als Volltext angezeigt und durchsucht (`content`, `downloads` im Schema)
- `npm run docx` erzeugt Word-Vorlagen aus den Markdown-Mustern

## [0.1.0] – 2026-09-25

### Neu
- Repository-Struktur, Metadaten-Schema und Taxonomie
- Validierung (Schema, Vokabular, Rechteregeln, Verweise) und Linkprüfung
- Statische Website mit Volltextsuche (Pagefind), Filterliste, Dokumentseiten, JSON/CSV-Export
- GitHub Actions für Prüfung und Veröffentlichung auf GitHub Pages
- 16 Schweizer Startdokumente: StromVG, StromVV, EnG, EnV, EnFV, Mantelerlass, ElCom-Weisungen 5/2025 und 7/2025, ElCom-Verfügung 212-00282, BGer 2C_609/2024, BGE 144 III 111, BGer 2C_367/2012, BFE-Leitfaden Eigenverbrauch, Energieperspektiven 2050+, VSE-Branchenempfehlung LEG, VSE-Handbuch Eigenverbrauchsregelung
