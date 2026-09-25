// Erzeugt die statische Website in dist/ aus den YAML-Metadaten.
// Danach indexiert Pagefind die Dokumentseiten für die Volltextsuche (siehe package.json).
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadDocuments, loadTaxonomy } from './lib.mjs';

const BASE = (process.env.BASE_PATH || '/').replace(/\/?$/, '/');
const SITE_NAME = 'Open Energy Archive';
const REPO_URL = process.env.REPO_URL || 'https://github.com/open-energy-archive/open-energy-archive';
const DIST = path.join(ROOT, 'dist');

const tax = loadTaxonomy();
const docs = loadDocuments()
  .map(({ file, doc }) => ({ ...doc, _file: file }))
  .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
const byId = Object.fromEntries(docs.map((d) => [d.id, d]));

// ---------- Hilfsfunktionen ----------
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const label = (list, key) => tax[list]?.[key]?.de ?? tax[list]?.[key] ?? key;
const url = (p = '') => BASE + p.replace(/^\//, '');
const docUrl = (d) => url(`d/${d.id}/`);
function fmtDate(iso, precision = 'day') {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  if (precision === 'year') return y;
  if (precision === 'month') return `${months[+m - 1]} ${y}`;
  return `${+d}. ${months[+m - 1]} ${y}`;
}
function write(rel, content) {
  const out = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, content);
}
const free = (d) => ['official_work', 'open_license', 'permission'].includes(d.rights?.status);

// ---------- Layout ----------
function layout({ title, description = '', body, active = null, extraHead = '' }) {
  const nav = [['', 'Suche'], ['dokumente/', 'Alle Dokumente'], ['ueber/', 'Über das Archiv'], ['mitwirken/', 'Mitwirken']]
    .map(([href, text]) => `<a href="${url(href)}"${active === href ? ' aria-current="page"' : ''}>${text}</a>`).join('');
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title ? `${title} – ${SITE_NAME}` : SITE_NAME)}</title>
<meta name="description" content="${esc(description || 'Offenes, durchsuchbares Archiv für Gesetze, Entscheide, Leitfäden und Verträge zu Elektrizität und Energie.')}">
<link rel="icon" href="${url('assets/favicon.svg')}" type="image/svg+xml">
<link rel="stylesheet" href="${url('assets/style.css')}">
${extraHead}
</head>
<body>
<a class="skip" href="#main">Zum Inhalt</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="${url()}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg><span>${SITE_NAME}</span></a>
    <nav aria-label="Hauptnavigation">${nav}</nav>
  </div>
</header>
<main id="main" class="wrap">
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <p><strong>Keine Rechtsberatung.</strong> Das Archiv verweist auf öffentlich zugängliche Dokumente. Massgebend ist stets die verlinkte amtliche Quelle. Angaben ohne Gewähr.</p>
    <p>Metadaten: <a href="${url('ueber/#lizenzen')}">CC0 1.0</a> · Code: MIT · <a href="${REPO_URL}">Quellcode auf GitHub</a> · <a href="${url('data/documents.json')}">JSON</a> · <a href="${url('data/documents.csv')}">CSV</a></p>
  </div>
</footer>
</body>
</html>`;
}

function chips(d) {
  return `<span class="chip chip-type">${esc(label('doc_types', d.doc_type))}</span>`
    + `<span class="chip">${esc(label('jurisdictions', d.jurisdiction))}</span>`
    + `<span class="chip chip-rights ${free(d) ? 'is-free' : 'is-link'}">${free(d) ? 'Frei' : 'Nur Link'}</span>`;
}

function card(d) {
  return `<li class="card">
  <div class="card-meta">${chips(d)}<span class="date">${esc(fmtDate(d.date, d.date_precision))}</span></div>
  <h3><a href="${docUrl(d)}">${esc(d.short_title && !d.title.includes(d.short_title) ? `${d.short_title} – ${d.title}` : d.title)}</a></h3>
  <p class="issuer">${esc(d.issuer)}${d.reference ? ` · ${esc(d.reference)}` : ''}</p>
</li>`;
}

// ---------- Startseite mit Suche ----------
function countBy(key, list) {
  const c = {};
  for (const d of docs) for (const v of [].concat(d[key] ?? [])) c[v] = (c[v] || 0) + 1;
  return Object.entries(c).sort((a, b) => b[1] - a[1]).map(([k, n]) => ({ k, n, l: label(list, k) }));
}
const typeCounts = countBy('doc_type', 'doc_types');
const topicCounts = countBy('topics', 'topics');
const jurCounts = countBy('jurisdiction', 'jurisdictions');

write('index.html', layout({
  title: '',
  active: '',
  extraHead: `<link rel="stylesheet" href="${url('pagefind/pagefind-ui.css')}"><script src="${url('pagefind/pagefind-ui.js')}" defer></script>`,
  body: `
<section class="hero">
  <h1>Energiedokumente, offen und an einem Ort.</h1>
  <p class="lead">Gesetze, Verordnungen, Gerichts- und Behördenentscheide, Leitfäden und Verträge zu Elektrizität und Energie – gesammelt, verschlagwortet und frei durchsuchbar. Damit der Ausbau erneuerbarer Energie nicht an der Suche nach Grundlagen scheitert.</p>
  <dl class="stats">
    <div><dt>Dokumente</dt><dd>${docs.length}</dd></div>
    <div><dt>Rechtsräume</dt><dd>${jurCounts.length}</dd></div>
    <div><dt>Dokumenttypen</dt><dd>${typeCounts.length}</dd></div>
    <div><dt>Frei verfügbar</dt><dd>${docs.filter(free).length}</dd></div>
  </dl>
</section>
<section aria-label="Suche" class="search-block">
  <div id="search"></div>
  <noscript><p>Die Suche benötigt JavaScript. <a href="${url('dokumente/')}">Alle Dokumente als Liste</a>.</p></noscript>
</section>
<section class="browse">
  <div>
    <h2>Nach Thema</h2>
    <ul class="tag-list">${topicCounts.map((t) => `<li><a href="${url(`dokumente/?topic=${t.k}`)}">${esc(t.l)} <span>${t.n}</span></a></li>`).join('')}</ul>
  </div>
  <div>
    <h2>Nach Typ</h2>
    <ul class="tag-list">${typeCounts.map((t) => `<li><a href="${url(`dokumente/?type=${t.k}`)}">${esc(t.l)} <span>${t.n}</span></a></li>`).join('')}</ul>
  </div>
</section>
<section>
  <h2>Zuletzt ergänzt</h2>
  <ul class="cards">${[...docs].sort((a, b) => b.added.localeCompare(a.added) || b.date.localeCompare(a.date)).slice(0, 6).map(card).join('')}</ul>
  <p><a class="more" href="${url('dokumente/')}">Alle ${docs.length} Dokumente anzeigen →</a></p>
</section>
<script>
window.addEventListener('DOMContentLoaded', () => {
  new PagefindUI({
    element: '#search',
    bundlePath: '${url('pagefind/')}',
    showSubResults: false,
    showImages: false,
    resetStyles: false,
    pageSize: 10,
    translations: { placeholder: 'Suchen, z. B. «Eigenverbrauch», «StromVG», «Netzanschluss» …' }
  });
  const q = new URLSearchParams(location.search).get('q');
  if (q) setTimeout(() => { const i = document.querySelector('#search input'); if (i) { i.value = q; i.dispatchEvent(new Event('input')); } }, 50);
});
</script>`,
}));

// ---------- Liste aller Dokumente mit Filtern ----------
const opt = (list, counts) => counts.map((c) => `<option value="${c.k}">${esc(c.l)} (${c.n})</option>`).join('');
write('dokumente/index.html', layout({
  title: 'Alle Dokumente',
  active: 'dokumente/',
  body: `
<h1>Alle Dokumente</h1>
<form class="filters" id="filters" role="search" aria-label="Dokumente filtern">
  <label>Text<input type="search" name="q" placeholder="Titel, Aktenzeichen, Herausgeber …"></label>
  <label>Rechtsraum<select name="jur"><option value="">Alle</option>${opt('jurisdictions', jurCounts)}</select></label>
  <label>Typ<select name="type"><option value="">Alle</option>${opt('doc_types', typeCounts)}</select></label>
  <label>Thema<select name="topic"><option value="">Alle</option>${opt('topics', topicCounts)}</select></label>
  <label>Rechte<select name="rights"><option value="">Alle</option><option value="free">Frei verfügbar</option><option value="link">Nur Link</option></select></label>
</form>
<p class="result-count" id="count" aria-live="polite"></p>
<ul class="cards" id="list">
${docs.map((d) => card(d).replace('<li class="card">', `<li class="card" data-jur="${d.jurisdiction}" data-type="${d.doc_type}" data-topics="${d.topics.join(' ')}" data-rights="${free(d) ? 'free' : 'link'}" data-text="${esc([d.title, d.title_en, d.short_title, d.reference, d.issuer].filter(Boolean).join(' ').toLowerCase())}">`)).join('\n')}
</ul>
<script src="${url('assets/filter.js')}" defer></script>`,
}));

// ---------- Einzelne Dokumentseiten ----------
for (const d of docs) {
  const rows = [
    ['Typ', label('doc_types', d.doc_type)],
    ['Rechtsraum', label('jurisdictions', d.jurisdiction) + (d.subdivision ? ` (${d.subdivision})` : '')],
    ['Herausgeber', d.issuer],
    ['Referenz', d.reference],
    ['Datum', fmtDate(d.date, d.date_precision)],
    ['Status', label('statuses', d.status)],
    ['Sprachen', d.languages.map((l) => label('languages', l)).join(', ')],
    ['Rechte', `${label('rights', d.rights.status)}${d.rights.basis ? ` – ${d.rights.basis}` : ''}${d.rights.license ? ` (${d.rights.license})` : ''}`],
    ['Zuletzt geprüft', fmtDate(d.last_checked)],
  ].filter(([, v]) => v);
  const related = (d.related || []).map((r) => byId[r]).filter(Boolean);
  const filters = [
    ['Rechtsraum', label('jurisdictions', d.jurisdiction)],
    ['Typ', label('doc_types', d.doc_type)],
    ...d.topics.map((t) => ['Thema', label('topics', t)]),
    ['Rechte', free(d) ? 'Frei verfügbar' : 'Nur Link'],
  ];
  write(`d/${d.id}/index.html`, layout({
    title: d.short_title || d.title,
    description: d.summary_de,
    body: `
<nav class="crumbs" aria-label="Pfad"><a href="${url('dokumente/')}">Alle Dokumente</a> / ${esc(label('doc_types', d.doc_type))}</nav>
<article class="doc" data-pagefind-body>
  <div class="card-meta" data-pagefind-ignore>${chips(d)}</div>
  <h1 data-pagefind-meta="title">${esc(d.title)}</h1>
  ${d.title_en ? `<p class="title-en" lang="en">${esc(d.title_en)}</p>` : ''}
  <p class="summary">${esc(d.summary_de)}</p>
  ${d.summary_en ? `<p class="summary" lang="en">${esc(d.summary_en)}</p>` : ''}
  <div class="actions">
    <a class="btn primary" href="${esc(d.source_url)}" rel="noopener">Zur Originalquelle ↗</a>
    ${d.file ? `<a class="btn" href="${url(d.file)}">Archivkopie</a>` : ''}
    ${(d.alternate_urls || []).map((a) => `<a class="btn" href="${esc(a.url)}" rel="noopener">${esc(a.label)} ↗</a>`).join('')}
  </div>
  ${d.status_note ? `<aside class="note"><strong>Hinweis zum Stand:</strong> ${esc(d.status_note)}</aside>` : ''}
  <dl class="meta" data-pagefind-ignore>${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  <div class="topics" data-pagefind-ignore><h2>Themen</h2><ul class="tag-list">${d.topics.map((t) => `<li><a href="${url(`dokumente/?topic=${t}`)}">${esc(label('topics', t))}</a></li>`).join('')}</ul></div>
  <div hidden>${filters.map(([k, v]) => `<span data-pagefind-filter="${k}">${esc(v)}</span>`).join('')}<span data-pagefind-meta="Datum">${esc(fmtDate(d.date, d.date_precision))}</span><span data-pagefind-sort="date">${d.date}</span></div>
</article>
${related.length ? `<section><h2>Verwandte Dokumente</h2><ul class="cards">${related.map(card).join('')}</ul></section>` : ''}
<p class="edit"><a href="${REPO_URL}/edit/main/${d._file}">Metadaten auf GitHub korrigieren</a> · <a href="${REPO_URL}/issues/new?template=fehler-melden.yml&title=${encodeURIComponent('Fehler: ' + d.id)}">Fehler melden</a></p>`,
  }));
}

// ---------- Statische Textseiten ----------
const md = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');
function mdToHtml(src) {
  // Minimaler Markdown-Konverter für die eigenen Projekttexte (Überschriften, Listen, Absätze, Links, Fett, Code).
  const inline = (s) => esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, h) => `<a href="${h.startsWith('http') || h.startsWith('#') ? h : REPO_URL + '/blob/main/' + h.replace(/^\.\//, '')}">${t}</a>`);
  const out = []; let list = null; let para = [];
  const flushP = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; } };
  const flushL = () => { if (list) { out.push(`<${list.t}>${list.items.map((i) => `<li>${inline(i)}</li>`).join('')}</${list.t}>`); list = null; } };
  let inCode = false; let code = [];
  for (const line of src.split('\n')) {
    if (line.startsWith('```')) { if (inCode) { out.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`); code = []; } else { flushP(); flushL(); } inCode = !inCode; continue; }
    if (inCode) { code.push(line); continue; }
    const h = line.match(/^(#{1,4})\s+(.*?)(?:\s+\{#([\w-]+)\})?$/);
    const li = line.match(/^\s*(?:[-*]|(\d+)\.)\s+(.*)/);
    if (h) { flushP(); flushL(); const lvl = Math.max(h[1].length, 1); out.push(`<h${lvl}${h[3] ? ` id="${h[3]}"` : ''}>${inline(h[2])}</h${lvl}>`); }
    else if (li) { flushP(); const t = li[1] ? 'ol' : 'ul'; if (!list || list.t !== t) { flushL(); list = { t, items: [] }; } list.items.push(li[2]); }
    else if (/^\|/.test(line) || /^>/.test(line)) { flushL(); para.push(line.replace(/^>\s?/, '')); }
    else if (!line.trim()) { flushP(); flushL(); }
    else { flushL(); para.push(line.trim()); }
  }
  flushP(); flushL();
  return out.join('\n');
}
write('ueber/index.html', layout({ title: 'Über das Archiv', active: 'ueber/', body: `<div class="prose">${mdToHtml(md('docs/ueber.md'))}</div>` }));
write('mitwirken/index.html', layout({ title: 'Mitwirken', active: 'mitwirken/', body: `<div class="prose">${mdToHtml(md('docs/mitwirken.md'))}</div>` }));
write('404.html', layout({ title: 'Nicht gefunden', body: `<h1>Seite nicht gefunden</h1><p><a href="${url()}">Zur Suche</a></p>` }));

// ---------- Offene Daten ----------
const clean = docs.map(({ _file, ...d }) => ({ ...d, url: docUrl(d) }));
write('data/documents.json', JSON.stringify({ generated: new Date().toISOString(), license: 'CC0-1.0', count: clean.length, documents: clean }, null, 2));
const cols = ['id', 'title', 'doc_type', 'jurisdiction', 'issuer', 'reference', 'date', 'status', 'topics', 'languages', 'source_url', 'rights_status'];
const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
write('data/documents.csv', '﻿' + [cols.join(','), ...docs.map((d) => cols.map((c) => csvCell(c === 'rights_status' ? d.rights.status : Array.isArray(d[c]) ? d[c].join(';') : d[c])).join(','))].join('\n'));

// ---------- Assets ----------
for (const f of fs.readdirSync(path.join(ROOT, 'site', 'assets'))) fs.cpSync(path.join(ROOT, 'site', 'assets', f), path.join(DIST, 'assets', f));
if (fs.existsSync(path.join(ROOT, 'files'))) fs.cpSync(path.join(ROOT, 'files'), path.join(DIST, 'files'), { recursive: true });
fs.writeFileSync(path.join(DIST, '.nojekyll'), '');

console.log(`✓ Website mit ${docs.length} Dokumentseiten in dist/ erzeugt (BASE_PATH=${BASE})`);
