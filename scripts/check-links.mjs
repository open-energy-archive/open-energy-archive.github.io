// Prüft, ob alle source_url und alternate_urls erreichbar sind. Läuft wöchentlich via GitHub Actions.
import { loadDocuments } from './lib.mjs';

const targets = loadDocuments().flatMap(({ file, doc }) => [
  { file, url: doc.source_url },
  ...(doc.alternate_urls || []).map((a) => ({ file, url: a.url })),
]);

async function check({ url }) {
  for (const method of ['HEAD', 'GET']) {
    try {
      const res = await fetch(url, { method, redirect: 'follow', signal: AbortSignal.timeout(20000), headers: { 'user-agent': 'OpenEnergyArchive-LinkCheck/0.1 (+https://github.com/open-energy-archive)' } });
      if (res.ok) return { ok: true, status: res.status };
      if (method === 'GET') return { ok: false, status: res.status };
    } catch (e) {
      if (method === 'GET') return { ok: false, status: e.name };
    }
  }
}

const results = [];
for (let i = 0; i < targets.length; i += 5) {
  const batch = targets.slice(i, i + 5);
  results.push(...(await Promise.all(batch.map(async (t) => ({ ...t, ...(await check(t)) })))));
}
const broken = results.filter((r) => !r.ok);
for (const r of broken) console.error(`✗ ${r.status}  ${r.url}\n    in ${r.file}`);
console.log(`${results.length - broken.length}/${results.length} Links erreichbar`);
process.exit(broken.length ? 1 : 0);
