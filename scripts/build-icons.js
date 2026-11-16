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
  rootDir: 'static/svg',   // base source dir; every `sprites[].srcList` entry + `spriteDir` resolve against this.
  spriteDir: 'sprite',     // output dir, relative to rootDir, for every sprite + the shared map.
  sprites: [{ srcList: ['ui-oval'], out: 'ui-oval-sprite.svg' }], // srcList = dirs inside rootDir; out = file NAME inside spriteDir.
  mapFile: 'sprite_map.json', // map file NAME inside spriteDir.

  // Source traversal for each `sprites[].srcList` entry:
  //   recursive : descend into subdirectories (default true). Set false to only read a dir's .svg files.
  //   depth    : max traversal depth below a src dir. Default 0 = no limit.
  //   exclude : exclude source paths by RegExp — a single pattern, or a comma-separated list / array of patterns.
  //                A directory hit skips the whole subtree; a file hit skips that file (gitignore-flavored last-match-wins logic).
  recursive: true,
  depth: 0,
  exclude: [],

  // SVGO 3 optimizer options passed straight through to svgo.optimize(). See
  // https://svgo.dev/docs/usage/node/ and https://svgo.dev/docs/preset-default/.
  svgo: {},
};

const root = path.dirname(CONFIG_PATH);

// Merge in this order (later keys win): DEFAULTS < sprite.config.js < CLI.
let cfg = { ...DEFAULTS, sprites: (DEFAULTS.sprites || []).map((s) => ({ ...s })) };
if (fs.existsSync(CONFIG_PATH)) {
  const user = require(CONFIG_PATH);
  cfg.enabled = user.enabled;
  cfg.rootDir = user.rootDir;
  cfg.spriteDir = user.spriteDir || DEFAULTS.spriteDir;
  cfg.mapFile = user.mapFile || DEFAULTS.mapFile;
  cfg.svgo = user.svgo || {};
  cfg.recursive = user.recursive !== undefined ? user.recursive : DEFAULTS.recursive;
  cfg.depth = user.depth !== undefined ? user.depth : DEFAULTS.depth;
  cfg.exclude = user.exclude !== undefined ? user.exclude : DEFAULTS.exclude;
  cfg.sprites = (user.sprites || []).map((s) => ({ ...s }));
}

// Resolve config paths against the theme/site root: `rootDir` → every `sprites[].srcList` source dir;
// `spriteDir` (inside rootDir) → output dir for sprite(s) + the map; `map` → the map file (inside spriteDir).
const resolved = {
  root: path.resolve(root, cfg.rootDir), // rootDir (source icons resolve against, e.g. static/svg)
  static: path.resolve(root, 'static'), // static dir (web-served root)
  spriteDir: path.resolve(root, cfg.rootDir, cfg.spriteDir), // sprite + map output dir (rootDir → spriteDir)
  map: path.resolve(root, cfg.rootDir, cfg.spriteDir, cfg.mapFile), // shared map file (inside spriteDir)
};

// --- CLI overrides -------------------------------------------------------------

const srcDirs = [];
for (let i = 0; i < process.argv.length - 1; i++) {
  if (process.argv[i] === '--src') {
    for (const p of process.argv[i + 1].split(',')) srcDirs.push(path.resolve(resolved.root, p));
  }
}
const outFileCli = (() => {
  const i = process.argv.indexOf('--out');
  return i >= 0 && i + 1 < process.argv.length ? path.resolve(resolved.spriteDir, process.argv[i + 1]) : null;
})();
const watch = process.argv.includes('--watch');
const enabled = process.argv.includes('--enabled=false')
  ? false
  : process.argv.includes('--enabled')
    ? true
    : cfg.enabled;
const sprites = (cfg.sprites || []).map((s) => ({
  src: srcDirs.length ? srcDirs : s.srcList.map((p) => path.resolve(resolved.root, p)), // srcList = dirs inside rootDir
  out: outFileCli || path.resolve(resolved.spriteDir, s.out), // file name inside spriteDir
}));

// --- Icon collection + collision guard ----------------------------------------

function collectIconFiles(dirs) {
  const files = [];

  // gitignore-style excluder from cfg.exclude (string: comma-separated, or array; `!` negates; RegExp per pattern).
  const rules = [];
  if (cfg.exclude != null) {
    const list = Array.isArray(cfg.exclude)
      ? cfg.exclude
      : String(cfg.exclude).split(',').filter((s) => s.trim() !== '');
    for (const raw of list) {
      if (raw == null || raw === '') continue;
      rules.push({ negate: raw.startsWith('!'), re: new RegExp(raw.replace(/^!/, '')) });
    }
  }
  const excluded = rules.length
    ? (rel) => {
        let out = false;
        for (const r of rules) if (r.re.test(rel)) out = !r.negate; // last matching pattern wins (gitignore-flavored)
        return out;
      }
    : null;

  for (const p of dirs) {
    if (fs.statSync(p).isDirectory()) {
      const walk = (absDir, relPrefix, depth) => {
        if (cfg.depth > 0 && depth > cfg.depth) return;
        for (const ent of fs.readdirSync(absDir, { withFileTypes: true })) {
          const rel = relPrefix ? `${relPrefix}/${ent.name}` : ent.name;
          if (ent.isDirectory()) {
            if (cfg.recursive && !(excluded && excluded(rel))) walk(path.join(absDir, ent.name), rel, depth + 1);
          } else if (ent.isFile() && ent.name.endsWith('.svg')) {
            if (excluded && excluded(rel)) continue;
            files.push(path.join(absDir, ent.name));
          }
        }
      };
      walk(p, path.basename(p), 1);
    } else {
      // a single standalone svg file also works: --src static/svg/placeholder.svg
      files.push(p);
    }
  }
  return files.sort();
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
        const { data } = await svgo.optimize(fs.readFileSync(file, 'utf8'), { ...cfg.svgo, path: file });
        spriter.add(path.join(path.dirname(file), `${symbolId(file)}.svg`), null, data);
      }
      const { result } = await spriter.compileAsync();

      const outFile = path.resolve(resolved.spriteDir, sprite.out);
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