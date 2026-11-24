'use strict';

// Pre-render TikZ blocks to standalone SVG files, so the site ships static
// diagrams instead of loading TikZJax in the browser.
//
// Pipeline:  scan <site>/content for `tikz` shortcodes → render each unique
//            source with node-tikzjax (TeX → DVI → SVG, Node + WebAssembly) →
//            write assets/tikz/<sha256-prefix>.svg plus a manifest of the font
//            families the SVGs reference.
//
// Only the shortcode renders a diagram: a fence tagged `tikz` is an ordinary
// code block and is left to Hugo's code block renderer, so the scanner skips it.
//
// The Hugo side (`layouts/_partials/tikz.html`) looks each block up by the same
// hash and inlines the SVG. When no manifest exists the theme keeps loading
// TikZJax, so this script is opt-in: run it (or `npm run build:tikz`) before
// `hugo`, and `hugo server` keeps using the client renderer for live editing.
//
// Usage:
//   node scripts/build-tikz.js [--source <dir>] [--clean] [--verbose]
//
//   --source  Hugo site root to scan (default: the current directory). The
//             content dir is <source>/content, the cache <source>/assets/tikz.
//   --clean   Delete the cache before rendering (drops stale diagrams/fonts).
//   --verbose Print the TeX engine log for every block.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const C = process.stdout.isTTY ? {
  dim: (s) => `\x1b[90m${s}\x1b[0m`,
  dimBold: (s) => `\x1b[90;1m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
} : { dim: (s) => s, dimBold: (s) => s, green: (s) => s, cyan: (s) => s, red: (s) => s, yellow: (s) => s };

// --- CLI ----------------------------------------------------------------------

function argValue(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 && i + 1 < process.argv.length ? process.argv[i + 1] : null;
}

const siteRoot = path.resolve(process.cwd(), argValue('--source') || '.');
const contentDir = path.join(siteRoot, 'content');
const cacheDir = path.join(siteRoot, 'assets', 'tikz');
const fontDir = path.join(cacheDir, 'fonts');
const manifestFile = path.join(cacheDir, 'manifest.json');
const clean = process.argv.includes('--clean');
const verbose = process.argv.includes('--verbose');

// Same normalization as `layouts/_partials/tikz.html`: TrimSpace on a
// CRLF→LF source. Keep these in sync or the hash lookup misses.
function sourceHash(src) {
  return crypto.createHash('sha256').update(src.trim(), 'utf8').digest('hex').slice(0, 16);
}

// --- Collect blocks -----------------------------------------------------------

const CONTENT_EXT = new Set(['.md', '.markdown', '.html', '.htm']);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && CONTENT_EXT.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

const SHORTCODE_OPEN = /\{\{<\s*tikz\b[^>]*>\}\}/;
const SHORTCODE_CLOSE = /\{\{<\s*\/\s*tikz\s*>\}\}/;

// Line scanner: shortcodes are only recognised outside a fenced block, so an
// example like `{{</* tikz */>}}` (or a fence that literally contains the tag)
// is never rendered.
function collectFrom(text) {
  const lines = text.split(/\r?\n/);
  const blocks = [];
  let fence = null; // marker of the open fence; everything inside is skipped

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (fence) {
      const closes = line.match(/^\s*(`{3,}|~{3,})\s*$/);
      if (closes && closes[1][0] === fence[0] && closes[1].length >= fence.length) fence = null;
      continue;
    }

    const fenceOpen = line.match(/^\s*(`{3,}|~{3,})\s*[^\s{]*/);
    if (fenceOpen) {
      fence = fenceOpen[1];
      continue;
    }

    const open = line.match(SHORTCODE_OPEN);
    if (!open) continue;

    const start = i + 1;
    const inner = [];
    const rest = line.slice(open.index + open[0].length);
    const closeOnRest = rest.match(SHORTCODE_CLOSE);
    if (closeOnRest) {
      inner.push(rest.slice(0, closeOnRest.index));
      blocks.push({ source: inner.join('\n'), line: start });
      continue;
    }

    if (rest.trim()) inner.push(rest);
    for (i = i + 1; i < lines.length; i++) {
      const close = lines[i].match(SHORTCODE_CLOSE);
      if (close) {
        const prefix = lines[i].slice(0, close.index);
        if (prefix.trim()) inner.push(prefix);
        break;
      }
      inner.push(lines[i]);
    }
    blocks.push({ source: inner.join('\n'), line: start });
  }
  return blocks;
}

function collect() {
  if (!fs.existsSync(contentDir)) return null;
  const found = [];
  for (const file of walk(contentDir)) {
    const text = fs.readFileSync(file, 'utf8');
    if (!/tikz/i.test(text)) continue; // cheap skip
    for (const block of collectFrom(text)) {
      const src = block.source.trim();
      if (!src) continue;
      found.push({
        source: src,
        hash: sourceHash(src),
        where: `${path.relative(siteRoot, file)}:${block.line}`,
      });
    }
  }
  return found;
}

// --- Render ------------------------------------------------------------------

// Font families the SVG asks for, e.g. cmr10 / cmmi10 / cmr7.
function fontFamilies(svg) {
  const families = new Set();
  const add = (value) => {
    for (const part of value.split(',')) {
      const name = part.trim().replace(/^['"]|['"]$/g, '');
      if (name) families.add(name);
    }
  };
  for (const m of svg.matchAll(/font-family\s*=\s*"([^"]*)"/g)) add(m[1]);
  for (const m of svg.matchAll(/font-family\s*:\s*([^;"'}]+)/g)) add(m[1]);
  return families;
}

// node-tikzjax wants a full document; `\usepackage` / `\usetikzlibrary` must sit
// in the preamble. Users write neither (the browser wrapper supplies them), but
// supporting them costs little and makes the two renderers agree.
function prepare(src) {
  const preamble = [];
  const body = src
    .split('\n')
    .filter((line) => {
      const t = line.trim();
      if (/^\\(usepackage|usetikzlibrary)\b/.test(t)) {
        preamble.push(t);
        return false;
      }
      return true;
    })
    .join('\n');
  const input = /\\begin\s*\{document\}/.test(body)
    ? body
    : `\\begin{document}\n${body}\n\\end{document}`;
  return { input, preamble: preamble.join('\n') };
}

// A Hugo-module consumer runs this script from the module cache, so resolve the
// package from the site root first, then from this checkout.
function resolveFromSite(request) {
  return require.resolve(request, { paths: [siteRoot, process.cwd(), __dirname] });
}

let rendererVersion = null;
function installedVersion() {
  if (rendererVersion !== null) return rendererVersion;
  try {
    rendererVersion = JSON.parse(fs.readFileSync(resolveFromSite('node-tikzjax/package.json'), 'utf8')).version || '';
  } catch (err) {
    rendererVersion = '';
  }
  return rendererVersion;
}

let tex2svg = null;
function loadRenderer() {
  if (tex2svg) return tex2svg;
  let mod;
  try {
    mod = require(resolveFromSite('node-tikzjax'));
  } catch (err) {
    throw new Error('node-tikzjax is not installed.');
  }
  tex2svg = mod.default || mod;
  if (typeof tex2svg !== 'function') throw new Error('node-tikzjax did not export tex2svg()');
  return tex2svg;
}

// --- Fonts -------------------------------------------------------------------

function nodeTikzFontDir() {
  return path.join(path.dirname(resolveFromSite('node-tikzjax/package.json')), 'css', 'bakoma', 'ttf');
}

function existingSvgText() {
  if (!fs.existsSync(cacheDir)) return [];
  return fs
    .readdirSync(cacheDir)
    .filter((name) => name.endsWith('.svg'))
    .map((name) => fs.readFileSync(path.join(cacheDir, name), 'utf8'));
}

function publishFonts() {
  const families = new Set();
  for (const svg of existingSvgText()) for (const f of fontFamilies(svg)) families.add(f);
  if (!families.size) return [];

  let source = null;
  try {
    source = nodeTikzFontDir();
  } catch (err) {
    // Every block was served from the cache, so node-tikzjax need not be installed.
    console.warn(`${C.yellow('!')} node-tikzjax is not installed; keeping the existing font files in ${fontDir}`);
    return fs.existsSync(fontDir)
      ? fs.readdirSync(fontDir).filter((n) => n.endsWith('.ttf')).map((n) => path.basename(n, '.ttf')).sort()
      : [];
  }

  fs.mkdirSync(fontDir, { recursive: true });
  const kept = [];
  for (const family of [...families].sort()) {
    const from = path.join(source, `${family}.ttf`);
    if (!fs.existsSync(from)) {
      console.warn(`${C.yellow('!')} font ${family}.ttf is not bundled with node-tikzjax; the SVG will fall back to a system font`);
      continue;
    }
    fs.copyFileSync(from, path.join(fontDir, `${family}.ttf`));
    kept.push(family);
  }

  // Drop fonts that no cached diagram references any more.
  const keep = new Set(kept.map((family) => `${family}.ttf`));
  for (const name of fs.readdirSync(fontDir)) {
    if (name.endsWith('.ttf') && !keep.has(name)) fs.rmSync(path.join(fontDir, name));
  }
  return kept;
}

// Drop diagrams whose source no longer exists, so a removed block does not leave
// a stale asset behind (and does not keep its fonts alive).
function pruneSvgs(hashes) {
  for (const name of fs.readdirSync(cacheDir)) {
    if (/^[0-9a-f]{16}\.svg$/.test(name) && !hashes.has(name.slice(0, -4))) {
      fs.rmSync(path.join(cacheDir, name));
    }
  }
}

// --- Main --------------------------------------------------------------------

async function main() {
  const start = Date.now();
  const blocks = collect();
  if (blocks === null) {
    console.log(C.dim(`No content directory at ${contentDir} — TikZ pre-rendering skipped.`));
    return;
  }
  const unique = new Map();
  for (const block of blocks) {
    if (!unique.has(block.hash)) unique.set(block.hash, block);
  }

  if (!blocks.length) {
    if (fs.existsSync(manifestFile)) fs.rmSync(manifestFile);
    console.log(C.dim(`No TikZ blocks under ${contentDir} — client-side TikZJax stays in use.`));
    return;
  }

  if (clean && fs.existsSync(cacheDir)) fs.rmSync(cacheDir, { recursive: true, force: true });
  fs.mkdirSync(cacheDir, { recursive: true });

  // node-tikzjax is an optional dependency: Hugo-module consumers get it only
  // when they install it themselves. A complete cache still works without it;
  // blocks that have no SVG yet cannot be rendered, so drop the manifest and let
  // the templates use the client renderer instead of failing `hugo`.
  try {
    loadRenderer();
  } catch (err) {
    const missing = [...unique.keys()].filter((hash) => !fs.existsSync(path.join(cacheDir, `${hash}.svg`)));
    if (missing.length) {
      if (fs.existsSync(manifestFile)) fs.rmSync(manifestFile);
      console.warn(
        `${C.yellow('!')} ${err.message} Client-side TikZJax stays in use for ${missing.length} block(s); ` +
        `run \`npm install node-tikzjax\` and rebuild to inline them.`
      );
      return;
    }
    console.warn(`${C.yellow('!')} ${err.message} Reusing the existing SVG cache.`);
  }

  // A node-tikzjax upgrade can change the SVG (and its font list), so treat an
  // older cache as empty rather than serving output from the previous renderer.
  const version = installedVersion();
  let previous = null;
  try {
    previous = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  } catch (err) {
    previous = null;
  }
  const stale = Boolean(previous && previous.renderer && version && previous.renderer !== version);
  if (stale) console.log(C.yellow(`node-tikzjax ${previous.renderer} → ${version}; re-rendering every diagram`));

  let rendered = 0;
  let reused = 0;
  const failures = [];
  for (const [hash, block] of unique) {
    const file = path.join(cacheDir, `${hash}.svg`);
    if (!stale && fs.existsSync(file)) {
      reused++;
      continue;
    }
    const { input, preamble } = prepare(block.source);
    const blockStart = Date.now();
    if (stale) fs.rmSync(file, { force: true });
    try {
      const svg = await loadRenderer()(input, {
        addToPreamble: preamble,
        showConsole: verbose,
      });
      const tmp = `${file}.tmp`;
      fs.writeFileSync(tmp, svg.endsWith('\n') ? svg : `${svg}\n`);
      fs.renameSync(tmp, file);
      rendered++;
      console.log(`${C.dimBold('✔')} ${C.green(hash)} ${C.dim(block.where)} ${C.dim(`[${Date.now() - blockStart} ms]`)}`);
    } catch (err) {
      failures.push({ block, err });
      console.error(`${C.red('✖')} ${block.where}: ${err && err.message ? err.message : err}`);
    }
  }

  if (failures.length) {
    throw new Error(`${failures.length} TikZ block(s) failed to render; the rest were written. Fix them and rerun, or delete assets/tikz to fall back to the client renderer.`);
  }

  pruneSvgs(new Set(unique.keys()));
  const fonts = publishFonts();
  const manifest = {
    version: 1,
    blocks: blocks.length,
    unique: unique.size,
    fonts,
    renderer: version || (previous && previous.renderer) || null,
  };
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');

  console.log(
    `${C.dimBold('✔')} ${C.cyan(`${unique.size} diagram(s) → ${path.relative(siteRoot, cacheDir) || '.'}`)} ` +
    C.dim(`(${rendered} rendered, ${reused} cached; ${fonts.length} font(s)) [${Date.now() - start} ms]`)
  );
}

main().catch((err) => {
  console.error(`${C.red('✖ error:')} ${err && err.message ? err.message : err}`);
  process.exitCode = 1;
});
