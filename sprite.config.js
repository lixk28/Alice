'use strict';

// Sprite build configuration — consumed by scripts/build-icons.js.
//
// Multiple `src` → `out` sprites are supported: each `sprites` entry bundles its own source set
// into one independent `<symbol>` sprite. So a site can ship several sprites, e.g. the
// built-in `ui-oval` set → `ui-oval-sprite.svg` AND a custom `minimal-ui` set →
// `minimal-ui-sprite.svg`.
//
// Outputs (all relative to this file's dir, a.k.a. the theme/site root):
//   `sprites[]`  each: .srcList = source icon dirs/single .svg files (root-relative);
//                .out    = the sprite file (root-relative).
//   `mapFile`   a single shared JSON pairing each configured icon `path` → a { "sprite", "id" }
//              object, e.g. "static/svg/ui-oval/settings.svg" → { "sprite":
//              "static/svg/ui-oval-sprite.svg", "id": "ui-oval_settings" }. Templates
//              read it ONCE (cached in hugo.Store) and resolve `path` →
//              "(sprite | relURL)#<id>".
//
// This file is optional (the inline defaults in the script are used when it's absent). CLI
// `--src` / `--out` still override the LAST sprite entry.

module.exports = {
  // Set to false to skip building entirely (e.g. you commit generated sprites + map).
  enabled: true,

  // Base dir that every `sprites[].srcList` is resolved against.
  rootDir: 'static/svg',

  // One or more independent sprites. Each = { srcList, out }: source dirs (root-relative) →
  // output sprite file (root-relative).
  sprites: [
    { srcList: ['static/svg/ui-oval'], out: 'static/svg/ui-oval-sprite.svg' },
    // { srcList: ['static/svg/minimal-ui'], out: 'static/svg/minimal-ui-sprite.svg' },
  ],

  // Single shared lookup map (root-relative): { "<icon path>": { "sprite": "<out>", "id": "<dirName>_<name>" } }.
  mapFile: 'static/svg/sprite_map.json',
};