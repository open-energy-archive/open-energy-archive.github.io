// Clientseitiger Filter für die Dokumentliste. Filterwerte werden in der URL gespiegelt (teilbare Links).
// Klick auf ein Schlagwort (Typ, Rechtsraum, Kanton/Bundesland, Rechte) setzt den entsprechenden Filter,
// ohne die übrigen Filter zu verlieren. Auf schmalen Bildschirmen ist der Filterbereich einklappbar.
(() => {
  const form = document.getElementById('filters');
  const list = document.getElementById('list');
  let items = [...list.querySelectorAll('#list > li')];
  const count = document.getElementById('count');
  const reset = document.getElementById('reset');
  const level = form.elements.level;
  const perSel = document.getElementById('per');
  const sortSel = document.getElementById('sort');
  const pager = document.getElementById('pager');
  const toggle = document.getElementById('ftoggle');
  const badge = document.getElementById('fbadge');
  const done = document.getElementById('fdone');
  const active = document.getElementById('factive');
  const dates = document.getElementById('fdates');
  const err = document.getElementById('ferr');
  const lang = document.documentElement.lang || 'de';
  const collator = new Intl.Collator(lang, { sensitivity: 'base', numeric: true });
  const dateFmt = new Intl.DateTimeFormat(lang === 'de' ? 'de-CH' : 'en-GB', { day: 'numeric', month: lang === 'de' ? 'numeric' : 'short', year: 'numeric' });
  const PER_OPTIONS = ['10', '50', '100'];
  const SORTS = ['new', 'old', 'title', 'title-desc'];
  const FIELDS = ['q', 'jur', 'level', 'type', 'topic', 'rights', 'period', 'from', 'to'];
  const DEFAULTS = { period: 'all' };
  const FACETS = ['jur', 'level', 'type', 'topic', 'rights'];
  let page = 1;
  let prevPeriod = 'all';

  // ---------- Zeitraum ----------
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const today = new Date();
  const thisYear = today.getFullYear();
  const shift = (days) => { const d = new Date(today); d.setDate(d.getDate() - days); return iso(d); };
  const yearOf = (v) => thisYear - Number(v.slice(1));
  // Jahres-Schnellwahl: laufendes und letztes Jahr (Beschriftung zur Laufzeit)
  for (const input of form.querySelectorAll('input[data-year-offset]')) {
    const y = thisYear - Number(input.dataset.yearOffset);
    input.nextElementSibling.dataset.label = String(y);
    input.nextElementSibling.textContent = String(y);
  }
  // Liefert [von, bis] als YYYY-MM-DD (leer = offen) für eine Zeitraum-Auswahl
  function rangeOf(period, from, to) {
    if (period === '30d') return [shift(30), iso(today)];
    if (period === '12m') return [shift(365), iso(today)];
    if (/^y\d$/.test(period)) { const y = yearOf(period); return [`${y}-01-01`, `${y}-12-31`]; }
    if (period === 'custom') return [from || '', to || ''];
    return ['', ''];
  }
  const fmt = (v) => { const [y, m, d] = v.split('-').map(Number); return dateFmt.format(new Date(y, m - 1, d)); };

  // ---------- Felder lesen und setzen ----------
  const field = (name) => form.elements[name];
  const getValues = () => Object.fromEntries(FIELDS.map((n) => [n, field(n) ? field(n).value : '']));
  function setField(name, value) { const el = field(name); if (el) el.value = value; }

  // Übernimmt Werte aus URL-Parametern; ältere Links mit ?from=2025 (nur Jahr) bleiben gültig
  function setFromParams(params, merge = false) {
    for (const name of FIELDS) {
      if (params.has(name)) setField(name, params.get(name));
      else if (!merge) setField(name, DEFAULTS[name] || '');
    }
    let from = field('from').value, to = field('to').value;
    const pFrom = params.get('from') || '', pTo = params.get('to') || '';
    if (/^\d{4}$/.test(pFrom)) from = `${pFrom}-01-01`;
    if (/^\d{4}$/.test(pTo)) to = `${pTo}-12-31`;
    setField('from', from); setField('to', to);
    // Datum ohne Zeitraum-Angabe = eigener Zeitraum; ein Jahr aus der Schnellwahl wird als solches erkannt
    if (!params.has('period') && (pFrom || pTo)) setField('period', 'custom');
    const p = params.get('period') || '';
    const ym = p.match(/^y(\d{4})$/);
    if (ym) {
      const off = thisYear - Number(ym[1]);
      if (off === 0 || off === 1) setField('period', `y${off}`);
      else { setField('period', 'custom'); setField('from', `${ym[1]}-01-01`); setField('to', `${ym[1]}-12-31`); }
    }
    if (!field('period').value) setField('period', 'all');
    if (merge && params.has('jur') && !params.has('level')) syncLevel(true);
  }

  // Ebenen-Auswahl auf den gewählten Rechtsraum einschränken
  function syncLevel(clearForeign = false) {
    const jur = field('jur').value;
    for (const g of level.querySelectorAll('optgroup')) g.hidden = !!jur && g.dataset.jur !== jur;
    const sel = level.selectedOptions[0];
    if (sel && sel.dataset.jur && jur && sel.dataset.jur !== jur) level.value = '';
    else if (clearForeign && sel && sel.dataset.jur && sel.dataset.jur !== jur) level.value = '';
  }

  // ---------- Filtern ----------
  const valuesOf = (li, k) => k === 'topic' ? li.dataset.topics.split(' ') : [li.dataset[k]];
  function matches(li, f, words, range, skip) {
    for (const k of FACETS) if (k !== skip && f[k] && !valuesOf(li, k).includes(f[k])) return false;
    if (skip !== 'period') {
      const d = li.dataset.date || '';
      if (range[0] && (!d || d < range[0])) return false;
      if (range[1] && (!d || d > range[1])) return false;
    }
    return !words.length || words.every((w) => li.dataset.text.includes(w));
  }

  // Facetten: Jede Auswahl zeigt nur Werte mit Treffern unter den übrigen Filtern, samt Anzahl
  function updateFacets(f, words, range) {
    for (const k of FACETS) {
      const counts = {}; let total = 0;
      for (const li of items) if (matches(li, f, words, range, k)) { total++; for (const v of valuesOf(li, k)) counts[v] = (counts[v] || 0) + 1; }
      const el = field(k);
      if (el instanceof RadioNodeList) {
        for (const r of el) {
          const n = r.value ? (counts[r.value] || 0) : total;
          const span = r.nextElementSibling;
          span.textContent = `${span.dataset.label} (${n})`;
          r.closest('label').hidden = !(n > 0 || r.checked || !r.value);
        }
        continue;
      }
      for (const o of el.options) {
        if (!o.value) continue;
        const n = counts[o.value] || 0;
        o.textContent = `${o.dataset.label} (${n})`;
        const show = n > 0 || o.value === el.value;
        o.hidden = !show; o.disabled = !show;
      }
      for (const g of el.querySelectorAll('optgroup')) {
        if (k === 'level' && f.jur && g.dataset.jur !== f.jur) { g.hidden = true; continue; }
        g.hidden = ![...g.querySelectorAll('option')].some((o) => !o.hidden);
      }
    }
    // Zeitraum-Schnellwahl: Anzahl Treffer je Zeitraum unter den übrigen Filtern
    for (const r of field('period')) {
      if (r.value === 'custom') continue;
      const rg = rangeOf(r.value);
      let n = 0;
      for (const li of items) if (matches(li, f, words, rg)) n++;
      const span = r.nextElementSibling;
      span.textContent = `${span.dataset.label} (${n})`;
    }
  }

  const esc = (v) => String(v).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // Aktive Filter als entfernbare Chips über der Liste
  function renderActive(f, range) {
    const chips = [];
    const label = (name) => { const el = field(name); const o = el.selectedOptions ? el.selectedOptions[0] : null; return o ? o.dataset.label : ''; };
    if (f.q.trim()) chips.push(['q', `«${f.q.trim()}»`]);
    if (f.jur) chips.push(['jur', [...field('jur')].find((r) => r.checked).nextElementSibling.dataset.label]);
    for (const k of ['level', 'type', 'topic', 'rights']) if (f[k]) chips.push([k, label(k)]);
    if (f.period !== 'all' && (range[0] || range[1])) {
      const r = [...field('period')].find((x) => x.checked);
      chips.push(['period', f.period === 'custom' ? `${range[0] ? fmt(range[0]) : '…'} – ${range[1] ? fmt(range[1]) : '…'}` : r.nextElementSibling.dataset.label]);
    }
    active.innerHTML = chips.map(([k, l]) => `<button type="button" class="f-chip" data-clear="${k}" aria-label="${esc(l)}: ${esc(active.dataset.remove)}">${esc(l)} <span aria-hidden="true">×</span></button>`).join('');
    active.hidden = !chips.length;
    const n = chips.filter(([k]) => k !== 'q').length;
    badge.textContent = n ? String(n) : '';
  }

  function apply() {
    syncLevel();
    const f = getValues();
    const custom = f.period === 'custom';
    if (!custom) prevPeriod = f.period;
    dates.hidden = !custom;
    const invalid = custom && f.from && f.to && f.from > f.to;
    err.hidden = !invalid;
    const range = invalid ? ['', ''] : rangeOf(f.period, f.from, f.to);
    const words = f.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let n = 0;
    for (const li of items) { const ok = matches(li, f, words, range); li.dataset.match = ok ? '1' : ''; if (ok) n++; }
    updateFacets(f, words, range);
    renderActive(f, range);
    // Seitenweise Anzeige
    const per = +perSel.value;
    const pages = Math.max(1, Math.ceil(n / per));
    if (page > pages) page = pages;
    const start = (page - 1) * per;
    let i = 0;
    for (const li of items) {
      if (!li.dataset.match) { li.hidden = true; continue; }
      li.hidden = i < start || i >= start + per; i++;
    }
    const rangeTxt = n ? `${start + 1}–${Math.min(start + per, n)}` : '0';
    count.textContent = `${rangeTxt} ${count.dataset.of} ${n} ${count.dataset.docs}` + (n < items.length ? ` (${items.length} ${count.dataset.total})` : '');
    renderPager(pages);
    // URL
    const p = new URLSearchParams();
    for (const k of ['q', 'jur', 'level', 'type', 'topic', 'rights']) if (f[k]) p.set(k, f[k]);
    if (f.period !== 'all') {
      if (/^y\d$/.test(f.period)) p.set('period', `y${yearOf(f.period)}`);
      else p.set('period', f.period);
      if (custom) { if (f.from) p.set('from', f.from); if (f.to) p.set('to', f.to); }
    }
    if (reset) reset.hidden = !p.toString();
    if (sortSel.value !== 'new') p.set('sort', sortSel.value);
    if (per !== 10) p.set('per', per);
    if (page > 1) p.set('page', page);
    history.replaceState(null, '', p.toString() ? `?${p}` : location.pathname);
  }

  // ---------- Sortierung ----------
  function sortItems() {
    const byTitle = (a, b) => collator.compare(a.dataset.title, b.dataset.title);
    const byDate = (a, b) => (a.dataset.date || '').localeCompare(b.dataset.date || '');
    const cmp = {
      new: (a, b) => byDate(b, a) || byTitle(a, b),
      old: (a, b) => byDate(a, b) || byTitle(a, b),
      title: byTitle,
      'title-desc': (a, b) => byTitle(b, a),
    }[sortSel.value] || ((a, b) => byDate(b, a));
    items = [...items].sort(cmp);
    const frag = document.createDocumentFragment();
    for (const li of items) frag.appendChild(li);
    list.appendChild(frag);
  }

  // ---------- Seitennavigation ----------
  function renderPager(pages) {
    pager.hidden = pages <= 1;
    if (pages <= 1) { pager.innerHTML = ''; return; }
    const nums = [...new Set([1, pages, page - 1, page, page + 1])].filter((x) => x >= 1 && x <= pages).sort((a, b) => a - b);
    const btn = (label, target, extra = '') => `<button type="button" data-page="${target}"${extra}>${label}</button>`;
    let html = btn(pager.dataset.prev, page - 1, page === 1 ? ' disabled' : '');
    let last = 0;
    for (const x of nums) {
      if (x - last > 1) html += '<span class="gap" aria-hidden="true">…</span>';
      html += btn(x, x, x === page ? ' aria-current="page"' : '');
      last = x;
    }
    pager.innerHTML = html + btn(pager.dataset.next, page + 1, page === pages ? ' disabled' : '');
  }
  const toList = () => (form.classList.contains('open') ? form : count).scrollIntoView({ behavior: 'smooth', block: 'start' });

  // ---------- Einklappbarer Filterbereich (schmale Bildschirme) ----------
  function setOpen(open) {
    form.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }
  form.classList.add('js');
  toggle.hidden = false;
  toggle.addEventListener('click', () => setOpen(!form.classList.contains('open')));
  done.addEventListener('click', () => { setOpen(false); count.scrollIntoView({ behavior: 'smooth', block: 'start' }); });

  // ---------- Ereignisse ----------
  const initial = new URLSearchParams(location.search);
  setFromParams(initial);
  perSel.value = PER_OPTIONS.includes(initial.get('per')) ? initial.get('per') : '10';
  sortSel.value = SORTS.includes(initial.get('sort')) ? initial.get('sort') : 'new';
  page = Math.max(1, parseInt(initial.get('page'), 10) || 1);
  perSel.closest('label').hidden = false;
  sortSel.closest('label').hidden = false;
  sortItems();

  form.addEventListener('input', (e) => {
    // Beim Wechsel auf «Eigener Zeitraum» den bisher gewählten Zeitraum als Startwert übernehmen
    if (e.target.name === 'period' && e.target.value === 'custom' && !field('from').value && !field('to').value) {
      const [a, b] = rangeOf(prevPeriod);
      setField('from', a); setField('to', b);
    }
    page = 1; apply();
  });
  form.addEventListener('submit', (e) => { e.preventDefault(); setOpen(false); });
  sortSel.addEventListener('change', () => { sortItems(); page = 1; apply(); });
  perSel.addEventListener('change', () => { page = 1; apply(); });
  pager.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-page]');
    if (!b || b.disabled) return;
    page = +b.dataset.page; apply(); toList();
  });
  active.addEventListener('click', (e) => {
    const b = e.target.closest('[data-clear]');
    if (!b) return;
    const k = b.dataset.clear;
    if (k === 'period') { setField('period', 'all'); setField('from', ''); setField('to', ''); }
    else setField(k, '');
    page = 1; apply();
  });
  // Schlagwörter in der Liste filtern direkt auf dieser Seite
  list.addEventListener('click', (e) => {
    const a = e.target.closest('a.chip');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setFromParams(new URL(a.href).searchParams, true);
    page = 1; apply();
    count.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  if (reset) reset.addEventListener('click', (e) => { e.preventDefault(); setFromParams(new URLSearchParams()); page = 1; apply(); });
  apply();
})();
