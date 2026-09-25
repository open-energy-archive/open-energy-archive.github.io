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
