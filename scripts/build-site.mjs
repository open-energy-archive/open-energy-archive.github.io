// Erzeugt die statische Website in dist/ aus den YAML-Metadaten – auf Deutsch (/) und Englisch (/en/).
// Danach indexiert Pagefind die Dokumentseiten für die Volltextsuche (siehe package.json);
// Pagefind trennt die Indizes automatisch nach <html lang>.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ROOT, loadDocuments, loadTaxonomy } from './lib.mjs';
import { mdToHtml } from './markdown.mjs';

const BASE = (process.env.BASE_PATH || '/').replace(/\/?$/, '/');
const SITE_NAME = 'Open Energy Archive';
const REPO_URL = process.env.REPO_URL || 'https://github.com/open-energy-archive/open-energy-archive.github.io';
const AUTHOR_URL = 'https://www.bwlaw.ch/';
const DIST = path.join(ROOT, 'dist');
const LANGS = ['de', 'en'];

const tax = loadTaxonomy();
// Cache-Busting: Assets werden mit einem Inhalts-Hash geladen, damit nach einem Update nie eine alte Version läuft
const ASSET_HASH = Object.fromEntries(['style.css', 'filter.js'].map((f) => [f, crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, 'site', 'assets', f))).digest('hex').slice(0, 10)]));
const docs = loadDocuments()
  .map(({ file, doc }) => ({ ...doc, _file: file }))
  .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
const byId = Object.fromEntries(docs.map((d) => [d.id, d]));
// Rückverweise: Wer auf ein Dokument verweist, erscheint auch dort unter «Verwandte Dokumente».
const backlinks = {};
for (const d of docs) for (const r of d.related || []) (backlinks[r] ||= []).push(d.id);

// ---------- Texte ----------
const T = {
  de: {
    prefix: '', htmlLang: 'de', other: 'en', otherLabel: 'English', switchLabel: 'EN',
    paths: { home: '', list: 'dokumente/', about: 'ueber/', aboutUs: 'ueber/uns/', contribute: 'mitwirken/', legal: 'impressum/' },
    subAbout: { about: 'Über OEA', aboutUs: 'Über uns' }, subAboutLabel: 'Über',
    nav: { home: 'Suche', list: 'Dokumente', about: 'Über OEA', contribute: 'Mitwirken' },
    skip: 'Zum Inhalt', mainNav: 'Hauptnavigation',
    initiative: 'Eine Initiative von Bernhard Weber', initiativeShort: 'Initiative von Bernhard Weber',
    metaDesc: 'Offenes, durchsuchbares Archiv für Gesetze, Entscheide, Leitfäden und Verträge zu Elektrizität und Energie.',
    heroTitle: 'Energiedokumente – frei zugänglich und an einem Ort',
    heroLead: 'Gesetze, Verordnungen, Gerichts- und Behördenentscheide, Leitfäden und Verträge zu Elektrizität und Energie – gesammelt, verschlagwortet und frei durchsuchbar. Damit der Ausbau erneuerbarer Energie nicht an der Suche nach Grundlagen scheitert.',
    stats: ['Einträge', 'Rechtsräume', 'Dokumenttypen', 'Frei verfügbar'],
    searchTitle: 'Suche', searchPh: 'Suchen, z. B. «Eigenverbrauch», «StromVG», «Netzanschluss» …',
    noJs: 'Die Suche benötigt JavaScript.', listLink: 'Dokumente als Liste',
    byTopic: 'Nach Thema', byType: 'Nach Typ', latest: 'Zuletzt ergänzt', showAll: (n) => `Alle ${n} Einträge anzeigen →`,
    listTitle: 'Dokumente', filterLabel: 'Dokumente filtern',
    f: { text: 'Text', textPh: 'Titel, Aktenzeichen, Herausgeber …', jur: 'Rechtsraum', type: 'Typ', topic: 'Thema', rights: 'Rechte', level: 'Ebene', national: 'Bund', all: 'Alle', free: 'Frei verfügbar', link: 'Nur Link', reset: 'Filter zurücksetzen', date: 'Zeitraum', from: 'von', to: 'bis', fromAria: 'Datum von', toAria: 'Datum bis', pAll: 'Alle', p30: 'Letzte 30 Tage', p12: 'Letzte 12 Monate', pCustom: 'Eigener Zeitraum', dateErr: '«Bis» liegt vor «von». Passe den Zeitraum an.', toggle: 'Filter', done: 'Treffer zeigen', remove: 'entfernen', active: 'Aktive Filter', more: 'Weitere Filter' },
    chipTitle: (l) => `Alle Einträge: ${l}`, byJur: 'Nach Rechtsraum',
    countOf: 'von', countDocs: 'Einträgen', countTotal: 'insgesamt', perPage: 'Pro Seite', sortLabel: 'Sortierung', sortNew: 'Neueste zuerst', sortAdded: 'Zuletzt hinzugefügt', sortOld: 'Älteste zuerst', sortTitle: 'Titel A–Z', sortTitleDesc: 'Titel Z–A', prev: '‹ Zurück', next: 'Weiter ›', pagesLabel: 'Seiten',
    chipFree: 'Frei', chipLink: 'Nur Link', chipUnreviewed: 'Nicht fachlich geprüft',
    unreviewedNote: '<strong>Nicht fachlich geprüft.</strong> Dieses Muster wurde noch nicht von einer Fachperson für Energierecht geprüft. Verwendung auf eigene Verantwortung; Hinweise und Korrekturen sind willkommen.',
    crumbsAll: 'Dokumente',
    readFull: 'Volltext lesen', onGithub: 'Auf GitHub ↗', toSource: 'Zur Originalquelle ↗', archiveCopy: 'Archivkopie',
    noteLabel: 'Hinweis zum Stand:',
    meta: { type: 'Typ', jur: 'Rechtsraum', issuer: 'Herausgeber', ref: 'Referenz', date: 'Datum', status: 'Status', langs: 'Sprachen', rights: 'Rechte', checked: 'Zuletzt geprüft', orig: null },
    topics: 'Themen', related: 'Verwandte Dokumente', moreRelated: (n) => `${n} weitere anzeigen`,
    editMeta: 'Metadaten auf GitHub korrigieren', reportError: 'Fehler melden',
    filterNames: { jur: 'Rechtsraum', level: 'Ebene', type: 'Typ', topic: 'Thema', rights: 'Rechte' },
    notFound: 'Seite nicht gefunden', toSearch: 'Zur Suche',
    footerDisclaimer: '<strong>Keine Rechtsberatung.</strong> Das Archiv verweist auf öffentlich zugängliche Dokumente. Massgebend ist stets die verlinkte amtliche Quelle.',
    footerLegal: 'Impressum & Datenschutz', footerSource: 'Quellcode', footerLicences: 'Lizenzen',
    contentOnlyDe: null,
  },
  en: {
    prefix: 'en/', htmlLang: 'en', other: 'de', otherLabel: 'Deutsch', switchLabel: 'DE',
    paths: { home: '', list: 'documents/', about: 'about/', aboutUs: 'about/us/', contribute: 'contribute/', legal: 'legal/' },
    subAbout: { about: 'About OEA', aboutUs: 'About us' }, subAboutLabel: 'About',
    nav: { home: 'Search', list: 'Documents', about: 'About OEA', contribute: 'Contribute' },
    skip: 'Skip to content', mainNav: 'Main navigation',
    initiative: 'An initiative by Bernhard Weber', initiativeShort: 'Initiative by Bernhard Weber',
    metaDesc: 'Open, searchable archive of laws, decisions, guidance and contracts on electricity and energy.',
    heroTitle: 'Energy documents – freely accessible and in one place',
    heroLead: 'Laws, ordinances, court and regulatory decisions, guidance and contracts on electricity and energy – collected, tagged and freely searchable. So that the expansion of renewable energy does not stall on finding the basics.',
    stats: ['Entries', 'Jurisdictions', 'Document types', 'Freely available'],
    searchTitle: 'Search', searchPh: 'Search, e.g. “self-consumption”, “grid tariffs”, “wind farm” …',
    noJs: 'Search requires JavaScript.', listLink: 'Documents as a list',
    byTopic: 'By topic', byType: 'By type', latest: 'Recently added', showAll: (n) => `Show all ${n} entries →`,
    listTitle: 'Documents', filterLabel: 'Filter documents',
    f: { text: 'Text', textPh: 'Title, case number, issuer …', jur: 'Jurisdiction', type: 'Type', topic: 'Topic', rights: 'Rights', level: 'Level', national: 'Federal', all: 'All', free: 'Freely available', link: 'Link only', reset: 'Reset filters', date: 'Period', from: 'from', to: 'to', fromAria: 'Date from', toAria: 'Date to', pAll: 'All', p30: 'Last 30 days', p12: 'Last 12 months', pCustom: 'Custom range', dateErr: '"To" is before "from". Adjust the period.', toggle: 'Filters', done: 'Show results', remove: 'remove', active: 'Active filters', more: 'More filters' },
    chipTitle: (l) => `All entries: ${l}`, byJur: 'By jurisdiction',
    countOf: 'of', countDocs: 'entries', countTotal: 'in total', perPage: 'Per page', sortLabel: 'Sort', sortNew: 'Newest first', sortAdded: 'Recently added', sortOld: 'Oldest first', sortTitle: 'Title A–Z', sortTitleDesc: 'Title Z–A', prev: '‹ Previous', next: 'Next ›', pagesLabel: 'Pages',
    chipFree: 'Free', chipLink: 'Link only', chipUnreviewed: 'Not expert-reviewed',
    unreviewedNote: '<strong>Not expert-reviewed.</strong> This template has not yet been reviewed by an energy-law specialist. Use at your own responsibility; comments and corrections are welcome.',
    crumbsAll: 'Documents',
    readFull: 'Read full text (German)', onGithub: 'On GitHub ↗', toSource: 'Go to original source ↗', archiveCopy: 'Archive copy',
    noteLabel: 'Status note:',
    meta: { type: 'Type', jur: 'Jurisdiction', issuer: 'Issuer', ref: 'Reference', date: 'Date', status: 'Status', langs: 'Languages', rights: 'Rights', checked: 'Last checked', orig: 'Original title' },
    topics: 'Topics', related: 'Related documents', moreRelated: (n) => `Show ${n} more`,
    editMeta: 'Correct metadata on GitHub', reportError: 'Report an error',
    filterNames: { jur: 'Jurisdiction', level: 'Level', type: 'Type', topic: 'Topic', rights: 'Rights' },
    notFound: 'Page not found', toSearch: 'Go to search',
    footerDisclaimer: '<strong>Not legal advice.</strong> The archive refers to publicly available documents. The linked official source is always authoritative. English summaries are translations by the project.',
    footerLegal: 'Legal notice & privacy', footerSource: 'Source code', footerLicences: 'Licences',
    contentOnlyDe: 'This model contract is currently available in German only. The full text and the Word template are on the German page.',
  },
};
const LANG_NAMES = { de: { de: 'Deutsch', fr: 'Französisch', it: 'Italienisch', rm: 'Rätoromanisch', en: 'Englisch' }, en: { de: 'German', fr: 'French', it: 'Italian', rm: 'Romansh', en: 'English' } };
const MONTHS = {
  de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

// ---------- Hilfsfunktionen ----------
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const url = (p = '') => BASE + p.replace(/^\//, '');
const unreviewed = (d) => d.doc_type === 'contract_template' && !d.reviewed_by;
const free = (d) => ['official_work', 'open_license', 'permission'].includes(d.rights?.status);
// Externe Links (http/https) öffnen in einem neuen Fenster bzw. Tab.
const externalLinks = (html) => html.replace(/<a\s([^>]*?)href="(https?:\/\/[^"]*)"([^>]*)>/g, (m, pre, href, post) => {
  const attrs = pre + post;
  if (/\btarget=/.test(attrs)) return m;
  const rel = /\brel="/.test(attrs) ? '' : ' rel="noopener"';
  return `<a ${pre}href="${href}"${post} target="_blank"${rel}>`;
});
function write(rel, content) {
  if (rel.endsWith('.html')) content = externalLinks(content);
  const out = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, content);
}
const md = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');

function forLang(lang) {
  const t = T[lang];
  const L = (list, key) => tax[list]?.[key]?.[lang] ?? tax[list]?.[key]?.de ?? key;
  const page = (key, extra = '') => url(t.prefix + t.paths[key] + extra);
  const docUrl = (d, lg = lang) => url(T[lg].prefix + `d/${d.id}/`);
  const title = (d) => (lang === 'en' && d.title_en) ? d.title_en : d.title;
  const summary = (d) => (lang === 'en' && d.summary_en) ? d.summary_en : d.summary_de;
  const statusNote = (d) => (lang === 'en' && d.status_note_en) ? d.status_note_en : d.status_note;
  function fmtDate(iso, precision = 'day') {
    if (!iso) return '';
    const [y, m, dd] = iso.split('-'); const mo = MONTHS[lang][+m - 1];
    if (precision === 'year') return y;
    if (precision === 'month') return `${mo} ${y}`;
    return lang === 'de' ? `${+dd}. ${mo} ${y}` : `${+dd} ${mo} ${y}`;
  }
  return { t, L, page, docUrl, title, summary, statusNote, fmtDate };
}

// ---------- Layout ----------
const LOGO = () => `<img class="mark" src="${url('assets/logo.png')}" width="52" height="52" alt="">`;

function layout(lang, { title, description = '', body, active = null, alt = null, extraHead = '' }) {
  const { t, page } = forLang(lang);
  const navItems = ['home', 'list', 'about', 'contribute']
    .map((k) => `<a href="${page(k)}"${active === k || (k === 'about' && active === 'aboutUs') ? ' aria-current="page"' : ''}>${t.nav[k]}</a>`).join('');
  const altHref = alt ?? url(T[t.other].prefix);
  return `<!doctype html>
<html lang="${t.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title ? `${title} – ${SITE_NAME}` : SITE_NAME)}</title>
<meta name="description" content="${esc(description || t.metaDesc)}">
<link rel="alternate" hreflang="${t.other}" href="${altHref}">
<link rel="icon" href="${url('assets/favicon-64.png')}" type="image/png">
<link rel="apple-touch-icon" href="${url('assets/apple-touch-icon.png')}">
<link rel="stylesheet" href="${url('assets/style.css')}?v=${ASSET_HASH['style.css']}">
${extraHead}
</head>
<body>
<a class="skip" href="#main">${t.skip}</a>
<div class="topbar">
  <div class="wrap topbar-inner">
    <nav class="lang" aria-label="Language">
      <a href="${lang === 'de' ? '#' : altHref}"${lang === 'de' ? ' aria-current="true"' : ''} lang="de">DE</a>
      <a href="${lang === 'en' ? '#' : altHref}"${lang === 'en' ? ' aria-current="true"' : ''} lang="en">EN</a>
    </nav>
  </div>
</div>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="${page('home')}" aria-label="${SITE_NAME}">${LOGO()}<span class="wordmark">Open Energy Archive</span></a>
    <nav class="main-nav" aria-label="${t.mainNav}">${navItems}</nav>
  </div>
</header>
<main id="main" class="wrap">
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <p class="disclaimer">${t.footerDisclaimer}</p>
    <p class="footer-links">
      <span>© ${new Date().getFullYear()} ${SITE_NAME}</span><span class="sep">|</span>
      <a href="${page('about', lang === 'de' ? '#lizenzen' : '#licences')}">${t.footerLicences}</a><span class="sep">|</span>
      <a href="${REPO_URL}">${t.footerSource}</a><span class="sep">|</span>
      <a href="${url('data/documents.json')}">JSON</a><span class="sep">|</span><a href="${url('data/documents.csv')}">CSV</a><span class="sep">|</span>
      <a href="${page('legal')}">${t.footerLegal}</a>
    </p>
    <p class="initiative"><a href="${AUTHOR_URL}" rel="noopener">${t.initiative} · <span>bwlaw.ch</span></a></p>
  </div>
</footer>
</body>
</html>`;
}

// ---------- Bausteine ----------
function countBy(key, list, L) {
  const c = {};
  for (const d of docs) for (const v of [].concat(d[key] ?? [])) c[v] = (c[v] || 0) + 1;
  return Object.entries(c).sort((a, b) => b[1] - a[1]).map(([k, n]) => ({ k, n, l: L(list, k) }));
}

function build(lang) {
  const H = forLang(lang); const { t, L, page, docUrl, title, summary, statusNote, fmtDate } = H;
  const P = t.prefix;
  const typeCounts = countBy('doc_type', 'doc_types', L);
  const topicCounts = countBy('topics', 'topics', L);
  const jurCounts = countBy('jurisdiction', 'jurisdictions', L);
  // Ebene: Kanton/Bundesland (subdivision) oder Gesamtstaat (= Code des Rechtsraums, z. B. CH, DE, EU)
  const levelOf = (d) => d.subdivision || d.jurisdiction;
  const supranational = ['EU', 'INT'];
  const levelLabel = (k) => tax.subdivisions?.[k] ? L('subdivisions', k)
    : supranational.includes(k) ? L('jurisdictions', k) : `${t.f.national} (${L('jurisdictions', k)})`;
  const levelJur = (k) => k.split('-')[0];
  const subCounts = (() => {
    const c = {}; for (const d of docs) c[levelOf(d)] = (c[levelOf(d)] || 0) + 1;
    const jurOrder = jurCounts.map((x) => x.k);
    return Object.entries(c).sort((a, b) => {
      const ja = jurOrder.indexOf(levelJur(a[0])), jb = jurOrder.indexOf(levelJur(b[0]));
      if (ja !== jb) return ja - jb;
      if (!a[0].includes('-')) return -1; if (!b[0].includes('-')) return 1;
      return levelLabel(a[0]).localeCompare(levelLabel(b[0]), lang);
    }).map(([k, n]) => ({ k, n, l: levelLabel(k), jur: levelJur(k) }));
  })();
  const listLink = (params) => page('list', '?' + new URLSearchParams(params).toString());
  const chipLink = (cls, label, params) => `<a class="chip ${cls}" href="${listLink(params)}" title="${esc(t.chipTitle(label))}">${esc(label)}</a>`;
  const otherPage = (key) => url(T[t.other].prefix + T[t.other].paths[key]);

  const chips = (d) => chipLink('chip-type', L('doc_types', d.doc_type), { type: d.doc_type })
    + chipLink('chip-jur', L('jurisdictions', d.jurisdiction), { jur: d.jurisdiction })
    + (d.subdivision ? chipLink('chip-sub', L('subdivisions', d.subdivision), { jur: d.jurisdiction, level: d.subdivision }) : '')
    + chipLink(`chip-rights ${free(d) ? 'is-free' : 'is-link'}`, free(d) ? t.chipFree : t.chipLink, { rights: free(d) ? 'free' : 'link' })
    + (unreviewed(d) ? `<span class="chip chip-warn">${t.chipUnreviewed}</span>` : '');
  const cardTitle = (d) => { const ti = title(d); return d.short_title && !ti.includes(d.short_title) ? `${d.short_title} – ${ti}` : ti; };
  const card = (d, attrs = '') => `<li class="card"${attrs}>
  <div class="card-meta">${chips(d)}<span class="date">${esc(fmtDate(d.date, d.date_precision))}</span></div>
  <h3><a href="${docUrl(d)}">${esc(cardTitle(d))}</a></h3>
  <p class="issuer">${esc(d.issuer)}${d.reference ? ` · ${esc(d.reference)}` : ''}</p>
</li>`;

  // Startseite
  write(`${P}index.html`, layout(lang, {
    title: '', active: 'home', alt: otherPage('home'),
    extraHead: `<link rel="stylesheet" href="${url('pagefind/pagefind-ui.css')}"><script src="${url('pagefind/pagefind-ui.js')}" defer></script>`,
    body: `
<section class="hero">
  <h1 class="section-title">${t.heroTitle}</h1>
  <p class="lead">${t.heroLead}</p>
  <dl class="stats">
    <div><dt>${t.stats[0]}</dt><dd>${docs.length}</dd></div>
    <div><dt>${t.stats[1]}</dt><dd>${jurCounts.length}</dd></div>
    <div><dt>${t.stats[2]}</dt><dd>${typeCounts.length}</dd></div>
    <div><dt>${t.stats[3]}</dt><dd>${docs.filter(free).length}</dd></div>
  </dl>
</section>
<section aria-label="${t.searchTitle}" class="search-block">
  <div id="search"></div>
  <noscript><p>${t.noJs} <a href="${page('list')}">${t.listLink}</a>.</p></noscript>
</section>
<section class="browse">
  <div>
    <h2 class="section-title">${t.byJur}</h2>
    <ul class="tag-list">${jurCounts.map((x) => `<li><a href="${listLink({ jur: x.k })}">${esc(x.l)} <span>${x.n}</span></a></li>`).join('')}</ul>
  </div>
  <div>
    <h2 class="section-title">${t.byTopic}</h2>
    <ul class="tag-list">${topicCounts.map((x) => `<li><a href="${page('list', `?topic=${x.k}`)}">${esc(x.l)} <span>${x.n}</span></a></li>`).join('')}</ul>
  </div>
  <div>
    <h2 class="section-title">${t.byType}</h2>
    <ul class="tag-list">${typeCounts.map((x) => `<li><a href="${page('list', `?type=${x.k}`)}">${esc(x.l)} <span>${x.n}</span></a></li>`).join('')}</ul>
  </div>
</section>
<section>
  <h2 class="section-title">${t.latest}</h2>
  <ul class="cards">${[...docs].sort((a, b) => b.added.localeCompare(a.added) || b.date.localeCompare(a.date)).slice(0, 6).map((d) => card(d)).join('')}</ul>
  <p><a class="more" href="${page('list')}">${t.showAll(docs.length)}</a></p>
</section>
<script>
window.addEventListener('DOMContentLoaded', () => {
  new PagefindUI({ element: '#search', bundlePath: '${url('pagefind/')}', showSubResults: false, showImages: false, resetStyles: false, pageSize: 10,
    translations: { placeholder: ${JSON.stringify(t.searchPh)} } });
  const q = new URLSearchParams(location.search).get('q');
  if (q) setTimeout(() => { const i = document.querySelector('#search input'); if (i) { i.value = q; i.dispatchEvent(new Event('input')); } }, 50);
});
</script>`,
  }));

  // Liste
  const opt = (counts) => counts.map((c) => `<option value="${c.k}" data-label="${esc(c.l)}">${esc(c.l)} (${c.n})</option>`).join('');
  write(`${P}${t.paths.list}index.html`, layout(lang, {
    title: t.listTitle, active: 'list', alt: otherPage('list'),
    body: `
<h1 class="section-title">${t.listTitle}</h1>
<form class="filters" id="filters" role="search" aria-label="${t.filterLabel}">
  <div class="f-top">
    <label class="f-text">${t.f.text}<input type="search" name="q" placeholder="${t.f.textPh}"></label>
    <button type="button" class="f-toggle" id="ftoggle" aria-expanded="false" aria-controls="fpanel" hidden>${t.f.toggle} <span class="f-badge" id="fbadge"></span></button>
  </div>
  <div class="f-panel" id="fpanel">
    <fieldset class="f-group"><legend>${t.f.jur}</legend><div class="f-pills">
      <label class="f-pill"><input type="radio" name="jur" value="" checked><span data-label="${t.f.all}">${t.f.all}</span></label>${jurCounts.map((j) => `<label class="f-pill"><input type="radio" name="jur" value="${j.k}"><span data-label="${esc(j.l)}">${esc(j.l)} (${j.n})</span></label>`).join('')}
    </div></fieldset>
    <div class="f-selects">
      <label>${t.f.level}<select name="level"><option value="">${t.f.all}</option>${jurCounts.map((j) => `<optgroup label="${esc(j.l)}" data-jur="${j.k}">${subCounts.filter((c) => c.jur === j.k).map((c) => `<option value="${c.k}" data-jur="${c.jur}" data-label="${esc(c.l)}">${esc(c.l)} (${c.n})</option>`).join('')}</optgroup>`).join('')}</select></label>
      <label>${t.f.type}<select name="type"><option value="">${t.f.all}</option>${opt(typeCounts)}</select></label>
      <label>${t.f.topic}<select name="topic"><option value="">${t.f.all}</option>${opt(topicCounts)}</select></label>
      <label>${t.f.rights}<select name="rights"><option value="">${t.f.all}</option><option value="free" data-label="${t.f.free}">${t.f.free}</option><option value="link" data-label="${t.f.link}">${t.f.link}</option></select></label>
    </div>
    <fieldset class="f-group f-period"><legend>${t.f.date}</legend><div class="f-pills">
      <label class="f-pill"><input type="radio" name="period" value="all" checked><span data-label="${t.f.pAll}">${t.f.pAll}</span></label>
      <label class="f-pill"><input type="radio" name="period" value="30d"><span data-label="${t.f.p30}">${t.f.p30}</span></label>
      <label class="f-pill"><input type="radio" name="period" value="12m"><span data-label="${t.f.p12}">${t.f.p12}</span></label>
      <label class="f-pill"><input type="radio" name="period" value="y0" data-year-offset="0"><span data-label=""></span></label>
      <label class="f-pill"><input type="radio" name="period" value="y1" data-year-offset="1"><span data-label=""></span></label>
      <label class="f-pill"><input type="radio" name="period" value="custom"><span data-label="${t.f.pCustom}">${t.f.pCustom}</span></label>
    </div>
      <div class="f-dates" id="fdates">
        <label>${t.f.from}<input type="date" name="from" aria-label="${t.f.fromAria}" min="1900-01-01" max="2099-12-31"></label>
        <label>${t.f.to}<input type="date" name="to" aria-label="${t.f.toAria}" min="1900-01-01" max="2099-12-31"></label>
      </div>
      <p class="f-err" id="ferr" role="alert" hidden>${t.f.dateErr}</p>
    </fieldset>
    <div class="f-actions"><button type="button" class="f-done" id="fdone">${t.f.done}</button></div>
  </div>
</form>
<div class="f-active" id="factive" aria-label="${t.f.active}" data-remove="${t.f.remove}"></div>
<div class="result-bar"><span class="result-count" id="count" aria-live="polite" data-of="${t.countOf}" data-docs="${t.countDocs}" data-total="${t.countTotal}"></span> <a href="${page('list')}" id="reset" class="reset" hidden>${t.f.reset}</a>
  <label class="sort-by" hidden><span class="rb-label">${t.sortLabel}</span> <select id="sort" aria-label="${t.sortLabel}"><option value="new">${t.sortNew}</option><option value="added">${t.sortAdded}</option><option value="old">${t.sortOld}</option><option value="title">${t.sortTitle}</option><option value="title-desc">${t.sortTitleDesc}</option></select></label>
  <label class="per-page" hidden><span class="rb-label">${t.perPage}</span> <select id="per" aria-label="${t.perPage}"><option value="10">10</option><option value="50">50</option><option value="100">100</option></select></label></div>
<ul class="cards" id="list">
${docs.map((d) => card(d, ` data-jur="${d.jurisdiction}" data-level="${levelOf(d)}" data-type="${d.doc_type}" data-topics="${d.topics.join(' ')}" data-rights="${free(d) ? 'free' : 'link'}" data-year="${String(d.date || '').slice(0, 4)}" data-date="${String(d.date || '')}" data-added="${String(d.added || '')}" data-title="${esc(d.title)}" data-text="${esc([d.title, d.title_en, d.short_title, d.reference, d.issuer].filter(Boolean).join(' ').toLowerCase())}"`)).join('\n')}
</ul>
<nav class="pager" id="pager" aria-label="${t.pagesLabel}" data-prev="${t.prev}" data-next="${t.next}" hidden></nav>
<script src="${url('assets/filter.js')}?v=${ASSET_HASH['filter.js']}" defer></script>`,
  }));

  // Dokumentseiten
  for (const d of docs) {
    const rights = `${L('rights', d.rights.status)}${d.rights.basis && lang === 'de' ? ` – ${d.rights.basis}` : ''}${d.rights.license ? ` (${d.rights.license})` : ''}`;
    const rows = [
      [t.meta.type, L('doc_types', d.doc_type), null, listLink({ type: d.doc_type })],
      [t.meta.jur, L('jurisdictions', d.jurisdiction) + (d.subdivision ? ` – ${L('subdivisions', d.subdivision)}` : ''), null, listLink(d.subdivision ? { jur: d.jurisdiction, level: d.subdivision } : { jur: d.jurisdiction })],
      [t.meta.issuer, d.issuer],
      [t.meta.ref, d.reference],
      [t.meta.date, fmtDate(d.date, d.date_precision)],
      [t.meta.status, L('statuses', d.status)],
      [t.meta.langs, d.languages.map((l) => LANG_NAMES[lang][l] || l).join(', ')],
      [t.meta.rights, rights],
      [t.meta.checked, fmtDate(d.last_checked)],
    ].filter(([k, v]) => k && v);
    const relIds = [...new Set([...(d.related || []), ...(backlinks[d.id] || [])])].filter((r) => r !== d.id);
    const related = relIds.map((r) => byId[r]).filter(Boolean);
    const filters = [
      [t.filterNames.jur, L('jurisdictions', d.jurisdiction)],
      [t.filterNames.level, levelLabel(levelOf(d))],
      [t.filterNames.type, L('doc_types', d.doc_type)],
      ...d.topics.map((x) => [t.filterNames.topic, L('topics', x)]),
      [t.filterNames.rights, free(d) ? t.f.free : t.f.link],
    ];
    let contentHtml = '';
    if (d.content) {
      contentHtml = lang === 'de'
        ? `<section class="prose content-body" id="volltext">${mdToHtml(md(d.content), 1, REPO_URL)}</section>`
        : `<aside class="note">${esc(t.contentOnlyDe)} <a href="${docUrl(d, 'de')}#volltext" lang="de">Deutsche Fassung →</a></aside>`;
    }
    const primary = d.content
      ? (lang === 'de' ? `<a class="btn primary" href="#volltext">${t.readFull}</a>` : `<a class="btn primary" href="${docUrl(d, 'de')}#volltext">${t.readFull}</a>`) + `<a class="btn" href="${esc(d.source_url)}" rel="noopener">${t.onGithub}</a>`
      : `<a class="btn primary" href="${esc(d.source_url)}" rel="noopener">${t.toSource}</a>`;
    const note = statusNote(d);
    write(`${P}d/${d.id}/index.html`, layout(lang, {
      title: d.short_title || title(d), description: summary(d), alt: docUrl(d, t.other),
      body: `
<nav class="crumbs" aria-label="Breadcrumb"><a href="${page('list')}">${t.crumbsAll}</a> / ${esc(L('doc_types', d.doc_type))}</nav>
<article class="doc" data-pagefind-body>
  <div class="card-meta" data-pagefind-ignore>${chips(d)}</div>
  <h1 data-pagefind-meta="title">${esc(title(d))}</h1>
  ${lang === 'de' && d.title_en ? `<p class="title-alt" lang="en" data-pagefind-ignore>${esc(d.title_en)}</p>` : ''}
  ${lang === 'en' && d.title_en ? `<p class="title-alt" lang="${d.languages[0] || 'de'}" data-pagefind-ignore><span class="label">${t.meta.orig}:</span> ${esc(d.title)}</p>` : ''}
  <p class="summary">${esc(summary(d))}</p>
  <div class="actions" data-pagefind-ignore>
    ${primary}
    ${d.file ? `<a class="btn" href="${url(d.file)}">${t.archiveCopy}</a>` : ''}
    ${lang === 'de' ? (d.downloads || []).map((x) => `<a class="btn" href="${url(x.path)}" download>${esc(x.label)} ↓</a>`).join('') : ''}
    ${(d.alternate_urls || []).map((a) => `<a class="btn" href="${esc(a.url)}" rel="noopener">${esc(a.label)} ↗</a>`).join('')}
  </div>
  ${unreviewed(d) ? `<aside class="note warn" role="note">${t.unreviewedNote}</aside>` : ''}
  ${note ? `<aside class="note"><strong>${t.noteLabel}</strong> ${esc(note)}</aside>` : ''}
  <dl class="meta" data-pagefind-ignore>${rows.map(([k, v, lg, href]) => `<div><dt>${k}</dt><dd${lg ? ` lang="${lg}"` : ''}>${href ? `<a href="${href}">${esc(v)}</a>` : esc(v)}</dd></div>`).join('')}</dl>
  <div class="topics" data-pagefind-ignore><h2>${t.topics}</h2><ul class="tag-list">${d.topics.map((x) => `<li><a href="${page('list', `?topic=${x}`)}">${esc(L('topics', x))}</a></li>`).join('')}</ul></div>
  ${contentHtml}
  <div hidden>${filters.map(([k, v]) => `<span data-pagefind-filter="${k}">${esc(v)}</span>`).join('')}<span data-pagefind-meta="${t.meta.date}">${esc(fmtDate(d.date, d.date_precision))}</span><span data-pagefind-sort="date">${d.date}</span></div>
</article>
${related.length ? `<section><h2 class="section-title">${t.related} <span class="rel-count">(${related.length})</span></h2><ul class="cards">${related.slice(0, 8).map((r) => card(r)).join('')}</ul>${related.length > 8 ? `<details class="more-rel"><summary>${t.moreRelated(related.length - 8)}</summary><ul class="cards">${related.slice(8).map((r) => card(r)).join('')}</ul></details>` : ''}</section>` : ''}
<p class="edit"><a href="${REPO_URL}/edit/main/${d._file}">${t.editMeta}</a> · <a href="${REPO_URL}/issues/new?template=fehler-melden.yml&title=${encodeURIComponent('Fehler: ' + d.id)}">${t.reportError}</a></p>`,
    }));
  }

  // Textseiten
  const src = lang === 'de'
    ? { about: 'docs/ueber.md', aboutUs: 'docs/ueber-uns.md', contribute: 'docs/mitwirken.md', legal: 'docs/impressum.md' }
    : { about: 'docs/en/about.md', aboutUs: 'docs/en/about-us.md', contribute: 'docs/en/contribute.md', legal: 'docs/en/legal.md' };
  const subnav = (key) => ['about', 'aboutUs'].includes(key)
    ? `<nav class="subnav" aria-label="${t.subAboutLabel}">${['about', 'aboutUs'].map((k) => `<a href="${page(k)}"${k === key ? ' aria-current="page"' : ''}>${t.subAbout[k]}</a>`).join('')}</nav>` : '';
  for (const key of ['about', 'aboutUs', 'contribute', 'legal']) {
    const text = md(src[key]);
    const h1 = (text.match(/^#\s+(.*)$/m) || [, ''])[1];
    write(`${P}${t.paths[key]}index.html`, layout(lang, {
      title: h1, active: key, alt: otherPage(key),
      body: `${subnav(key)}<div class="prose">${mdToHtml(text, 0, REPO_URL).replace(/<h1>/, '<h1 class="section-title">')}</div>`,
    }));
  }
  // Weiterleitung der früheren Adresse der Seite «Über OEA» (bis 0.10.x)
  const oldOea = lang === 'de' ? 'ueber/oea/' : 'about/oea/';
  write(`${P}${oldOea}index.html`, `<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=${page('about')}"><link rel="canonical" href="${page('about')}"><a href="${page('about')}">${t.subAbout.about}</a>`);
  write(`${P}404.html`, layout(lang, { title: t.notFound, body: `<h1 class="section-title">${t.notFound}</h1><p><a href="${page('home')}">${t.toSearch}</a></p>` }));
}

LANGS.forEach(build);

// ---------- Offene Daten ----------
const clean = docs.map(({ _file, ...d }) => ({ ...d, url: url(`d/${d.id}/`), url_en: url(`en/d/${d.id}/`) }));
write('data/documents.json', JSON.stringify({ generated: new Date().toISOString(), license: 'CC0-1.0', count: clean.length, documents: clean }, null, 2));
const cols = ['id', 'title', 'title_en', 'doc_type', 'jurisdiction', 'issuer', 'reference', 'date', 'status', 'topics', 'languages', 'source_url', 'rights_status'];
const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
write('data/documents.csv', '﻿' + [cols.join(','), ...docs.map((d) => cols.map((c) => csvCell(c === 'rights_status' ? d.rights.status : Array.isArray(d[c]) ? d[c].join(';') : d[c])).join(','))].join('\n'));

// ---------- Assets ----------
for (const f of fs.readdirSync(path.join(ROOT, 'site', 'assets'))) fs.cpSync(path.join(ROOT, 'site', 'assets', f), path.join(DIST, 'assets', f), { recursive: true });
const fontDir = path.join(ROOT, 'node_modules', '@fontsource', 'open-sans', 'files');
fs.mkdirSync(path.join(DIST, 'assets', 'fonts'), { recursive: true });
for (const w of ['300-normal', '400-normal', '600-normal', '700-normal']) {
  const f = `open-sans-latin-${w}.woff2`;
  if (fs.existsSync(path.join(fontDir, f))) fs.copyFileSync(path.join(fontDir, f), path.join(DIST, 'assets', 'fonts', f));
}
if (fs.existsSync(path.join(ROOT, 'content'))) fs.cpSync(path.join(ROOT, 'content'), path.join(DIST, 'content'), { recursive: true });
if (fs.existsSync(path.join(ROOT, 'files'))) fs.cpSync(path.join(ROOT, 'files'), path.join(DIST, 'files'), { recursive: true });
fs.writeFileSync(path.join(DIST, '.nojekyll'), '');

console.log(`✓ Website mit ${docs.length} Dokumentseiten je Sprache (${LANGS.join(', ')}) in dist/ erzeugt (BASE_PATH=${BASE})`);
