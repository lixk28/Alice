'use strict';

// Sprite build configuration — consumed by scripts/build-icons.js.
//
// Multiple `src` → `out` sprites are supported: each `sprites` entry bundles its own source set
// into one independent `<symbol>` sprite. So a site can ship several sprites, e.g. the
// built-in `ui-oval` set → `ui-oval-sprite.svg` AND a custom `minimal-ui` set →
// `minimal-ui-sprite.svg`.
//
// Outputs (all relative to this file's dir, a.k.a. the theme/site root): `rootDir` (e.g. `static`) is the
// base both source icons and built sprites live under; `spriteDir` (inside `rootDir`) holds every sprite + the map.
//   `sprites[]`  each: .srcList = source icon dirs/single .svg files (relative to `rootDir`);
//                .out    = the sprite file NAME (inside `spriteDir`).
//   `mapFile`   a single shared JSON (inside `spriteDir`), pairing each configured icon `path` (relative to `rootDir`,
//              e.g. "svg/ui-oval/settings.svg") → { "sprite", "id" }, e.g. "svg/sprite/ui-oval-sprite.svg#ui-oval_settings".
//              Templates read it ONCE (cached in hugo.Store) and resolve `path` → "(sprite | relURL)#<id>".
//
// This file is optional (the inline defaults in the script are used when it's absent). CLI
// `--src` / `--out` still override the LAST sprite entry.

module.exports = {
  // Set to false to skip building entirely (e.g. you commit generated sprites + map).
  enabled: true,

  // Base dir that every `sprites[].srcList` entry and `spriteDir` resolve against. `static` keeps every icon asset
  // (sources AND built sprites) under the web-served static dir.
  rootDir: 'static',

  // Output dir for the sprite file(s) AND the shared map — resolved against `rootDir`. `sprites[].out` and
  // `mapFile` are file names inside this dir.
  spriteDir: 'svg/sprite',

  // One or more independent sprites. Each = { srcList, out }: source dirs (relative to `rootDir`; e.g. 'svg/ui-oval'
  // → static/svg/ui-oval) → output sprite file name (inside `spriteDir`).
  sprites: [
    { srcList: ['svg/ui-oval'], out: 'svg-icon-sprite.svg' },
    // { srcList: ['svg/minimal-ui'], out: 'minimal-ui-sprite.svg' },
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

  // Single shared lookup map (file name inside `spriteDir`): { "enabled": bool, "map": { "<icon path>": { "sprite", "id" } } }.
  mapFile: 'sprites.json',

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
            removeViewBox: false,
            // Fold black (#000 / named black) → `currentColor` so every sprite icon is themed via the CSS
            // `color` property (see static/css/header.css). `currentColor` sources are kept as-is.
            convertColors: { currentColor: true }
          }
        }
      },
      'removeDimensions',
      'sortAttrs',
    ],
  },
};
