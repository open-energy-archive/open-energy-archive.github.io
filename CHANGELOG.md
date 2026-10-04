# Changelog

Format nach [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), Versionen nach [SemVer](https://semver.org/lang/de/).

## [0.23.0] – 2026-10-04

### Neu
- Schweiz, jetzt 135 Einträge – neun amtlich publizierte Leitentscheide des Bundesgerichts: BGE 149 I 49 (Ersatzpflicht für Elektroheizungen, Zürich), BGE 150 I 106 (Sanierung von Elektroheizungen, Waadt), BGE 152 II 461 (Windpark Montagne-de-Buttes, Anlagentyp und Rechtsweg nach Art. 71c EnG), BGE 151 II 312 (Rückerstattung des Netzzuschlags), BGE 149 II 86 (Windpark Eoljoux, Richtplan), BGE 140 II 262 (Wasserkraftwerk Obergoms), BGE 138 I 468 (keine kommunale Tarifgenehmigung), BGE 138 I 454 (abschliessende Bundesregelung der Einspeisevergütung), BGE 137 II 266 (Teilverkabelung Beznau–Birr)

## [0.22.0] – 2026-10-04

### Neu
- Mustervertrag «Zusammenschluss zum Eigenverbrauch (ZEV) in Mietverhältnissen», Entwurf 0.9 zur Diskussion (nicht fachlich geprüft): Zusatz zum Mietvertrag, Abrechnungsgrundsätze mit Pauschale von höchstens 80 % und Berechnungsbeispiel, Unterlagen zur Einführung in bestehenden Mietverhältnissen, Stammdatenblatt, offene Fragen für Rückmeldungen; Word-Vorlage

## [0.21.0] – 2026-10-04

### Neu
- EU-Recht (9 Rechtsakte, Typ «EU-Rechtsakt», Links auf EUR-Lex): Elektrizitätsbinnenmarktrichtlinie (EU) 2019/944 und -verordnung (EU) 2019/943, Erneuerbare-Energien-Richtlinie (EU) 2018/2001 und RED III (EU) 2023/2413, Strommarktdesign-Reform (RL (EU) 2024/1711, VO (EU) 2024/1747), REMIT (VO (EU) Nr. 1227/2011), Energieeffizienzrichtlinie (EU) 2023/1791, Gebäuderichtlinie (EU) 2024/1275
- Verknüpfungen: EuGH C-293/23 mit RL 2019/944, EABG mit RED III, GModG mit EPBD

## [0.20.0] – 2026-10-04

### Neu
- Schweiz, jetzt 125 Einträge – sechs Urteile des Verwaltungsgerichts Zürich: VB.2025.00423 (Klimastrategie Männedorf, Abstimmungsinformation), VB.2024.00320 (Wärmepumpe auf dem Dach, § 238 Abs. 4 PBG), VB.2020.00136 (kommunale Energieplanung nicht anfechtbar), VB.2012.00665 (Freibad-Wärmepumpe, keine Vorwirkung des Energiegesetzes), VB.2007.00307 (Blendung durch PV-Anlage), VB.2001.00138 (Fernwärmegebühren nach Anschlusspflicht)

### Geändert
- BVD 110/2025/26 (Morgeten): Entscheiddatum 8. Oktober 2025, Urteil des Verwaltungsgerichts Bern 100.2024.156 ergänzt

## [0.19.0] – 2026-10-03

### Neu
- Schweiz, jetzt 119 Einträge: BGE 142 II 451 (individuelle Tarifprüfung im Streitfall, Parteistellung der Endverbraucher); erste kantonale Entscheide: Verwaltungsgericht Zürich VB.2024.00110 (Solaranlage auf ISOS-Objekt, Vorinstanz zu 1C_153/2025) und Bau- und Verkehrsdirektion Bern BVD 110/2025/26 (alpine Solaranlage Morgeten, angefochten)

## [0.18.0] – 2026-10-03

### Neu
- Schweiz, jetzt 116 Einträge: BVGer A-321/2017 und BGer 2C_297/2019 (Energie Wasser Bern, Tarife 2009/2010) – damit ist die Verfahrenskette bis 2C_609/2024 vollständig verknüpft; ElCom-Hauptverfügung 212-00409 vom 15.8.2025 (Serge Ferrari Tersuisse gegen CKW, Energietarife 2023 und 2024)

### Geändert
- ElCom 212-00409 (Zwischenverfügung 2023): Stand mit zweitem Massnahmengesuch, BVGer A-4335/2023 und Verweis auf den Hauptentscheid ergänzt

## [0.17.0] – 2026-10-03

### Neu
- Schweiz, jetzt 113 Einträge – Bundesgericht: 1C_153/2025 (Solaranlage auf ISOS-Objekt in der Bauzone ist Bundesaufgabe), 1C_179/2015 (Lungern-Obsee, wesentliche Beeinträchtigung nach Art. 18a Abs. 3 RPG), 1C_346/2014 (Windpark Schwyberg, Richtplanpflicht), 1C_48/2021 (Windpark Montagne-de-Buttes), 1C_329/2021 und 1C_335/2021 (Windpark Montagne de Tramelan)

## [0.16.2] – 2026-10-03

### Behoben
- Datumsfelder bei «Eigener Zeitraum» auf dem Handy: gleiche Höhe, Ausrichtung und Hintergrund wie die übrigen Felder (Systemdarstellung von iOS/Android neutralisiert); alle Filterfelder einheitlich hoch

## [0.16.1] – 2026-10-03

### Behoben
- «Filter zurücksetzen» und das Entfernen des Rechtsraum-Chips setzten das Land nicht zurück: Die Chip-Gruppen werden jetzt explizit auf «Alle» gestellt

## [0.16.0] – 2026-10-03

### Neu
- Zeitraum-Filter mit Schnellwahl («Letzte 30 Tage», «Letzte 12 Monate», laufendes und letztes Jahr, jeweils mit Trefferzahl) und «Eigener Zeitraum» mit genauer Datumsauswahl (von/bis); liegt «bis» vor «von», erscheint ein Hinweis. URL: `?period=12m`, `?period=y2025` oder `?period=custom&from=2025-01-01&to=2025-06-30`; ältere Links mit `?from=2025` funktionieren weiter
- Rechtsraum als antippbare Chips mit Trefferzahl
- Aktive Filter erscheinen als entfernbare Chips über der Liste
- Handy: Filterbereich einklappbar («Filter» mit Anzahl aktiver Filter, «Treffer zeigen»), Sortierung und Seitengrösse kompakt in einer Zeile

### Behoben
- Datumsfilter wirkte wirkungslos: Mit nur «von» und der Sortierung «Neueste zuerst» blieb die erste Seite unverändert; zudem konnte der Browser nach einem Update noch das alte Skript verwenden. Stil und Skript werden jetzt mit einem Versions-Hash geladen (Cache-Busting)

## [0.15.0] – 2026-10-03

### Neu
- Sortierauswahl in der Dokumentliste: «Neueste zuerst» (Standard), «Älteste zuerst», «Titel A–Z», «Titel Z–A»; bei gleichem Datum wird nach Titel sortiert. Die Sortierung steht in der URL (`?sort=old`) und lässt sich mit allen Filtern und der Seitenanzeige kombinieren

## [0.14.0] – 2026-10-03

### Neu
- Datumsfilter in der Dokumentliste: Zeitraum nach Jahr («von» – «bis»), kombinierbar mit allen anderen Filtern; angeboten werden nur Jahre, die mit den übrigen Filtern Treffer ergeben, und «bis» kann nicht vor «von» liegen. Der Zeitraum steht in der URL (`?from=2020&to=2025`)
- Filterbereich zweizeilig angeordnet

## [0.13.0] – 2026-10-03

### Neu
- Schweiz, jetzt 108 Einträge: Gebührenverordnung Energie (GebV-En), Kernenergieverordnung (KEV), Niederspannungserzeugnisverordnung (NEV), Schwachstromverordnung (SchwV); ElCom 236-01184 (IWB gegen Swissgrid, Verjährung Netzverstärkung) und 212-00409 (Tarife 2023, vorsorgliche Massnahmen abgewiesen); Energiegesetz des Kantons Uri vom 22.10.2023

### Geändert
- Uri: Eintrag zum Energiegesetz von 1999 korrigiert und als «Ersetzt» markiert; die bisherige Angabe, ab 1.10.2026 gelte eine Teilrevision des Gesetzes von 1999, war falsch – es tritt das totalrevidierte Gesetz von 2023 mit der Teilrevision vom 8.3.2026 in Kraft
- ElCom 236-01364 mit 236-01184 verknüpft

## [0.12.0] – 2026-10-03

### Neu
- Schweiz, jetzt 101 Einträge: ElCom-Verfügung 232-00093 (Verwendung der Auktionserlöse 2026), ElCom-Weisung 1/2024 (Aufsicht Cybersicherheit), neue Loi sur l'énergie des Kantons Waadt vom 3.2.2026 (in Kraft ab Januar 2027)
- Status «Beschlossen, noch nicht in Kraft» (`adopted`) für verabschiedete Erlasse vor dem Inkrafttreten

### Geändert
- Stand nachgeführt: EnG (Beschleunigungserlass seit 1.4.2026, Ausnahmen, Verordnungspaket in Vernehmlassung), VPeA (Revision in Kraft seit 1.1.2026), Thurgau (Teilrevision im Grossen Rat seit Juni 2026), Waadt (Verweis auf neues Gesetz)

## [0.11.0] – 2026-10-02

### Neu
- Kombinierbare Filter (Facetten): Jede Auswahlliste zeigt nur noch Werte, die zusammen mit den übrigen gesetzten Filtern und dem Suchtext Treffer ergeben, jeweils mit aktueller Anzahl; Werte ohne Treffer werden ausgeblendet, der gewählte Wert bleibt sichtbar
- Schweiz: Leitungsverordnung (LeV), Starkstromverordnung (StV), VPeA, Energieeffizienzverordnung (EnEV), Kernenergiegesetz (KEG), Solarexpress (AS 2022 543, Art. 71a EnG), ElCom-Verfügung 236-01364 (Verjährung von Netzverstärkungsvergütungen), Leitfaden Solarexpress des Kantons Graubünden

### Geändert
- «Über OEA» ist neu die Hauptseite (`/ueber/`, `/en/about/`) und erscheint so in der Navigation; «Über uns» ist die Unterseite (`/ueber/uns/`, `/en/about/us/`). Die bisherige Adresse `/ueber/oea/` leitet weiter
- BVGE 2015/38 (A-2850/2014) und BVGer A-348/2019: unzuverlässige weblaw-Links durch entscheidsuche.ch ersetzt

## [0.10.1] – 2026-10-02

### Geändert
- Startseite: Titel «Energiedokumente – frei zugänglich und an einem Ort» statt «offen» (EN: «freely accessible»)
- Roadmap um die MiSpeL-Festlegung ergänzt

## [0.10.0] – 2026-10-02

### Neu
- Bundesnetzagentur, Festlegung zur Marktintegration von Speichern und Ladepunkten (MiSpeL, Az. 618-25-02) vom 1.10.2026 mit Anlagen zur Abgrenzungs- und Pauschaloption; dazu Arbeitsstand vom 5.8.2026, Konsultationsentwurf vom 18.9.2025 (beide ersetzt, als Verfahrensgeschichte verknüpft) und Hintergrundpapier

### Geändert
- Externe Links (Originalquellen, GitHub, bwlaw.ch usw.) öffnen in einem neuen Fenster bzw. Tab; interne Links bleiben im selben Fenster

## [0.9.0] – 2026-10-02

### Neu
- Dokumentliste seitenweise: wählbar 10, 50 oder 100 Einträge pro Seite, mit Seitennavigation (Zurück, Seitenzahlen, Weiter); Seite und Anzahl stehen in der URL (`?page=2&per=50`)
- Neue Unterseite «Über OEA» / «About OEA» mit Ziel, Inhalt, Abdeckung, Entstehung eines Eintrags, Grundsätzen, Sprachen, Lizenzen und offenen Daten; «Über uns» beschreibt Initiant, Unabhängigkeit und Kontakt; Unternavigation zwischen beiden Seiten
- Österreich: Elektrizitätswirtschaftsgesetz (ElWG, BGBl. I Nr. 91/2025), ElWOG 2010 (ersetzt), Erneuerbaren-Ausbau-Gesetz (EAG), Erneuerbaren-Ausbau-Beschleunigungsgesetz (EABG, BGBl. I Nr. 47/2026), Systemnutzungsentgelte-Verordnung 2018
- Taxonomie: neun österreichische Bundesländer (AT-1 bis AT-9)

### Geändert
- Fusszeile: «Impressum & Datenschutz» steht ganz am Schluss; «Lizenzen» verweist auf «Über OEA»

## [0.8.0] – 2026-10-02

### Neu
- Schlagwörter sind anklickbar: Typ, Rechtsraum, Kanton/Bundesland und Rechte auf Karten und Dokumentseiten führen zur gefilterten Liste (z. B. alle deutschen Dokumente). In der Liste ergänzt ein Klick die bestehenden Filter, statt sie zu ersetzen; «Filter zurücksetzen» hebt alle auf
- Startseite: neue Spalte «Nach Rechtsraum»
- Dokumentseiten: Typ und Rechtsraum in den Metadaten verlinkt
- Filter «Ebene» (bisher «Bund / Kanton») gruppiert nach Rechtsraum und zeigt nur die Ebenen des gewählten Rechtsraums; Karten zeigen bei kantonalen bzw. Landesgesetzen Staat und Kanton/Land
- Taxonomie: 16 deutsche Bundesländer (DE-XX)
- Deutschland: StromNEV, StromNZV (aufgehoben Ende 2025), ARegV, MaStRV; Bundesnetzagentur AgNes-Festlegungsentwurf; Netzpaket (BT-Drs. 21/7866); Landesrecht: KlimaG BW, Solargesetz Berlin, BayBO Art. 44a
- EU: EuGH C-718/18 (Unabhängigkeit der Bundesnetzagentur)

### Geändert
- Filterwert «Ebene» für Bundesebene ist neu der Code des Rechtsraums (z. B. `level=CH`) statt `national`

## [0.7.0] – 2026-10-02

### Neu
- Erste deutsche Einträge (Rechtsraum DE, deutsche Rechtschreibung mit ß):
  - Bundesgesetze: Erneuerbare-Energien-Gesetz (EEG 2023), Energiewirtschaftsgesetz (EnWG), Kraft-Wärme-Kopplungsgesetz (KWKG), Messstellenbetriebsgesetz (MsbG), Gebäudemodernisierungsgesetz (GModG, bis Juli 2026 GEG), Windenergieflächenbedarfsgesetz (WindBG), Energiefinanzierungsgesetz (EnFG), Wärmeplanungsgesetz (WPG)
  - Bundesnetzagentur: Festlegung BK6-22-300 zu § 14a EnWG (steuerbare Verbrauchseinrichtungen)
  - Rechtsprechung: BGH EnVR 83/20 (Kundenanlage), BVerfG 1 BvR 460/23 (Strompreisbremse)
  - Parlamentsmaterialien: EEG-Novelle 2027, BT-Drs. 21/7867 (Entwurf)
- Erster EU-Eintrag: EuGH C-293/23 (Kundenanlage), verknüpft mit dem BGH-Beschluss

## [0.6.1] – 2026-10-02

### Geändert
- Menüpunkt und Seite «Über uns» / «About us» statt «Über das Archiv» / «About»
- Gleicher Abstand zwischen Kopfbereich und Seitentitel auf allen Seiten wie auf der Startseite

## [0.6.0] – 2026-10-02

### Neu
- 15 weitere kantonale Energiegesetze: AI, AR, BL, FR, GL, JU, NE, NW, SH, SO, SZ, TG, UR, VS, ZG (Obwalden hat kein eigenes Energiegesetz; Regeln im Baugesetz)
- Bundeserlasse: Wasserrechtsgesetz (WRG), Elektrizitätsgesetz (EleG), Raumplanungsgesetz (RPG, u. a. Art. 18a Solaranlagen), Beschleunigungserlass (AS 2026 99), Herkunftsnachweisverordnung (HKSV), Niederspannungs-Installationsverordnung (NIV), Winterreserveverordnung (WResV), CO2-Gesetz
- BFE: Faktenblatt Neuerungen 2025, Monitoring-Bericht Energiestrategie 2050 (2025), Elektrizitätsstatistik 2025, Richtlinie Effizienzvorgaben für Lieferanten
- Querverweise zwischen WRG und den Wasserkraft-Entscheiden, HKSV und ElCom 211-00506, EleG und den Leitungsentscheiden

## [0.5.2] – 2026-10-02

### Geändert
- Repository in `open-energy-archive.github.io` umbenannt; Website neu unter https://open-energy-archive.github.io/

### Neu
- Hinweis «Nicht fachlich geprüft» auf eigenen Musterverträgen (Website, Markdown, Word), solange kein Fach-Reviewer eingetragen ist (`reviewed_by`, `reviewed_on`)
- Aufruf für Fachreviewerinnen und -reviewer im Energierecht Schweiz (Mitwirken, Über das Archiv, CONTRIBUTING, GOVERNANCE)

## [0.5.1] – 2026-10-02

### Geändert
- Titel und Beschriftungen ohne Grossbuchstaben
- Fliesstext nutzt die ganze Inhaltsbreite (keine schmalen Textspalten mehr)

## [0.5.0] – 2026-10-02

### Neu
- 11 Verfügungen der ElCom: ZEV und Grundversorgung (223-00004, 223-00005, 233-00095), Rückliefervergütung (222-00001, 222-00003), Netzanschluss PV und Steuergerät (212-00402), Smart Meter (233-00093, 233-00099, 233-00103), Zertifizierungskosten und Herkunftsnachweise (211-00506), Netzanschlüsse E-Mobilität (212-00399)
- 10 kantonale Energiegesetze: ZH, BE, VD, GE, AG, LU, SG, BS, TI, GR
- Feld `subdivision` mit allen 26 Kantonen in der Taxonomie; Filter «Bund / Kanton» in Liste und Suche; Kantons-Chip auf den Einträgen

## [0.4.2] – 2026-10-02

### Geändert
- «Eine Initiative von Bernhard Weber · bwlaw.ch» steht neu ganz unten in der Fusszeile statt in der oberen Leiste

## [0.4.1] – 2026-10-02

### Geändert
- Eigenes Logo (Blatt und Stecker) im Kopf, als Favicon und App-Symbol
- Akzentfarbe Grün aus dem Logo statt Petrol und Blau
- Titel «Open Energy Archive» einfarbig, keine kursiven Schriften mehr

## [0.4.0] – 2026-10-02

### Neu
- Englische Version der Website unter `/en/` mit Sprachumschalter DE/EN
- Englische Zusammenfassungen und Hinweise (`summary_en`, `status_note_en`) für alle Einträge
- Seiten «Impressum & Datenschutz» bzw. «Legal notice & privacy»
- Hinweis «Eine Initiative von Bernhard Weber» mit Link auf bwlaw.ch

### Geändert
- Neues Erscheinungsbild angelehnt an bwlaw.ch: dunkle Kopf- und Fusszeile, Open Sans (selbst gehostet), Petrol als Akzentfarbe, Wortbild «open energy archive»
- Markdown-Konverter in `scripts/markdown.mjs` ausgelagert

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
