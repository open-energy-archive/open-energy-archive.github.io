// Prüft alle Metadaten-Dateien gegen Schema, Taxonomie und Archivregeln.
import fs from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { ROOT, loadDocuments, loadTaxonomy } from './lib.mjs';

const schema = JSON.parse(fs.readFileSync(path.join(ROOT, 'schema', 'document.schema.json'), 'utf8'));
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
const tax = loadTaxonomy();
const today = new Date().toISOString().slice(0, 10);

const errors = [];
const ids = new Map();
const docs = loadDocuments();

for (const { file, doc } of docs) {
  const err = (msg) => errors.push(`${file}: ${msg}`);
  if (!doc || typeof doc !== 'object') { err('leere oder ungültige YAML-Datei'); continue; }
  if (!validate(doc)) for (const e of validate.errors) err(`${e.instancePath || '/'} ${e.message}`);

  // ID eindeutig und = Dateiname
  if (ids.has(doc.id)) err(`doppelte ID "${doc.id}" (auch in ${ids.get(doc.id)})`);
  ids.set(doc.id, file);
  if (path.basename(file).replace(/\.ya?ml$/, '') !== doc.id) err(`Dateiname muss "${doc.id}.yaml" lauten`);

  // Kontrolliertes Vokabular
  const check = (value, list, field) => { if (value !== undefined && !(value in tax[list])) err(`${field}: unbekannter Wert "${value}" (siehe taxonomy/taxonomy.yaml)`); };
  check(doc.doc_type, 'doc_types', 'doc_type');
  check(doc.jurisdiction, 'jurisdictions', 'jurisdiction');
  check(doc.status, 'statuses', 'status');
  check(doc.subdivision, 'subdivisions', 'subdivision');
  check(doc.rights?.status, 'rights', 'rights.status');
  (doc.topics || []).forEach((t) => check(t, 'topics', 'topics'));
  (doc.languages || []).forEach((l) => check(l, 'languages', 'languages'));

  // Ablageort: data/documents/<jurisdiction>/<doc_type>/
  const parts = file.split(path.sep);
  if (doc.jurisdiction && doc.doc_type && (parts[2] !== doc.jurisdiction.toLowerCase() || parts[3] !== doc.doc_type))
    err(`falscher Ordner – erwartet data/documents/${doc.jurisdiction.toLowerCase()}/${doc.doc_type}/`);

  // Rechteregeln
  const freeStatuses = ['official_work', 'open_license', 'permission'];
  if (doc.rights?.mirror_allowed && !freeStatuses.includes(doc.rights.status))
    err('mirror_allowed: true ist nur bei official_work, open_license oder permission erlaubt');
  if (doc.file && !doc.rights?.mirror_allowed) err('Datei gespiegelt, obwohl mirror_allowed nicht true ist');
  if (doc.file && !fs.existsSync(path.join(ROOT, doc.file))) err(`Datei ${doc.file} existiert nicht`);
  if (doc.content && !fs.existsSync(path.join(ROOT, doc.content))) err(`Volltext ${doc.content} existiert nicht`);
  if (doc.content && doc.rights?.status !== 'open_license') err('content ist nur für eigene, offen lizenzierte Inhalte vorgesehen');
  for (const x of doc.downloads || []) if (!fs.existsSync(path.join(ROOT, x.path))) err(`Download ${x.path} existiert nicht`);
  if (doc.rights?.status === 'open_license' && !doc.rights.license) err('rights.license (SPDX) fehlt');
  if (doc.rights?.status === 'permission' && !doc.rights.permission_ref) err('rights.permission_ref fehlt');
  if (doc.doc_type === 'technical_standard' && doc.file) err('Technische Normen (DIN, VDE, IEC …) dürfen nicht gespiegelt werden');

  // Datumslogik & Schweizer Orthografie
  for (const f of ['date', 'added', 'last_checked']) if (doc[f] && doc[f] > today) err(`${f} liegt in der Zukunft`);
  if (/ß/.test(JSON.stringify(doc)) && doc.jurisdiction === 'CH') err('Schweizer Dokumente: "ss" statt "ß" verwenden (ausser in Originaltiteln aus DE/AT)');
}

// Verweise prüfen
for (const { file, doc } of docs) {
  for (const r of [...(doc.related || []), ...(doc.supersedes ? [doc.supersedes] : [])])
    if (!ids.has(r)) errors.push(`${file}: Verweis auf unbekannte ID "${r}"`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} Fehler in ${docs.length} Dokumenten:\n` + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log(`✓ ${docs.length} Dokumente gültig`);
