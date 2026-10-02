// Clientseitiger Filter für die Dokumentliste. Filterwerte werden in der URL gespiegelt (teilbare Links).
// Klick auf ein Schlagwort (Typ, Rechtsraum, Kanton/Bundesland, Rechte) setzt den entsprechenden Filter,
// ohne die übrigen Filter zu verlieren.
(() => {
  const form = document.getElementById('filters');
  const items = [...document.querySelectorAll('#list > li')];
  const count = document.getElementById('count');
  const reset = document.getElementById('reset');
  const level = form.elements.level;

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
      li.hidden = !ok; if (ok) n++;
    }
    count.textContent = `${n} ${count.dataset.of} ${items.length} ${count.dataset.docs}`;
    const p = new URLSearchParams(); for (const [k, v] of Object.entries(f)) if (v) p.set(k, v);
    if (reset) reset.hidden = !p.toString();
    history.replaceState(null, '', p.toString() ? `?${p}` : location.pathname);
  }

  setFromParams(new URLSearchParams(location.search));
  form.addEventListener('input', apply);
  form.addEventListener('submit', (e) => e.preventDefault());

  // Schlagwörter in der Liste filtern direkt auf dieser Seite
  document.getElementById('list').addEventListener('click', (e) => {
    const a = e.target.closest('a.chip');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setFromParams(new URL(a.href).searchParams, true);
    apply();
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  if (reset) reset.addEventListener('click', (e) => { e.preventDefault(); setFromParams(new URLSearchParams()); apply(); });
  apply();
})();
