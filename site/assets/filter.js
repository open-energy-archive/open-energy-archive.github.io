// Clientseitiger Filter für die Dokumentliste. Filterwerte werden in der URL gespiegelt (teilbare Links).
// Klick auf ein Schlagwort (Typ, Rechtsraum, Kanton/Bundesland, Rechte) setzt den entsprechenden Filter,
// ohne die übrigen Filter zu verlieren.
(() => {
  const form = document.getElementById('filters');
  const items = [...document.querySelectorAll('#list > li')];
  const count = document.getElementById('count');
  const reset = document.getElementById('reset');
  const level = form.elements.level;
  const perSel = document.getElementById('per');
  const pager = document.getElementById('pager');
  const PER_OPTIONS = ['10', '50', '100'];
  let page = 1;

  function setFromParams(params, merge = false) {
    for (const el of form.elements) {
      if (!el.name) continue;
      if (params.has(el.name)) el.value = params.get(el.name);
      else if (!merge) el.value = '';
    }
    // Ein neuer Rechtsraum ohne Ebene hebt eine Ebene aus einem anderen Rechtsraum auf
    if (merge && params.has('jur') && !params.has('level')) syncLevel(true);
  }

  // Ebenen-Auswahl auf den gewählten Rechtsraum einschränken
  function syncLevel(clearForeign = false) {
    const jur = form.elements.jur.value;
    for (const g of level.querySelectorAll('optgroup')) g.hidden = !!jur && g.dataset.jur !== jur;
    const sel = level.selectedOptions[0];
    if (sel && sel.dataset.jur && jur && sel.dataset.jur !== jur) level.value = '';
    else if (clearForeign && sel && sel.dataset.jur && sel.dataset.jur !== jur) level.value = '';
  }

  function apply() {
    syncLevel();
    const per = +perSel.value;
    const f = Object.fromEntries(new FormData(form));
    const q = (f.q || '').trim().toLowerCase();
    let n = 0;
    for (const li of items) {
      const ok = (!f.jur || li.dataset.jur === f.jur)
        && (!f.level || li.dataset.level === f.level)
        && (!f.type || li.dataset.type === f.type)
        && (!f.topic || li.dataset.topics.split(' ').includes(f.topic))
        && (!f.rights || li.dataset.rights === f.rights)
        && (!q || q.split(/\s+/).every((w) => li.dataset.text.includes(w)));
      li.dataset.match = ok ? '1' : '';
      if (ok) n++;
    }
    // Seitenweise Anzeige
    const pages = Math.max(1, Math.ceil(n / per));
    if (page > pages) page = pages;
    const from = (page - 1) * per;
    let i = 0;
    for (const li of items) {
      if (!li.dataset.match) { li.hidden = true; continue; }
      li.hidden = i < from || i >= from + per; i++;
    }
    const range = n ? `${from + 1}–${Math.min(from + per, n)}` : '0';
    count.textContent = `${range} ${count.dataset.of} ${n} ${count.dataset.docs}` + (n < items.length ? ` (${items.length} ${count.dataset.total})` : '');
    renderPager(pages);
    const p = new URLSearchParams(); for (const [k, v] of Object.entries(f)) if (v) p.set(k, v);
    if (reset) reset.hidden = !p.toString();
    if (per !== 10) p.set('per', per);
    if (page > 1) p.set('page', page);
    history.replaceState(null, '', p.toString() ? `?${p}` : location.pathname);
  }

  // Seitennavigation: Zurück, Seitenzahlen (mit Auslassungen), Weiter
  function renderPager(pages) {
    pager.hidden = pages <= 1;
    if (pages <= 1) { pager.innerHTML = ''; return; }
    const nums = new Set([1, pages, page - 1, page, page + 1]);
    const list = [...nums].filter((x) => x >= 1 && x <= pages).sort((a, b) => a - b);
    const btn = (label, target, extra = '') => `<button type="button" data-page="${target}"${extra}>${label}</button>`;
    let html = btn(pager.dataset.prev, page - 1, page === 1 ? ' disabled' : '');
    let last = 0;
    for (const x of list) {
      if (x - last > 1) html += '<span class="gap" aria-hidden="true">…</span>';
      html += btn(x, x, x === page ? ' aria-current="page"' : '');
      last = x;
    }
    html += btn(pager.dataset.next, page + 1, page === pages ? ' disabled' : '');
    pager.innerHTML = html;
  }
  pager.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-page]');
    if (!b || b.disabled) return;
    page = +b.dataset.page; apply();
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  perSel.addEventListener('change', () => { page = 1; apply(); });

  const initial = new URLSearchParams(location.search);
  setFromParams(initial);
  perSel.value = PER_OPTIONS.includes(initial.get('per')) ? initial.get('per') : '10';
  page = Math.max(1, parseInt(initial.get('page'), 10) || 1);
  perSel.closest('label').hidden = false;
  form.addEventListener('input', () => { page = 1; apply(); });
  form.addEventListener('submit', (e) => e.preventDefault());

  // Schlagwörter in der Liste filtern direkt auf dieser Seite
  document.getElementById('list').addEventListener('click', (e) => {
    const a = e.target.closest('a.chip');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setFromParams(new URL(a.href).searchParams, true);
    page = 1; apply();
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  if (reset) reset.addEventListener('click', (e) => { e.preventDefault(); setFromParams(new URLSearchParams()); page = 1; apply(); });
  apply();
})();
