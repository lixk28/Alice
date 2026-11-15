'use strict';

// Build one sprite from source icon directories.
//
// Pipeline:  svgo (optimize each *.svg) → svg-sprite (one <svg> with a <symbol id="<dir>_<name>"> per icon).
// The <dir> prefix namespaces each source directory, so a site's custom icons never collide with the theme's "ui-oval_" ids.
//
// Usage:
//   node scripts/build-icons.js                      # theme defaults
//   node scripts/build-icons.js --src dir1,dir2,icon.svg  # add icon sources (dirs and/or svg files), comma-separated
//   node scripts/build-icons.js --out <file>      # custom output; default: <theme>/static/svg/svg-icon-sprite.svg
//   node scripts/build-icons.js --watch            # rebuild whenever a source .svg changes (pair with `hugo server`)
//
// The sprite is committed; serving a Hugo site needs no Node. Rerun this only when icon sources change.

const fs = require('fs');
const path = require('path');
const svgo = require('svgo');
const SVGSpriter = require('svg-sprite');

// --- CLI -------------------------------------------------------------

const DEFAULTS = {
  src: path.resolve(__dirname, '../static/svg/ui-oval'),
  out: path.resolve(__dirname, '../static/svg/svg-icon-sprite.svg'),
};

function valueOf(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 && i + 1 < process.argv.length ? path.resolve(process.argv[i + 1]) : fallback;
}

const srcDirs = [DEFAULTS.src];
for (let i = 0; i < process.argv.length - 1; i++) {
  if (process.argv[i] === '--src') {
    for (const p of process.argv[i + 1].split(',')) srcDirs.push(path.resolve(p));
  }
}
const outFile = valueOf('--out', DEFAULTS.out);
const watch = process.argv.includes('--watch');

// --- Icon collection + collision guard ----------------------------------------

function collectIconFiles(dirs) {
  const files = [];
  for (const p of dirs) {
    if (fs.statSync(p).isDirectory()) {
      files.push(
        ...fs
          .readdirSync(p)
          .filter((f) => f.endsWith('.svg'))
          .sort()
          .map((f) => path.join(p, f))
      );
    } else {
      // a single standalone svg file also works: --src svg/placeholder.svg
      files.push(p);
    }
  }
  return files;
}

// Symbol id = "<dirName>_<basename>". Reject duplicates instead of silently overriding.
function symbolId(file) {
  return `${path.basename(path.dirname(file))}_${path.basename(file, '.svg')}`;
}

// Collect EVERY duplicate and list them all up front, no early break: an icon set with N collisions
// reports all N in one error instead of stopping at the first one.
function assertUniqueIDs(files) {
  const seen = new Map();
  const collisions = [];

  for (const file of files) {
    const id = symbolId(file);
    if (seen.has(id)) collisions.push(`${id}  (${seen.get(id)}  AND  ${file})`);
    else seen.set(id, file);
  }

  if (collisions.length) {
    throw new Error(
      `icon id collision${collisions.length > 1 ? 's' : ''} (${collisions.length}):\n  ${collisions.join('\n  ')}`
    );
  }
}

// --- Build ------------------------------------------------------------

async function build() {
  const files = collectIconFiles(srcDirs);
  assertUniqueIDs(files);
  const spriter = new SVGSpriter({ mode: { symbol: { dest: '.', sprite: 'icons.sprite.svg' } } });

  for (const file of files) {
    const { data } = await svgo.optimize(fs.readFileSync(file, 'utf8'), { path: file });
    spriter.add(path.join(path.dirname(file), `${symbolId(file)}.svg`), null, data);
  }

  const { result } = await spriter.compileAsync();
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, String(result.symbol.sprite.contents) + '\n');
  for (const dir of srcDirs) {
    console.log(`Bundled ${dir} → ${outFile}`);
  }
  console.log(`Wrote ${outFile} (${files.length} symbols)`);
}

// --- Watch ------------------------------------------------------------

function watchSources() {
  for (const dir of srcDirs) {
    fs.watch(dir, (event, filename) => {
      if (filename && filename.endsWith('.svg')) build().catch(fail);
    });
  }
  console.log(`Watching ${srcDirs.join(', ')} (Ctrl-C to stop)`);
}

// --- Entry point --------------------------------------------------------

function fail(err) {
  console.error(err.message);
  process.exit(1);
}

async function main() {
  for (const dir of srcDirs) {
    if (!fs.existsSync(dir)) throw new Error(`icon source dir not found: ${dir}`);
  }
  await build();
  if (watch) watchSources();
}

main().catch(fail);