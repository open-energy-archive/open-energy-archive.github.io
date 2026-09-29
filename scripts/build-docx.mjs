// Erzeugt Word-Vorlagen (.docx) aus den eigenen Markdown-Inhalten unter content/.
// Aufruf: node scripts/build-docx.mjs <datei.md> [...]   (ohne Argumente: alle content/**/*.md ausser README)
import fs from 'node:fs';
import path from 'node:path';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, Footer, PageNumber, LevelFormat,
} from 'docx';
import { ROOT } from './lib.mjs';

const FONT = 'Arial';
const CONTENT_W = 9026; // A4 mit 2.54-cm-Rändern, in DXA

// **fett** und `code` in TextRuns zerlegen; Markdown-Links auf Text reduzieren
function runs(text, base = {}) {
  const clean = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1').replace(/`([^`]+)`/g, '$1');
  return clean.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((part) =>
    part.startsWith('**') ? new TextRun({ ...base, text: part.slice(2, -2), bold: true }) : new TextRun({ ...base, text: part }));
}

function convert(md) {
  const children = [];
  const lines = md.split('\n');
  let quote = []; let table = []; let firstH1 = true;

  const flushQuote = () => {
    if (!quote.length) return;
    const paras = quote.join('\n').split(/\n\s*\n/);
    for (const p of paras) children.push(new Paragraph({
      children: runs(p.replace(/\n/g, ' '), { color: '44546A', size: 19 }),
      shading: { type: ShadingType.CLEAR, fill: 'EEF3F1', color: 'auto' },
      border: { left: { style: BorderStyle.SINGLE, size: 18, color: '0F5C4A', space: 6 } },
      indent: { left: 120, right: 120 }, spacing: { before: 60, after: 120 },
    }));
    quote = [];
  };
  const flushTable = () => {
    if (!table.length) return;
    const rows = table.filter((r) => !/^\|\s*-+/.test(r)).map((r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
    const cols = rows[0].length; const widths = cols === 2 ? [5626, 3400] : Array(cols).fill(Math.floor(CONTENT_W / cols));
    const border = { style: BorderStyle.SINGLE, size: 4, color: 'C9CFCC' };
    children.push(new Table({
      width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: widths,
      rows: rows.map((r, i) => new TableRow({ tableHeader: i === 0, children: r.map((c, j) => new TableCell({
        width: { size: widths[j], type: WidthType.DXA },
        borders: { top: border, bottom: border, left: border, right: border },
        shading: i === 0 ? { type: ShadingType.CLEAR, fill: 'E3F0EA', color: 'auto' } : undefined,
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        children: [new Paragraph({ children: runs(c, { size: 19, bold: i === 0 }) })],
      })) })),
    }));
    children.push(new Paragraph({ text: '' }));
    table = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^>/.test(line)) { flushTable(); quote.push(line.replace(/^>\s?/, '')); continue; }
    flushQuote();
    if (/^\|/.test(line)) { table.push(line); continue; }
    flushTable();
    if (!line.trim() || /^---\s*$/.test(line)) continue;

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const lvl = h[1].length;
      const heading = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4][lvl - 1];
      children.push(new Paragraph({ heading, children: runs(h[2]), pageBreakBefore: lvl === 1 && !firstH1 }));
      if (lvl === 1) firstH1 = false;
      continue;
    }
    // Artikelüberschrift «**Art. 1 Name und Sitz**»
    if (/^\*\*(Art\.|Ziff\.)[^*]+\*\*\s*$/.test(line)) {
      children.push(new Paragraph({ children: runs(line), keepNext: true, spacing: { before: 200, after: 80 } }));
      continue;
    }
    const li = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
    if (li) {
      let text = li[3];
      while (lines[i + 1] && /^\s{2,}\S/.test(lines[i + 1]) && !/^\s*([-*]|\d+\.)\s/.test(lines[i + 1])) text += ' ' + lines[++i].trim();
      const depth = li[1].length >= 2 ? 1 : 0;
      const numbered = /\d+\./.test(li[2]);
      const letter = text.match(/^([a-z]\.)\s+(.*)$/);
      const label = numbered ? li[2] : letter ? letter[1] : null;
      const body = letter && !numbered ? letter[2] : text;
      const left = 425 + depth * 425;
      if (label) {
        children.push(new Paragraph({ children: [new TextRun({ text: label + '\t' }), ...runs(body)], indent: { left, hanging: 425 }, tabStops: [{ type: 'left', position: left }], spacing: { after: 60 } }));
      } else {
        children.push(new Paragraph({ children: runs(body), numbering: { reference: 'bullets', level: depth }, spacing: { after: 60 } }));
      }
      continue;
    }
    // Absatz (auch eingerückte Varianten-Absätze)
    let text = line.trim();
    while (lines[i + 1] && lines[i + 1].trim() && !/^(#|>|\||\s*([-*]|\d+\.)\s)/.test(lines[i + 1]) && !/^---/.test(lines[i + 1])) text += ' ' + lines[++i].trim();
    children.push(new Paragraph({ children: runs(text), indent: /^\s{2,}/.test(line) ? { left: 425 } : undefined, spacing: { after: 120 } }));
  }
  flushQuote(); flushTable();
  return children;
}

function build(file) {
  const md = fs.readFileSync(file, 'utf8');
  const title = (md.match(/^#\s+(.*)$/m) || [, 'Dokument'])[1];
  const doc = new Document({
    creator: 'Open Energy Archive', title, description: 'CC BY 4.0 – Open Energy Archive',
    styles: {
      default: { document: { run: { font: FONT, size: 21 }, paragraph: { spacing: { line: 276 } } } },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 32, bold: true, color: '0F5C4A', font: FONT }, paragraph: { spacing: { before: 240, after: 200 }, outlineLevel: 0 } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 26, bold: true, font: FONT }, paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1, keepNext: true } },
        { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 22, bold: true, color: '0F5C4A', font: FONT }, paragraph: { spacing: { before: 240, after: 100 }, outlineLevel: 2, keepNext: true } },
        { id: 'Heading4', name: 'Heading 4', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 21, bold: true, font: FONT }, paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 3, keepNext: true } },
      ],
    },
    numbering: { config: [{ reference: 'bullets', levels: [0, 1].map((level) => ({ level, format: LevelFormat.BULLET, text: '–', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 425 + level * 425, hanging: 283 } } } })) }] },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [
        new TextRun({ text: 'Open Energy Archive · CC BY 4.0 · Keine Rechtsberatung · Seite ', size: 16, color: '777777' }),
        new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '777777' }),
      ] })] }) },
      children: convert(md),
    }],
  });
  const out = file.replace(/\.md$/, '.docx');
  return Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(out, buf); console.log('✓', path.relative(ROOT, out)); });
}

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.md') && e.name !== 'README.md' ? [path.join(d, e.name)] : []);
const files = process.argv.slice(2).length ? process.argv.slice(2) : walk(path.join(ROOT, 'content'));
await Promise.all(files.map(build));
