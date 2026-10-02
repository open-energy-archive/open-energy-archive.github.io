// Kleiner Markdown-Konverter für die eigenen Projekttexte.
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function mdToHtml(src, shift = 0, REPO_URL = '') {
  // Kleiner Markdown-Konverter für die eigenen Projekttexte:
  // Überschriften, Listen, Absätze, Tabellen, Hinweisblöcke (>), Links, Fett, Code.
  const inline = (s) => esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, h) => `<a href="${h.startsWith('http') || h.startsWith('#') ? h : REPO_URL + '/blob/main/' + h.replace(/^\.\//, '')}">${t}</a>`)
    .replace(/(^|[\s(])(https:\/\/[^\s<)]+)/g, '$1<a href="$2" rel="noopener">$2</a>');
  const out = []; let list = null; let para = []; let quote = []; let table = [];
  const flushP = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; } };
  const flushL = () => { if (list) { out.push(`<${list.t}${list.start > 1 ? ` start="${list.start}"` : ''}>${list.items.map((i) => `<li${i.sub ? ' class="sub"' : ''}>${inline(i.text)}</li>`).join('')}</${list.t}>`); list = null; } };
  const flushQ = () => { if (quote.length) { out.push(`<aside class="explain">${mdToHtml(quote.join('\n'), 0, REPO_URL)}</aside>`); quote = []; } };
  const flushT = () => {
    if (!table.length) return;
    const rows = table.filter((r) => !/^\|\s*-+/.test(r)).map((r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
    const [head, ...body] = rows;
    out.push(`<div class="table-wrap"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
    table = [];
  };
  const flushAll = () => { flushP(); flushL(); flushQ(); flushT(); };
  let inCode = false; let code = [];
  for (const line of src.split('\n')) {
    if (line.startsWith('```')) { if (inCode) { out.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`); code = []; } else flushAll(); inCode = !inCode; continue; }
    if (inCode) { code.push(line); continue; }
    if (/^>/.test(line)) { flushP(); flushL(); flushT(); quote.push(line.replace(/^>\s?/, '')); continue; }
    if (quote.length) flushQ();
    if (/^\|/.test(line)) { flushP(); flushL(); table.push(line); continue; }
    if (table.length) flushT();
    const h = line.match(/^(#{1,4})\s+(.*?)(?:\s+\{#([\w-]+)\})?$/);
    const li = line.match(/^(\s*)(?:[-*]|(\d+)\.)\s+(.*)/);
    if (h) { flushAll(); const lvl = Math.min(h[1].length + shift, 6); out.push(`<h${lvl}${h[3] ? ` id="${h[3]}"` : ''}>${inline(h[2])}</h${lvl}>`); }
    else if (/^---\s*$/.test(line)) { flushAll(); out.push('<hr>'); }
    else if (li) {
      flushP(); const sub = li[1].length >= 2;
      const t = sub ? (list?.t || 'ul') : (li[2] ? 'ol' : 'ul');
      if (!list || (!sub && list.t !== t)) { flushL(); list = { t, items: [], start: li[2] ? +li[2] : 1 }; }
      list.items.push({ text: li[3], sub });
    }
    else if (!line.trim()) { flushP(); flushL(); }
    else if (list && /^\s{2,}\S/.test(line)) { list.items[list.items.length - 1].text += ' ' + line.trim(); }
    else { flushL(); para.push(line.trim()); }
  }
  flushAll();
  return out.join('\n');
}
