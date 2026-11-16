'use strict';

// Build one or more icon sprites from source icon directories, plus a shared path→id map.
//
// Pipeline:  svgo (optimize each *.svg) → svg-sprite (one <svg> with a <symbol id="<dir>_<name>"> per icon).
// The <dir> prefix namespaces each source directory, so a site's custom icon sets never collide with the theme's "ui-oval_" ids.
//
// Configuration is resolved in this precedence order (higher wins):
//   1. Inline DEFAULTS (built in, used when sprite.config.js is absent or a key is missing).
//   2. sprite.config.js at the theme/site root — the recommended place to set
//      `enabled` / `sprites` (each `{ srcList, out }`) / `mapFile`.
//   3. CLI flags (`--src` / `--out` override the LAST sprite entry; `--enabled=false` skips).
//
// Output:
//   * each sprite in `sprites[]` → its own `<symbol>` sprite file; and
//   * one shared `sprite_map.json` pairing every configured icon `path` → { "sprite", "id" },
//     which templates read once (cached in hugo.Store) to resolve `path` → "(sprite | relURL)#id".
//
// Sprites + map are committed; serving a Hugo site needs no Node. Rerun only when icon sources change.

const fs = require('fs');
const path = require('path');
const svgo = require('svgo');
const SVGSpriter = require('svg-sprite');

// --- Config resolution (defaults < sprite.config.js < CLI) --------------------------

const CONFIG_PATH = path.resolve(__dirname, '../sprite.config.js');
const DEFAULTS = {
  enabled: true,
  rootDir: 'static/svg',
  sprites: [{ srcList: ['static/svg/ui-oval'], out: 'static/svg/ui-oval-sprite.svg' }],
  mapFile: 'static/svg/sprite_map.json',
};

const root = path.dirname(CONFIG_PATH);

// Merge in this order (later keys win): DEFAULTS < sprite.config.js < CLI.
let cfg = { ...DEFAULTS, sprites: (DEFAULTS.sprites || []).map((s) => ({ ...s })) };
if (fs.existsSync(CONFIG_PATH)) {
  const user = require(CONFIG_PATH);
  cfg.enabled = user.enabled;
  cfg.rootDir = user.rootDir;
  cfg.mapFile = user.mapFile;
  cfg.sprites = (user.sprites || []).map((s) => ({ ...s }));
}

// Paths (root-relative keys in config are resolved against the theme/site root).
const resolved = {
  root: path.resolve(root, cfg.rootDir), // rootDir (icons resolved against, e.g. static/svg)
  static: path.resolve(root, 'static'), // static dir (web-served root)
  map: path.resolve(root, cfg.mapFile),
};

// --- CLI overrides -------------------------------------------------------------

const srcDirs = [];
for (let i = 0; i < process.argv.length - 1; i++) {
  if (process.argv[i] === '--src') {
    for (const p of process.argv[i + 1].split(',')) srcDirs.push(path.resolve(p));
  }
}
const outFileCli = (() => {
  const i = process.argv.indexOf('--out');
  return i >= 0 && i + 1 < process.argv.length ? path.resolve(process.argv[i + 1]) : null;
})();
const watch = process.argv.includes('--watch');
const enabled = process.argv.includes('--enabled=false')
  ? false
  : process.argv.includes('--enabled')
    ? true
    : cfg.enabled;
const sprites = (cfg.sprites || []).map((s) => ({
  src: srcDirs.length ? srcDirs : s.srcList.map((p) => path.resolve(root, p)),
  out: outFileCli || path.resolve(path.dirname(CONFIG_PATH), s.out),
}));

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
  const map = {};

  for (const sprite of sprites) {
    if (sprite.src && sprite.src.length) {
      const files = collectIconFiles(sprite.src);
      assertUniqueIDs(files);

      const srcDir = path.dirname(files[0]);
      const spriter = new SVGSpriter({ mode: { symbol: { dest: '.', sprite: 'icons.sprite.svg' } } });
      for (const file of files) {
        const { data } = await svgo.optimize(fs.readFileSync(file, 'utf8'), { path: file });
        spriter.add(path.join(path.dirname(file), `${symbolId(file)}.svg`), null, data);
      }
      const { result } = await spriter.compileAsync();

      const outFile = path.resolve(path.dirname(CONFIG_PATH), sprite.out);
      fs.mkdirSync(path.dirname(outFile), { recursive: true });
      fs.writeFileSync(outFile, String(result.symbol.sprite.contents) + '\n');

      for (const file of files) {
        const key = path.relative(resolved.root, file).replace(/\\/g, '/'); // "ui-oval/home-03.svg" (matches config path)
        const spriteWebPath = path.relative(resolved.static, outFile).replace(/\\/g, '/'); // "svg/ui-oval-sprite.svg"
        map[key] = { sprite: spriteWebPath, id: symbolId(file) };
      }
      console.log(`Bundled ${sprite.src.join(', ')} → ${outFile} (${files.length} symbols)`);
    }
  }
  fs.mkdirSync(path.dirname(resolved.map), { recursive: true });
  fs.writeFileSync(resolved.map, JSON.stringify(map, null, 2) + '\n');
  console.log(`Wrote ${resolved.map} (${Object.keys(map).length} entries)`);
}

// --- Watch ------------------------------------------------------------

function watchSources() {
  for (const sprite of sprites) {
    for (const dir of sprite.src) {
      fs.watch(dir, (event, filename) => {
        if (filename && filename.endsWith('.svg')) build().catch(fail);
      });
    }
  }
  console.log(`Watching ${sprites.map((s) => s.src).join(', ')} (Ctrl-C to stop)`);
}

// --- Entry point --------------------------------------------------------

function fail(err) {
  console.error(err.message);
  process.exit(1);
}

async function main() {
  if (!enabled) {
    console.log('Sprite build skipped (sprite.config.js: enabled = false).');
    return;
  }
  for (const sprite of sprites) {
    for (const dir of sprite.src) {
      if (!fs.existsSync(dir)) throw new Error(`icon source dir not found: ${dir}`);
    }
  }
  await build();
  if (watch) watchSources();
}

main().catch(fail);