// Clientseitiger Filter für die Dokumentliste. Filterwerte werden in der URL gespiegelt (teilbare Links).
(() => {
  const form = document.getElementById('filters');
  const items = [...document.querySelectorAll('#list > li')];
  const count = document.getElementById('count');
  const params = new URLSearchParams(location.search);
  for (const el of form.elements) if (params.has(el.name)) el.value = params.get(el.name);

  function apply() {
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
    history.replaceState(null, '', p.toString() ? `?${p}` : location.pathname);
  }
  form.addEventListener('input', apply);
  form.addEventListener('submit', (e) => e.preventDefault());
  apply();
})();
