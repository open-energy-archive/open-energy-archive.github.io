// Gemeinsame Hilfsfunktionen: Dokumente und Taxonomie laden.
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const load = (file) => yaml.load(fs.readFileSync(file, 'utf8'), { schema: yaml.CORE_SCHEMA });

export function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : (/\.ya?ml$/.test(e.name) ? [p] : []);
  });
}

export function loadTaxonomy() {
  return load(path.join(ROOT, 'taxonomy', 'taxonomy.yaml'));
}

export function loadDocuments() {
  return walk(path.join(ROOT, 'data', 'documents'))
    .sort()
    .map((file) => ({ file: path.relative(ROOT, file), doc: load(file) }));
}

// Stichtag-Logik: Geplante Statuswechsel (status_changes) werden angewendet, sobald ihr Datum
// erreicht ist. Massgebend ist das Builddatum (Zeitzone Europe/Zurich) oder BUILD_DATE=JJJJ-MM-TT.
export const buildDate = () => process.env.BUILD_DATE
  || new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Zurich' }).format(new Date());

export function applyStatusChanges(doc, today = buildDate()) {
  const changes = [...(doc.status_changes || [])].sort((a, b) => a.date.localeCompare(b.date));
  const out = { ...doc };
  for (const c of changes) {
    if (c.date > today) break;
    out.status = c.status;
    if (c.status_note) out.status_note = c.status_note;
    if (c.status_note_en) out.status_note_en = c.status_note_en;
  }
  out._upcoming = changes.filter((c) => c.date > today);
  return out;
}
