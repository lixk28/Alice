'use strict';

// Build one sprite from source icon directories.
//
// Pipeline:  svgo (optimize each *.svg) → svg-sprite (one <svg> with a <symbol id="<dir>_<name>"> per icon).
// The <dir> prefix namespaces each source directory, so a site's custom icons never collide with the theme's "ui-oval_" ids.
//
// Configuration is resolved in this precedence order (higher wins):
//   1. Inline DEFAULTS (built in, used when sprite.config.js is absent or a key is missing).
//   2. sprite.config.js at the theme/site root — the recommended place to set
//      `enabled` / `srcList` / `spriteDir` / `outFile`.
//   3. CLI flags.
//
// Usage:
//   node scripts/build-icons.js                      # sprite.config.js (or inline defaults)
//   node scripts/build-icons.js --src dir1,dir2,icon.svg  # add icon sources (dirs and/or svg files), comma-separated
//   node scripts/build-icons.js --out <file>      # custom output; overrides spriteDir + outFile
//   node scripts/build-icons.js --watch            # rebuild whenever a source .svg changes (pair with `hugo server`)
//   node scripts/build-icons.js --no-enabled      # CLI toggle to skip building (overrides config.enabled=true)
//
// The sprite + path→id map are committed; serving a Hugo site needs no Node. Rerun only
// when icon sources change.

const fs = require('fs');
const path = require('path');
const svgo = require('svgo');
const SVGSpriter = require('svg-sprite');

// --- Config resolution (defaults < sprite.config.js < CLI) --------------------------

// Paths inside the config are relative to the config file; the script resolves them.
const CONFIG_PATH = path.resolve(__dirname, '../sprite.config.js');
const DEFAULTS = {
  enabled: true,
  rootDir: 'static/svg',
  srcList: ['ui-oval'],
  spriteDir: 'sprite',
  outFile: 'svg-icon-sprite.svg',
  mapFile: 'sprite_map.json',
};

const root = path.dirname(CONFIG_PATH);
function resolvePaths(cfg) {
  return {
    enabled: cfg.enabled,
    root: path.resolve(root, cfg.rootDir),
    src: cfg.srcList.map((p) => path.resolve(root, cfg.rootDir, p)),
    out: path.resolve(root, cfg.rootDir, cfg.spriteDir, cfg.outFile),
    map: path.resolve(root, cfg.rootDir, cfg.spriteDir, cfg.mapFile),
    static: path.resolve(root, 'static'),
  };
}

// Merge in this order (later keys win): DEFAULTS < sprite.config.js < CLI.
let cfg = { ...DEFAULTS };
if (fs.existsSync(CONFIG_PATH)) {
  cfg = { ...cfg, ...require(CONFIG_PATH) };
}
const resolved = resolvePaths(cfg);

// --- CLI overrides -------------------------------------------------------------

const srcDirs = [...resolved.src];
for (let i = 0; i < process.argv.length - 1; i++) {
  if (process.argv[i] === '--src') {
    for (const p of process.argv[i + 1].split(',')) srcDirs.push(path.resolve(p));
  }
}
const outFileCli = (() => {
  const i = process.argv.indexOf('--out');
  return i >= 0 && i + 1 < process.argv.length ? path.resolve(process.argv[i + 1]) : null;
})();
const outFile = outFileCli || resolved.out;
const watch = process.argv.includes('--watch');
// --enabled=false / --no-enabled let a CI/deploy step skip the build without editing config.
const enabled = process.argv.includes('--enabled=false')
  ? false
  : process.argv.includes('--enabled')
    ? true
    : cfg.enabled;

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
  const map = {};
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

  // Emit the path→id map (web-served path → sprite symbol id). Templates read this.
  for (const file of files) {
    const webPath = path.relative(resolved.root, file);
    map[webPath.replace(/\\/g, '/')] = symbolId(file);
  }
  fs.writeFileSync(resolved.map, JSON.stringify(map, null, 2) + '\n');
  console.log(`Wrote ${resolved.map} (${files.length} entries)`);
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
  if (!enabled) {
    console.log('Icon sprite build skipped (sprite.config.js: enabled = false).');
    return;
  }
  for (const dir of srcDirs) {
    if (!fs.existsSync(dir)) throw new Error(`icon source dir not found: ${dir}`);
  }
  await build();
  if (watch) watchSources();
}

main().catch(fail);