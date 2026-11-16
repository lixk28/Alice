'use strict';

// Sprite build configuration — consumed by scripts/build-icons.js.
//
// Multiple `src` → `out` sprites are supported: each `sprites` entry bundles its own source set
// into one independent `<symbol>` sprite. So a site can ship several sprites, e.g. the
// built-in `ui-oval` set → `ui-oval-sprite.svg` AND a custom `minimal-ui` set →
// `minimal-ui-sprite.svg`.
//
// Outputs (paths resolve against the theme/site root; `rootDir` → `spriteDir`):
//   `rootDir`   base source dir; `sprites[].srcList` entries and `spriteDir` resolve against it.
//   `sprites[]`  each: .srcList = source icon dirs/single .svg files (inside `rootDir`);
//                .out    = the sprite file NAME (inside `spriteDir`).
//   `mapFile`   the shared map file NAME (inside `spriteDir`), a single JSON pairing each configured
//              icon `path` (relative to `rootDir`, e.g. "ui-oval/settings.svg") → { "sprite", "id" },
//              e.g. "ui-oval/settings.svg" → { "sprite": "svg/[...]ui-oval-sprite.svg", "id":
//              "[...]_settings" }. Templates read it ONCE (cached in hugo.Store) and resolve `path` →
//              "(sprite | relURL)#<id>".
//
// This file is optional (the inline defaults in the script are used when it's absent). CLI
// `--src` / `--out` still override the LAST sprite entry.

module.exports = {
  // Set to false to skip building entirely (e.g. you commit generated sprites + map).
  enabled: true,

  // Base dir that every `sprites[].srcList` is resolved against.
  rootDir: 'static/svg',

  // Output dir for the sprite file(s) AND the shared map — resolved against `rootDir`. `sprites[].out` and
  // `mapFile` are file names inside this dir.
  spriteDir: 'sprite',

  // One or more independent sprites. Each = { srcList, out }: source dirs (relative to `rootDir`; e.g. 'ui-oval'
  // →  static/svg/ui-oval) → output sprite file name (inside `spriteDir`).
  sprites: [
    { srcList: ['ui-oval'], out: 'ui-oval-sprite.svg' },
    // { srcList: ['minimal-ui'], out: 'minimal-ui-sprite.svg' },
  ],

  // Source traversal for each `sprites[].srcList` entry:
  //   recursive : descend into subdirectories (default true). Set false to only read a dir's top-level .svg files.
  //   depth    : max traversal depth below a src dir. Default 0 = no limit.
  //   exclude  : exclude source paths by RegExp — a single pattern, or a comma-separated string / array of patterns.
  //                A matching directory is skipped along with its whole subtree; a matching file is skipped.
  //                A pattern starting with `!` negates (last matching rule wins).
  recursive: true,
  depth: 0,
  exclude: [],

  // Single shared lookup map (file name inside `spriteDir`): { "<icon path>": { "sprite": "<out>", "id": "<dirName>_<name>" } }.
  mapFile: 'sprite_map.json',

  // SVGO 3 optimizer options, passed straight through to svgo.optimize() (see svgo.dev/docs/introduction/).
  //   plugins        : the optimizer pipeline. `preset-default` runs the base set (convertPathData, convertShapeToPath,
  //                   convertTransform, mergePaths, removeUselessStrokeAndFill, convertColors, ... — most of the "heavy"
  //                   optimizers are already inside it, so they need no extra config). Here we add:
  //                     * preset-default ... removeViewBox: false → KEEP viewBox (icons must size to their own box).
  //                     * removeDimensions          → drop width/height so each <symbol> scales from viewBox alone.
  //                     * sortAttrs              → deterministic attribute order, so regenerating the sprite gives stable git diffs.
  //   multipass      : re-run the pipeline until the output stops shrinking.
  //   floatPrecision : how many decimals to keep on numeric values (path coords, sizes, …).
  //   js2svg        : final stringification — `pretty: true` + `indent` (readable) or `pretty: true` → expand; set
  //                   `pretty: false` for a minified single-line sprite in production.
  svgo: {
    multipass: true,
    floatPrecision: 3,
    js2svg: {
      pretty: true,
      indent: 2
    },
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false
          }
        }
      },
      'removeDimensions',
      'sortAttrs',
    ],
  },
};
