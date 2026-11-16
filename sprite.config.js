'use strict';

// Icon sprite build configuration — consumed by scripts/build-icons.js.
//
// All paths are resolved against this file's directory (the theme/site root).
// This file is optional: when absent, the defaults below (also baked into the
// script) are used unchanged.
//
// CLI flags override the matching key when given:
//   --src  dir1,dir2,file.svg   additional sources (comma-separated; appended to `srcList`)
//   --out  full/path/sprite.svg  full output path (overrides spriteDir + outFile)
//   --watch                     rebuild whenever a source changes
//
// The sprite is committed, so serving a Hugo site needs no Node. Rerun this only
// when icon sources change.

module.exports = {
  // Set to false to skip building the sprite entirely (e.g. you commit a sprite, or
  // host one elsewhere and only run `hugo` at deploy time).
  enabled: true,

  // Root that `srcList` and `spriteDir` below are resolved against (relative to this file's
  // directory). Keeping both under one root makes the layout obvious, e.g. static/svg.
  rootDir: 'static/svg',

  // Directory the sprite file is written to (created if missing), relative to `rootDir`.
  spriteDir: 'sprite',

  // JSON map of sprite path → generated symbol id, written next to the sprite. The
  // templates read this once (cached in hugo.Store) to resolve a configured svg
  // `path` into its sprite `id`.
  mapFile: 'sprite_map.json',

  // Source icon directories and/or single .svg files, relative to `rootDir`. Each
  // directory's icons are prefixed by the directory name to form their sprite id
  // ("<dir>_<basename>"), so custom icon sets never collide with the built-in
  // "ui-oval_..." ids.
  srcList: ['ui-oval'],

  // Sprite output filename.
  outFile: 'svg-icon-sprite.svg',
};
