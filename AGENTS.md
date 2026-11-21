# AGENTS.md

## Project Structure

This repository is the Alice theme. Theme templates, static files, assets, and the default config live at the repository root. `docs/` is the example site. Hugo is started with `--source=docs`; `docs/config.toml` sets `theme = "Alice"` and `themesDir = "../.."`, so the theme resolves to this repository.

Change theme behavior in the root `layouts/`, `static/`, `assets/`, and `config.toml`. Change example posts, example data, and the example site's own settings under `docs/`. The root `config.toml` is the theme default. `docs/config.toml` overrides it for the example site. When a key exists in both files, change `docs/config.toml` for it to show up at http://localhost:1314.

CI uses Hugo 0.170.0 (single binary; the extended edition was removed upstream in 0.170).

- `layouts/` holds the templates. `layouts/baseof.html` wraps every page. Shortcodes go in `layouts/_shortcodes/`, partials in `layouts/_partials/`, and render hooks in `layouts/_markup/`.
- `static/css/` and `static/js/` are served as-is. `static/css/style.css` is linked on every page and `@import`s the shared component sheets. Scripts in `static/js/` are linked with `relURL` only when a page needs them.
- `assets/` holds files passed through `resources.Get`.
- Example data lives under `docs/data/`. Friend YAML is in `docs/data/friends/`. Homepage news is in `docs/data/news/`. Change those files when editing the Friends page or the home sidebar; do not add a second copy at the theme root.

Which template, stylesheet, and script belongs to which page or shortcode is listed under Components.

## Building and Serving

The npm scripts drive building and serving. The theme root is **not itself a Hugo site**, so:

- `build` / `serve` — target a subscriber's own site root (no hard-coded `--source`; `serve` = `hugo server` and also rebuilds the icon sprite in `--watch` mode, for live icon preview).
- `build:docs` / `serve:docs` — the same two, but for this repository's example site (`--source=docs`, port 1314).
- `build:icons` — rebuild the icon sprite only; both `build`-flavors call it automatically.

Run the example site locally with:

```bash
hugo server --source=docs --bind 127.0.0.1 --port 1314 --disableFastRender
```

Then open **http://localhost:1314**. After code changes, do not start this server on your own to verify the site. Assume the user runs it when they want a preview, or the server is already started and listening.

The published GitHub Pages site is https://lixk28.github.io/Alice/. That is the official deployment of the example site, not a substitute for the local server.

The build flow for a site in two steps:

1. **`npm run build:icons`** — build each sprite + the lookup map. Source SVG icons live under `rootDir`/`<set>/` (default `static` → `static/svg/ui-oval/`). Config is `sprite.config.js` (optional; inline script defaults apply when absent): `enabled` (set `false` to skip building — e.g. you commit the generated sprites + map), `rootDir` (`static`) is the base every `sprites[].srcList` entry and `spriteDir` resolve against; `spriteDir` (e.g. `svg/sprite`) is where every sprite + the map are written, each `sprites[]` entry `{ srcList, out }` (out = file name inside `spriteDir`) bundles its sources into one independent `<symbol>` sprite (ids are `<dir>_<name>`, `<dir>` = the innermost source directory, so custom sets never collide with the built-in `ui-oval_` ids). Per sprite you can also scope traversal with `recursive` (descend into subdirs), `depth` (max depth below a src dir, `0` = unlimited), and `exclude` (RegExp patterns; `!` negates, last match wins; a dir hit skips that whole subtree). It optimizes each through svgo (colors folded to `currentColor`), builds every sprite, and writes one shared `sprites.json` (in `spriteDir`) → `{ "enabled", "map" }` mapping each configured icon `path` (relative to `rootDir`, e.g. `svg/ui-oval/home-03.svg`) → `{ "sprite": "<out web path>", "id": "<dir>_<name>" }`. So a site can ship several sprites (e.g. a `minimal-ui` set → its own sprite) while templates still resolve any icon by `path`. Duplicate symbol ids **fail the build** — all collisions collected into one error (no early break); on success it logs one `Bundled <src> → <sprite> (N symbols)` per sprite, then `Wrote <mapFile> (N entries)`. `--watch` rebuilds whenever a source `.svg` changes; `--enabled=false` forces a skip, and (when disabled) still rewrites `sprites.json` with an empty map so the site uses loose icon paths.

2. **Sprite → site**: `hugo` (or `hugo server`) — templates never hard-code a sprite path. `layouts/_partials/svg-icon.html` reads `sprites.json` (`{ "enabled", "map" }`) ONCE (cached in `hugo.Store`); when `enabled` is truthy it uses the map to turn a configured `path` into `(sprite | relURL)#<id>`, otherwise it uses the loose `path` file directly (e.g. `svg/ui-oval/home-03.svg`), falling back to `svg/placeholder.svg` only when `path` is absent/invalid. Every sprite + the map are committed, so git-submodule and Hugo-module users skip step 1 unless an icon source changes.

## Components

`layouts/baseof.html` wraps every page: the header partial, the `main` block, and the footer partial. It always links `static/css/style.css`. That file sets the global page (fonts, colors, lists, headings, footnotes) and `@import`s the shared component sheets, so those sheets are loaded on every page. Put page-wide rules in `style.css`. Put a component's rules in its own sheet under `static/css/`, and `@import` that sheet from `style.css` when it should load everywhere. `baseof.html` links the other sheets only when a page turns that feature on.

Pages:

- `layouts/home.html` renders `/`.
  - Partials: `post-card.html`, `paginator.html`, and `layouts/_partials/sidebar/` (`news`, `recent-updates`, `pinned`, `tag-list`, `category-list`).
  - Styles: `static/css/home.css`, `static/css/paginator.css`.
- `layouts/single.html` renders one post.
  - Pieces: table of contents, featured image, title, `post-meta.html`, `post-tldr.html`, content, previous/next (`post-prext.html`), related posts (`post-related.html`), jump buttons. Front matter `prext` / `related` default on; set either to `false` to hide that block.
  - Styles: `static/css/post.css` (article layout), `static/css/toc.css`, `static/css/img.css` (featured image and figures), `static/css/prext.css`, `static/css/related.css`, `static/css/jump.css`.
- `layouts/posts/section.html` renders `/posts/`.
  - Calls `post-list.html` with `groupBy "PublishDate"` so pinned posts come first, then the rest under publish-year headings.
  - `post-list.html` is generic: pass any page collection (`{{ partial "post-list.html" .Pages }}`), or a dict with `pages` plus optional `groupBy` / `groupSort` (Hugo's `GroupBy FIELD [SORT]` semantics; date fields group by year). Posts with `pinned: true` always render first; `params.postlist.pinned` sets that group's heading and icon.
  - `layouts/list.html` is the fallback list (it paginates and does not pin). Post-list and pinned-group rules live in `static/css/style.css`.
- Taxonomy pages:
  - `layouts/categories/taxonomy.html` renders `/categories/`. `layouts/tags/taxonomy.html` renders `/tags/`.
  - `layouts/more/section.html` renders `/more/` (section hub via `content/more/`); the link list is `layouts/_partials/morehub.html` (`menu.main` children of `identifier = "more"`).
  - Term-size bins: `static/css/taxo.css`. Tag and category link tilt: `style.css`.
  - `layouts/categories/term.html` and `layouts/tags/term.html` render one category or one tag with `post-list.html` (pinned posts first, like `/posts/`).
- `layouts/friends.html` renders `/friends/`.
  - Cards come from the `friend` and `frienmily` shortcodes.
  - Styles: `static/css/friend.css`.
- `layouts/about.html` renders `/about/`. Spacing for `.about-content` is in `style.css`.
- `layouts/404.html` renders the 404 page and has no separate stylesheet.
- Chrome on every page:
  - `layouts/_partials/header.html`. Styles: `static/css/header.css`.
    - Menu entries: `layouts/_partials/header/menu-entry.html`, reused by the desktop `<nav id="menu">` (in `header.html`) and the mobile `layouts/_partials/header/hamburger-menu.html`.
    - Menu icon: `layouts/_partials/svg-icon.html` renders a self-contained inline `<svg aria-hidden="true"><use href="..."/></svg>` from a flat dict — `path` (the icon's key relative to `rootDir=static`, like `svg/ui-oval/home-03.svg`, read from a menu entry's `[menu.main.params.icon]`); optional `class` (a string or a list, joined with spaces) is appended to the header's hard-coded default `menu-icon menu-<id>-icon`; `id` or raw `attrs` set more attribute(s) on the `<svg>` (aria-hidden is always present). It reads `<rootDir>/<spriteDir>/sprites.json` (`{ "enabled", "map" }`) ONCE, caches it in `hugo.Store`; when `enabled` is truthy it resolves `path` → `(sprite | relURL)#<id>` from the map, otherwise it uses the loose `path` file directly, falling back to `svg/placeholder.svg` only when `path` is absent/invalid — each entry's `sprite` points at whichever sprite holds that icon, so multiple sprites are supported.
  - `layouts/_partials/footer.html`. Styles: `static/css/footer.css`.
  - `layouts/_partials/head-extra.html`: empty hook called at the end of `<head>` in `baseof.html`. Sites override it to inject page CSS/JS without copying `baseof`.

Shortcodes in `layouts/_shortcodes/` are used inside post content, and on the friends page. Unless noted, their CSS is imported by `style.css`:

- Admonitions: `note`, `tip`, `info`, `help`, `alert`, `admonition`, and `details`.
  - Shared partial: `layouts/_partials/details.html`.
  - Styles: `static/css/admonition.css`, `static/css/details.css`.
- `dropdown`:
  - Shared partial: `layouts/_partials/dropdown.html` (also used by header menu entries with children).
  - Styles: `static/css/dropdown.css`. Script: `static/js/dropdown.js` (linked in `baseof` `<head>` when the page has the shortcode or the header menu has children).
  - Left side optional `title` (markdownified); right side inline caret (solid triangle). Header menu entries still pass left-side HTML into the partial.
  - Mode `hover` (default) or `click` via shortcode arg, `params.dropdown.mode`, or `params.header.dropdown.mode` for the header. Hamburger menus always use `click`.
- `carousel` and `slide`:
  - Image-only carousel; `carousel` wraps one or more `slide` children, and each `slide` is one image.
  - Shared partials: `layouts/_partials/carousel/controls-bar.html`, `layouts/_partials/carousel/indicators.html`, `layouts/_partials/carousel/counter.html`, and `layouts/_partials/carousel/thumbnails.html`.
  - Styles: `static/css/carousel.css`. Script: `static/js/carousel.js` (linked in `baseof` `<head>` when the page has the shortcode). The carousel frame keeps the theme border, background, and radius but has no drop shadow; a thin hairline separates the image and the control bar.
  - Defaults: `params.carousel` (`autoplay`, `interval`, `progressStyle`, `progressPosition`, `controls`, `controlsPlacement`, `prevAlign`, `indicatorStyle`, `indicatorAlign`, `nextAlign`, `vAlign`, `perView`, `counterSeparator`, `loop`, `keyboard`, `pause`, `effect`, `contentMode`, `captionPosition`, `captionAlign`, `label`, and `icons`). Per-slide arguments: `image`, `alt`, `caption`, `description`, `captionPosition`, `captionAlign`, `link`, `target`, `rel`, `width`, `height`, `loading`, `contentMode`, `lightbox`, `class`.
  - `perView` shows several images at once (slide effect only; ignored with `effect="fade"`): navigation moves one slide at a time, the counter (when selected) shows the visible range, the `segments` indicator's active segment marks the current position, and screens up to `40em` fall back to one image per view.
  - Touch swipes and mouse drags change slides; horizontal wheel/trackpad scroll (or Shift+wheel) moves one slide per gesture, while vertical scrolling stays with the page. With `effect="slide"` the track follows the drag; `fade` switches on release.
  - Slides may carry `caption` and `description`, rendered in an always-visible frosted panel over the image; links inside stay clickable. `captionPosition` (`bottom` default or `top`) and `captionAlign` (`left` default, `center`, `right`) place it; a slide can override either. Both accept inline Markdown, and the caption becomes the alt text when `alt` is omitted.
  - `controlsPlacement` places the control bar below the image (`below`, default) or overlays it on the image (`overlay-top` or `overlay-bottom`). In overlay mode prev/next become full-height clickable strips on the left and right edges: the icon sits on a small frosted chip, horizontally centered and placed vertically by `vAlign` (`top`, `center` default, or `bottom`), and hovering highlights the whole strip; the indicator floats at the top/bottom on a matching frosted panel. In `below` mode each control and the indicator choose a horizontal zone independently: `prevAlign` (default `left`), `indicatorAlign` (default `center`), and `nextAlign` (default `right`). Within a zone the order is prev → indicator → next. `indicatorStyle` is `dots` (default), `segments`, `counter`, or `thumbnails`; only one indicator is shown, and an interactive carousel always has one. With `thumbnails`, preview buttons occupy the control bar's indicator slot (the below bar, or the overlay bar) and align by `indicatorAlign`; the slot scrolls horizontally when the previews overflow, the script outlines the active preview and keeps it scrolled into view, and previews past `maxIndex` stay hidden like the other indicators. `counterSeparator` applies to the counter style.
  - `autoplay` is a boolean switch (default `false`); `interval` is the delay in milliseconds (default `5000`). When autoplay is on, a corner button in the top-right of the image (bottom-right when the overlay bar is at the top) toggles autoplay; its label changes between Pause autoplay and Start autoplay, and it sits before the slides in the tab order. `progressStyle` is `both` (default: thin bar plus ring), `bar`, `ring`, or `none`, and `progressPosition` puts the bar at the top (default) or bottom. `pause` defaults to `false`; set `pause=true` to pause autoplay on hover/focus. The carousel ids are generated from `.Ordinal` and are not configurable. `loop` defaults to `true`; with `loop=false`, prev/next are disabled at the first/last position.
  - Images use the page lightbox vendor when the page enables one; a slide `link` overrides it. `contentMode` picks the image `object-fit`: `scaleToFill` (default, `fill`), `aspectFit` (`contain`), or `aspectFill` (`cover`); set it on the carousel for a shared default or on a slide to override. `effect="fade"` cross-fades instead of sliding, and the viewport height follows the visible images.
- `tab` and `tabpanel`: `static/css/tabs.css`.
- `shell`, `cmd`, and `cmdout`: `static/css/shell.css`.
- `secret`: `static/css/secret.css`.
- `sidenote`: `static/css/sidenote.css`.
- `mark`: `static/css/mark.css`.
- `dropcap`: `static/css/dropcap.css`.
- `attachment`: `static/css/attachment.css`.
- `friend` and `frienmily`: `static/css/friend.css`.
- Fenced code blocks and the `highlight` shortcode:
  - Template: `layouts/_markup/render-codeblock.html`.
  - Layout styles: `static/css/code.css`.
  - Chroma colors: `static/css/syntax.css`, linked from `baseof.html` only when the page sets `codeblock.highlight`. Regenerate with `static/css/gensyntax.sh`.
- `prism`:
  - Partial: `layouts/_partials/highlight/prism.html`.
  - `baseof.html` links `css/prism.css` when a page uses that shortcode. The ice theme is `static/css/prism-ice.css`.
- `codeeditor`:
  - Partials: `layouts/_partials/editor/codemirror5.html` or `codemirror6.html`.
  - Styles: `static/css/codemirror5.css` or `static/css/codemirror6.css`. `baseof.html` links the matching sheet only when a page uses the shortcode.
- Tables: `layouts/_markup/render-table.html`, `static/css/table.css`.
- Blockquotes: `layouts/_markup/render-blockquote.html`, `static/css/quote.css`.
- Markdown images and the `figure` shortcode: `layouts/_markup/render-image.html`, `layouts/_shortcodes/figure.html`, `static/css/img.css`.
- Headings and links: `layouts/_markup/render-heading.html`, `layouts/_markup/render-link.html`. Heading anchors are in `style.css`.
- Lightbox:
  - `layouts/_partials/lightbox.html` picks `lightbox/fancybox.html` or `lightbox/glightbox.html`.
  - Those partials load vendor CSS from a CDN. `static/css/lightbox.css` is not imported by `style.css`.
- Math, TikZ, algorithms, and Mermaid:
  - Partials: `layouts/_partials/tex/` (`mathjax.html`, `katex.html`, `tikz.html`, `pseudocode.html`), `layouts/_partials/mermaid.html`, and the matching `layouts/_markup/render-codeblock-*.html` hooks.
  - Their stylesheets are loaded from those partials, not from `static/css/`.
- Waline comments: `static/css/waline.css`, linked from `baseof.html` when the page sets `waline`.
- Markup only, no theme stylesheet: `bilibili`, `spotify`, `netease-cloud-music`, `date`, `loremipsum`.

Scripts in `static/js/` are served as-is and linked with `relURL`. A template loads each one only when that page needs it:

- `static/js/jumpButtons.js`
  - Loaded by `layouts/single.html` on every post.
  - Jump-to-top and jump-to-bottom buttons. Styles: `static/css/jump.css`.
- `static/js/copyCodeBlock.js`
  - Loaded by `baseof.html` when the page sets `codeblock.cursed`.
  - Copies a Chroma code block. The copy button is styled in `static/css/code.css`.
- `static/js/carousel.js`
  - Loaded by `baseof.html` when the page uses the `carousel` shortcode.
  - Drives `carousel`/`slide` slides, per-view layout, height, autoplay, indicators, touch swipes, mouse drags, and horizontal wheel/trackpad navigation. Styles: `static/css/carousel.css`.
- `static/js/snakeTOC2.js`
  - Loaded by `baseof.html` when the page sets `toc.snake`.
  - Draws the table-of-contents progress path. Styles: `static/css/toc.css`.
  - `static/js/snakeTOC.js` is the previous version; its script tag in `baseof.html` is commented out.
- `static/js/renderAlgorithm.js`
  - Loaded by `layouts/_partials/tex.html` when the page sets `tex.algorithm`.
  - Renders pseudocode blocks after the CDN pseudocode script.
- `static/js/lightbox.js`
  - Custom figure lightbox. No template loads it.
  - The live lightboxes are Fancybox and GLightbox, loaded from a CDN by `layouts/_partials/lightbox/`.
- `assets/js/switchTab.js` is not under `static/js/`.
  - `baseof.html` loads it with `resources.Get` when the page sets `tab.cursed`. It remembers the selected tab.
- `js/codemirror6.min.js` is linked from `baseof.html` when the code editor vendor is CodeMirror 6. That bundle is not in this repository.

For anything unclear, for a new feature, and for reference material, use the [Hugo documentation](https://gohugo.io/documentation/).

## Style Guidelines

The theme looks classic and editorial, not like a modern SaaS dashboard. The site tagline is "so damn classic". New UI should look like the existing header, post cards, friend cards, and sidebar fieldsets.

- Page background is `AliceBlue`. Body text is `Black`. Put colors on CSS variables in `:root` (see `static/css/style.css`) and reuse them. Prefer CSS color names (`RoyalBlue`, `Navy`, `SlateGray`, `Gainsboro`, `GhostWhite`) over hex or `rgb()`.
- Links are `RoyalBlue`, `Blue` on hover. Do not use a real underline. Use an inset `box-shadow` underline that thickens slightly on hover.
- Sans text is IBM Plex Sans (`--sans-font`). Code is IBM Plex Mono (`--mono-font`). Heading sizes stay modest (`h1` is `1.5rem`). Do not introduce a display face or jump heading scale.
- Cards and panels have a thin `SlateGray` or `Silver` border, about `.3em` radius, and a small offset shadow (`.1em .1em .3em LightSlateGray`). Sidebar legends are `Navy` on `GhostWhite` with a navy left bar. Do not use large radius, gradients, glassmorphism, or heavy drop shadows.
- Motion is short (`150ms`–`200ms` ease) and small: tags and categories tilt about `2deg` on hover; friend cards lift `.1em`. Do not add large slides, bounces, or scale-ups.
- Icons are stroke SVGs with round caps, `Black` or `Navy`, sized in `em`. Do not fill them as solid glyphs unless the existing icon already does.
- Dark mode variables in `style.css` are commented out. Do not add a dark theme unless asked.
- Put new visual rules in the matching component sheet under `static/css/`, using `em` / `rem` / `ch`. Page-wide tokens belong in `style.css`.

## Design Guidelines

- Keep the theme light. Prefer a small template, a CSS sheet, or a short `static/js` file over a new npm package, bundled vendor, or CDN library. Do not add a heavy dependency when HTML, CSS, or a few lines of Hugo template can do the job.
- Function comes first. Ship the feature, then keep the look simple. Do not add ornament, extra motion, or visual chrome that does not help reading or using the page. Visual tokens still follow Style Guidelines.
- New features, pages, and shortcodes should be pluggable and configurable. Gate them with site params and page front matter the way tabs, TeX, lightbox, and Waline already are. Let the user turn the piece off, pick a vendor, or pass arguments. Do not hard-code a single path that every site must take.
- Templates should be reusable. Extract shared markup into a partial (as admonitions share `details.html`) instead of copying a block into each shortcode. Prefer a small, composable template over a one-off that only works on one page.

## Git Workflow

### Commit Discipline

Never `git add` + `git commit` (or `--amend`, rebase, squash, `reset`) on your own. Make the file edits you're asked for and leave changes in the working tree; the user stages, commits, splits, and rebases. If the user later says "commit / amend / squash", only then run git.

Friction that actually happened and the rules that avoid it:

* **Don't silently rewrite history.** Only `--amend`, rebase, or squash when the user explicitly says so, and target exactly the commit/commits they name. Confirm the range before a multi-commit squash.
* **Don't merge "the nearby commits" on a hunch** — when told to "merge the previous two", confirm WHICH two; naming the intended base avoids wrong squash ranges.
* **`write` overwrites whole files.** A `write` replaces the entire file. Prefer `edit` for targeted changes so unrelated content (a header lede, `'use strict'`, or other keys) is never dropped.
* **Don't expand scope** — when fixing one thing, change only that, and `--amend` into the intended commit; do not fold in unrelated commits.
* **Keep `git add` scoped** — stage specific files, not a whole directory, so untracked-but-keep files and regenerated artifacts aren't swept in; `git checkout -- <file>` discards incidental build output.

### Commit Message Conventions

Write commit messages in [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Use `feat` for a new feature and `fix` for a bug fix. Other types such as `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, and `chore` are allowed. Mark a breaking change with `!` after the type/scope, or with a `BREAKING CHANGE:` footer.

Message body: when one commit covers several independent changes under the same theme, list them as `*` bullets instead of packing them into a paragraph. Prefer the same bullet list for other list-friendly bodies (migration steps, checklist-style notes, multiple touched surfaces). Keep the subject line a short summary; put the detail in the body.

```
build: bump Hugo to 0.170.0 and replace deprecated APIs

* CI: install the single-binary package (extended edition removed).
* Templates: Site.Data → hugo.Data; LanguageCode → locale / Language.Locale.
* Waline: Site.BuildDrafts → skip draft pages with not .Draft.
* Front matter: Params.type → .Type for series featured images.
```

Do not add an agent sign-off, attribution trailer, or similar footer (for example `Signed-off-by`, `Co-authored-by` for the agent).

Do not commit generated files: `node_modules/`, `public/`, `docs/public/`, or `docs/resources/_gen/`. `exampleSite/` only contains an old build output. It is not the example site.
