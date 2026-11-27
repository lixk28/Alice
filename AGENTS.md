# AGENTS.md

## Project Structure

This repository is the Alice theme. Theme templates, static files, assets, and the default config live at the repository root. `docs/` is the example site. Hugo is started with `--source=docs`; `docs/config.toml` sets `theme = "Alice"` and `themesDir = "../.."`, so the theme resolves to this repository.

Change theme behavior in the root `layouts/`, `static/`, `assets/`, and `config.toml`. Change example posts, example data, and the example site's own settings under `docs/`. The root `config.toml` is the theme default. `docs/config.toml` overrides it for the example site. When a key exists in both files, change `docs/config.toml` for it to show up at http://localhost:1314.

CI uses Hugo 0.170.0 (single binary; the extended edition was removed upstream in 0.170).

- `layouts/` holds the templates. `layouts/baseof.html` wraps every page. Shortcodes go in `layouts/_shortcodes/`, partials in `layouts/_partials/`, and render hooks in `layouts/_markup/`.
- `static/css/` and `static/js/` are served as-is. `static/css/style.css` is linked on every page and `@import`s the shared component sheets. Scripts in `static/js/` are linked with `relURL` only when a page needs them.
- `assets/` holds files passed through `resources.Get`.
- Example data lives under `docs/data/`. Friend YAML is in `docs/data/friends/`. Homepage news is in `docs/data/news/`. Change those files when editing the Friends page or the home sidebar; do not add a second copy at the theme root.
- Example documentation lives under `docs/content/docs/` (`type: docs`); the `/posts/` section has been removed, old `/posts/...` URLs alias to the matching docs page (or to the joke page under `docs/content/jokes/`), and the home feed paginates `docs`. The Docs menu entry lives in `docs/config.toml`; the page tree is configured under `[params.treenav]`.

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

Math rendering has three engines, selected by `params.tex.engine`: `mathjax` and `katex` render in the browser, `hugo` renders at build time with Hugo's built-in KaTeX (`transform.ToMath`). Three switches — `math`, `algorithm`, and `tikz` — decide what a page renders; all default to `false`, and page front matter overrides the site value. `baseof.html` calls the `tex.html` partial when either the page or the site sets `tex`, and that partial emits nothing unless one of the three switches is on. All assets ship from npm: `module.mounts` maps `node_modules/{katex,katex-hugo,mathjax,pseudocode}` into `assets/node_modules/...`, and nothing is fetched from a CDN at page load. Each engine's version is `params.tex.<engine>.version` (`mathjax`, `katex`, `hugo`). pseudocode.js is `params.tex.pseudocode`, which also holds its rendering options.

**Two KaTeX copies, deliberately.** `node_modules/katex` serves the client-side `katex` engine and may be bumped independently. `node_modules/katex-hugo` serves the build-time `hugo` engine: its CSS must match the KaTeX embedded in the Hugo release, so it is pinned separately. It is loaded when `params.tex.hugo.output` is not exactly `mathml`, and also when the page uses `tex.algorithm` (pseudocode.js renders through the client-side `katex`). With the default `output = 'mathml'` and no algorithm, the `hugo` engine loads no KaTeX at all.

TikZ is the exception within math: `node-tikzjax` is a Node + WebAssembly renderer (jsdom/memfs, async `tex2svg()`) and cannot run inside a Hugo template, so `scripts/build-tikz.js` pre-renders every TikZ block to a standalone SVG before `hugo` runs and `layouts/_partials/tikz.html` inlines it. The script also publishes the Bakoma fonts the SVGs reference. A site that never runs the script (or a `hugo server` session) keeps the classic TikZJax fallback from `tikzjax.com`.

The default math delimiters are `\(...\)` inline and `\[...\]` block, and they depend on the Goldmark passthrough extension: **Hugo does not merge `[markup]` from a theme**, so every site that renders math must enable the extension in its own config (see `docs/config.toml`). Without it Goldmark turns `\(` into `(` before any engine sees the formula, and `tex.html` warns once per build. The passthrough delimiters must stay in sync with `params.tex.*Delimiter`, because a page that did not opt into math gets its delimiters re-emitted from those params and the `hugo` engine reads the passthrough pairs directly. `$...$` / `$$...$$` remain available by setting those params; do not add `$` / `$` to the passthrough block casually (the extension runs on every page, so `$5 and $10` becomes a formula), and a literal dollar cannot be escaped for the client engines because Goldmark consumes `\$` first.

In this repository, `npm ci` installs KaTeX/MathJax/pseudocode at the theme root; `docs/config.toml` mounts `../node_modules/...` so the example site sees them. Consumers of the theme run `hugo mod npm pack` followed by `npm install` so the consolidated dependencies land in their project root, which is where the theme's `module.mounts` read them. The client `katex` package is 0.19.1. `katex-hugo` stays on 0.18.4 because Hugo 0.168+ renders with KaTeX 0.18.x, and that stylesheet has to match the markup `transform.ToMath` emits.

The build flow for a site in three steps:

1. **`npm run build:icons`** — build each sprite + the lookup map. Source SVG icons live under `rootDir`/`<set>/` (default `static` → `static/svg/ui-oval/`). Config is `sprite.config.js` (optional; inline script defaults apply when absent): `enabled` (set `false` to skip building — e.g. you commit the generated sprites + map), `rootDir` (`static`) is the base every `sprites[].srcList` entry and `spriteDir` resolve against; `spriteDir` (e.g. `svg/sprite`) is where every sprite + the map are written, each `sprites[]` entry `{ srcList, out }` (out = file name inside `spriteDir`) bundles its sources into one independent `<symbol>` sprite (ids are `<dir>_<name>`, `<dir>` = the innermost source directory, so custom sets never collide with the built-in `ui-oval_` ids). Per sprite you can also scope traversal with `recursive` (descend into subdirs), `depth` (max depth below a src dir, `0` = unlimited), and `exclude` (RegExp patterns; `!` negates, last match wins; a dir hit skips that whole subtree). It optimizes each through svgo (colors folded to `currentColor`), builds every sprite, and writes one shared `sprites.json` (in `spriteDir`) → `{ "enabled", "map" }` mapping each configured icon `path` (relative to `rootDir`, e.g. `svg/ui-oval/home-03.svg`) → `{ "sprite": "<out web path>", "id": "<dir>_<name>" }`. So a site can ship several sprites (e.g. a `minimal-ui` set → its own sprite) while templates still resolve any icon by `path`. Duplicate symbol ids **fail the build** — all collisions collected into one error (no early break); on success it logs one `Bundled <src> → <sprite> (N symbols)` per sprite, then `Wrote <mapFile> (N entries)`. `--watch` rebuilds whenever a source `.svg` changes; `--enabled=false` forces a skip, and (when disabled) still rewrites `sprites.json` with an empty map so the site uses loose icon paths.

2. **`npm run build:tikz`** — pre-render TikZ to static SVG. It scans `<site>/content` for `tikz` shortcodes (a `tikz` fence is an ordinary code block and is skipped), renders each unique source with `node-tikzjax`, and writes `assets/tikz/<hash>.svg` (first 16 hex chars of the SHA-256 of the trimmed source; `layouts/_partials/tikz.html` computes the same hash and looks the file up), `assets/tikz/fonts/<family>.ttf` for the font families the SVGs reference, and `assets/tikz/manifest.json` (`{ version, blocks, unique, fonts, renderer }`), which marks build mode for the templates. `--source <dir>` points at the site root (the npm scripts pass `--source docs`), `--clean` wipes the cache first, `--verbose` prints the TeX engine log. Without `node-tikzjax` or without a cache the templates fall back to the client renderer, so the step is opt-in. **Gotcha:** declaring any `module.mounts` entry for the `assets` target replaces the default site `assets` mount, so a site with its own mounts must also add `source = "assets"` / `target = "assets"` (see `docs/config.toml`) or `resources.Get` cannot see the cache.

3. **Sprite → site**: `hugo` (or `hugo server`) — templates never hard-code a sprite path. `layouts/_partials/icon-url.html` reads `sprites.json` (`{ "enabled", "map" }`) ONCE (cached in `hugo.Store`); when `enabled` is truthy it uses the map to turn a configured `path` into `(sprite | relURL)#<id>`, otherwise it uses the loose `path` file directly (e.g. `svg/ui-oval/home-03.svg`), falling back to `svg/placeholder.svg` only when `path` is absent/invalid. The `icon` component and every other icon call site share this resolver. Every sprite + the map are committed, so git-submodule and Hugo-module users skip step 1 unless an icon source changes.

## Components

`layouts/baseof.html` wraps every page: the header partial, the breadcrumb partial, the `main` block, and the footer partial. It always links `static/css/style.css`. That file sets the global page (fonts, colors, lists, headings, footnotes) and `@import`s the shared component sheets, so those sheets are loaded on every page. Put page-wide rules in `style.css`. Put a component's rules in its own sheet under `static/css/`, and `@import` that sheet from `style.css` when it should load everywhere. `baseof.html` links the other sheets only when a page turns that feature on.

Pages:

- `layouts/home.html` renders `/`.
  - Partials: `post-card.html`, `paginator.html`, and `layouts/_partials/sidebar/` (`news`, `recent-updates`, `pinned`, `tag-list`, `category-list`).
  - Styles: `static/css/home.css`, `static/css/paginator.css`.
- `layouts/single.html` renders one post.
  - Pieces: table of contents (`sidetoc.html`, shared with docs), featured image, title, `post-meta.html`, `post-tldr.html`, content, previous/next (`post-prext.html`), related posts (`post-related.html`), jump buttons (`jump-buttons.html`). Front matter `prext` / `related` default on; set either to `false` to hide that block.
  - Sets `body.post-page` through the `body-class` block so the global breadcrumb can align to the article column.
  - Styles: `static/css/post.css` (article layout), `static/css/toc.css`, `static/css/img.css` (featured image and figures), `static/css/prext.css`, `static/css/related.css`, `static/css/jump.css`.
- `layouts/posts/section.html` renders `/posts/`.
  - Calls `post-list.html` with `groupBy "PublishDate"` so pinned posts come first, then the rest under publish-year headings.
  - `post-list.html` is generic: pass any page collection (`{{ partial "post-list.html" .Pages }}`), or a dict with `pages` plus optional `groupBy` / `groupSort` (Hugo's `GroupBy FIELD [SORT]` semantics; date fields group by year). Posts with `pinned: true` always render first; `params.postlist.pinned` sets that group's heading and icon.
  - `layouts/list.html` is the fallback list (it paginates and does not pin). Post-list and pinned-group rules live in `static/css/style.css`.
- `layouts/docs/single.html` and `layouts/docs/section.html` render documentation pages (`type: docs`, created from `archetypes/docs.md`).
  - Left: the page tree navigation from `layouts/_partials/tree-nav.html` (desktop aside, or the mobile `<details>` wrapper when called with `variant=mobile`). `layouts/_partials/tree.html` recursively returns a nested `{page, children}` slice, and `tree-nav.html` renders that data with a recursive named template. A section title links to its page (clicking the current section page's own title toggles it in place instead) and the chevron at the far right toggles its children (native checkbox and labels; without JS they toggle instantly, while `treeNav.js` animates them with a measured height); expanding a category collapses its siblings when `params.treenav.autoCollapse` is true (the site default, matching Docusaurus), while the current path is always reopened. A section page can set `treenav: { collapse: false }` in front matter (site default `params.treenav.collapse`, true) to keep its section expanded when it is not the active page; `true` collapses it outside the active path. Page params win over the site params. The current page's section and its ancestors always open, so clicking a node page reveals its leaf pages. Ancestors of the current page are marked by navy text only, while the current page (leaf or section page) gets the strong lavender/inset-bar highlight. `static/js/treeNav.js` keeps the effective expanded/collapsed state in `sessionStorage` across navigations, applies auto-collapse, animates category changes with a measured height and Docusaurus's dynamic duration/`ease-in-out`, and transitions from the previous page's tree state when a sidebar link is followed, so the old branch collapses while the new one expands. Expanded branches that are not on the current path keep their normal color. Up to 1080px the mobile variant renders above the article.
  - Right: the shared `layouts/_partials/sidetoc.html` (also used by post pages) keeps `toc.show` / `toc.snake` and `snakeTOC2.js` unchanged. The docs layouts always render the page tree and resolve the page's `toc.show` override inline.
  - Styles: `static/css/tree-nav.css` for the page tree and `static/css/docs.css` for the docs layout; docs articles reuse the post card and content rules, and set `body.docs-page` for the breadcrumb offset.
- Taxonomy pages:
  - `layouts/categories/taxonomy.html` renders `/categories/`. `layouts/tags/taxonomy.html` renders `/tags/`.
  - `layouts/more/section.html` renders `/more/` (section hub via `content/more/`); the link list is `layouts/_partials/morehub.html` (`menu.main` children of `identifier = "more"`).
  - Term-size bins: `static/css/taxo.css`. Tag and category link tilt: `style.css`.
  - `layouts/categories/term.html` and `layouts/tags/term.html` render one category or one tag with `post-list.html` (pinned posts first, like `/posts/`).
- `layouts/friends.html` renders `/friends/`.
  - Cards come from the `friend` and `frienmily` shortcodes; `friend` renders through `card.html` with `variant="friend"`.
  - Styles: `static/css/friend.css`.
- `layouts/about.html` renders `/about/`. Spacing for `.about-content` is in `style.css`.
- `layouts/404.html` renders the 404 page through `baseof.html` and has no separate stylesheet.
- Chrome on every page:
  - `layouts/_partials/header.html`. Styles: `static/css/header.css`.
    - Menu entries: `layouts/_partials/header/menu-entry.html`, reused by the desktop `<nav id="menu">` (in `header.html`) and the mobile `layouts/_partials/header/hamburger-menu.html`.
    - Menu icon: `layouts/_partials/icon.html` renders a self-contained inline `<svg aria-hidden="true"><use href="..."/></svg>` from a flat dict — `path` (the icon's key relative to `rootDir=static`, like `svg/ui-oval/home-03.svg`, read from a menu entry's `[menu.main.params.icon]`); optional `class` (a string or a list, joined with spaces) is appended to the header's hard-coded default `menu-icon menu-<id>-icon`; `id` or raw `attrs` set more attribute(s) on the `<svg>` (aria-hidden is always present). It resolves the URL through `layouts/_partials/icon-url.html`, which reads `<rootDir>/<spriteDir>/sprites.json` (`{ "enabled", "map" }`) ONCE, caches it in `hugo.Store`; when `enabled` is truthy it resolves `path` → `(sprite | relURL)#<id>` from the map, otherwise it uses the loose `path` file directly, falling back to `svg/placeholder.svg` only when `path` is absent/invalid — each entry's `sprite` points at whichever sprite holds that icon, so multiple sprites are supported.
  - `layouts/_partials/footer.html`. Styles: `static/css/footer.css`.
  - `layouts/_partials/breadcrumb.html`, called by `baseof.html` directly under the header. Styles: `static/css/breadcrumb.css`. The trail is built from the URL path after the home path (baseURL subpath removed): each segment is matched against `site.Pages`, so a real page supplies its `.Title` / `.RelPermalink`, and an unmatched segment falls back to `humanize` + the path (and is rendered as plain text instead of a dead link). The Home crumb (text and icon) and section icons reuse the matching `menu.main` entry (children included), so the header menu is the single source. `params.breadcrumb.enable` defaults to `true` (page front matter `breadcrumb: false` overrides it); `.separator` takes an icon path or literal text (default `svg/ui-oval/slash-divider.svg`, `""` disables it), and `.label` tunes the landmark label. A page may override `enable` / `label` / `separator` / `title` with a `breadcrumb` front matter map. The page/menu lookup maps are built inline in this partial: production builds cache them in `hugo.Store`, while `hugo server` rebuilds them per page so content and menu changes never come from a stale cache. Post pages get `body.post-page` from `single.html`, which the breadcrumb CSS uses for its article-column offset.
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
- `icon`:
  - Template: `layouts/_shortcodes/icon.html`; renderer: `layouts/_partials/icon.html` (URL resolution comes from `layouts/_partials/icon-url.html`).
  - Renders an inline sprite icon with `name` (or `path`), `size`, `width`/`height`, and `color`; `title`/`ariaLabel` make it non-decorative. Args: `name`, `path`, `set`, `size`, `width`, `height`, `color`, `class`, `id`, `title`, `ariaLabel`, `style`, `attrs`, and `mapPath`. Defaults: `params.icon` (`set`, `size`, `color`, `class`). Styles: `static/css/icon.css` (imported by `style.css`).
  - `icon.html` is also the single renderer for every theme icon (menu, button, breadcrumb, checkbox, carousel, and so on). Template call sites leave `styled` off, so they keep their own classes/styles and do not inherit `params.icon`; the shortcode passes `styled=true` to add the `icon` class and the component defaults.
- `label`:
  - Template: `layouts/_shortcodes/label.html`; renderer: `layouts/_partials/label.html`. Styles: `static/css/label.css` (imported by `style.css`).
  - Renders an inline-flex label from inner content or `text` (inline Markdown), with per-label `size`/`fontSize`, `color`, `backgroundColor`, `border`/`borderWidth`/`borderStyle`/`borderColor`/`borderRadius`, `shadow`, `padding`, `fontWeight`, and `gap`. Optional left/right icon via `icon` (path or bare name), `iconName`/`iconSet`, `iconPos`, `iconSize`, and `iconColor`; the icon is rendered by `icon.html`. Args also include `class`, `id`, `title`, and `ariaLabel`. Defaults: `params.label` (`size`, `color`, `backgroundColor`, border controls, `shadow`, `padding`, `fontWeight`, `gap`, `iconSize`, `iconColor`, `class`). Replaces the removed `mark` shortcode; its `color`, `backgroundColor`, size, and weight controls map to `color`, `backgroundColor`, `fontSize`, and `fontWeight`.
- `card`:
  - Template: `layouts/_shortcodes/card.html`; renderer: `layouts/_partials/card.html`. Styles: `static/css/friend.css` (shared card skin) plus `static/css/card.css` (cover, layouts, tags, focus), imported by `style.css`.
  - A cover + title + description + link + tags card for books, films, repositories, and friend links. Every field is a static argument; no metadata is fetched from the network. The cover is resolved through `image-url.html` (page resource → static → asset → URL), and the overlay link, avatar column, and body reuse the friend card classes. Args: `title`, `description` (inner content wins), `cover`/`image`/`src`, `coverAlt`/`alt`, `coverWidth`, `coverRatio`, `link`/`href`/`url`, `target`, `rel`, `tags`, `layout` (`row`/`column`), `coverPos`, `loading`, `ariaLabel`, `id`, and `class`. Defaults: `params.card` (`layout`, `coverWidth`, `coverRatio`, `coverPos`, `target`, `rel`, `loading`, `class`).
  - The renderer also takes the internal `variant` (`card` default, or `friend` for the original friend markup/classes without the card skin or params defaults) and `coverHTML` (trusted inline cover markup that wins over `cover`). The `friend` shortcode maps one `data/friends` entry onto it with `variant="friend"` and a `coverHTML` avatar, so that shortcode reuses the renderer while keeping `static/css/friend.css` unchanged.
- `button`:
  - Template: `layouts/_shortcodes/button.html`. Styles: `static/css/button.css` (imported by `style.css`).
  - Four core types (`plain`, `primary`, `secondary`, `link`) plus a `download` action preset. Each type supplies default colors; `borderColor`, `tintColor`, and `textColor` override them per button (`tintColor="transparent"` makes an outline button); `link` defaults to a bordered text link. Also `size` (`sm`/`md`/`lg`), `block`, `active`, `disabled`, and native `<button>` vs. `<a role="button">` (`href`). `icon`/`iconPos` reuse `icon.html`; `label` supports inline Markdown. Inside a `buttongroup`, the group's `size` and `disabled` are inherited and the default id is prefixed with the group id, while a child's own size wins.
  - `type="download"` uses the navy download style, adds a download arrow when no `icon` is given, and sets the `download` attribute on a link unless `download=false` (or a file name) is passed.
  - `js` takes either a script URL/path (loaded once per page as `<script src defer>`) or inline source attached as an event handler; `jsMode` forces the reading, and `jsEvent` picks the event (`load` runs after `DOMContentLoaded`). Defaults: `params.button` (`type`, `size`, `block`, `class`).
  - `baseof.html` clears the page's `alice-button-js` registry before the main block, because `Page.Store` survives `hugo server` rebuilds; without the reset a shortcode/template edit would not re-emit a script already registered by the previous render.
- `radio`:
  - Template: `layouts/_shortcodes/radio.html`. Styles: `static/css/radio.css` (imported by `style.css`).
  - A native `<input type="radio">` under an AppKit `NSButton`-style ring: a small circular ring that fills with the accent color and shows a centered dot when selected, so it works without JavaScript and keeps keyboard/screen-reader behavior. Radios that share `name` form one native group. Args: `label` (inline Markdown), `name` (group name; default `radio-<ordinal>`, unique per shortcode), `value` (form value, default the plain-text label or `on`), `checked` (also `selected`/`on`), `disabled`, `tintColor` (selected ring), `dotColor` (inner mark, default White), `borderColor` (unselected ring, default SlateGray), `size` (`small`/`s`, `medium`/`m` default, `large`/`l`), `ariaLabel`, `id`, and `class`; a radio without a label gets an automatic `Radio` accessible name. Defaults: `params.radio` (`size`, `tintColor`, `dotColor`, `borderColor`, `class`). Inside a `buttongroup`, the group id is the default native name and child-id base, and the group's size/disabled are inherited; an explicit child name or size wins.
  - `js` takes a script URL/path (loaded once per page, page-bundle and `assets/` resources included) or inline source attached to the input's `change` event; `jsMode` forces the reading, `jsEvent` picks the event (`load` runs after `DOMContentLoaded`). `baseof.html` clears the page's `alice-radio-js` registry before the main block.
- `checkbox`:
  - Template: `layouts/_shortcodes/checkbox.html`. Styles: `static/css/checkbox.css` (imported by `style.css`).
  - A native `<input type="checkbox">` under a styled square box that fills with the accent color and shows the theme's `svg/ui-oval/check.svg` check mark (resolved through `icon.html`) when selected, so it works without JavaScript and keeps keyboard/screen-reader behavior. Checkboxes are independent; those that share a `name` submit as one form field. Args: `label` (inline Markdown), `name` (default `checkbox-<ordinal>`), `value` (default the plain-text label or `on`), `checked` (aliases `selected` and `on`), `disabled`, `size` (`small`/`s`, `medium`/`m` default, `large`/`l`), `tintColor` (checked fill), `checkColor` (check mark, default White), `borderColor` (unchecked border, default SlateGray), `ariaLabel`, `id`, and `class`; a checkbox without a label gets an automatic `Checkbox` accessible name. Defaults: `params.checkbox` (`size`, `tintColor`, `checkColor`, `borderColor`, `class`). Inside a `buttongroup`, the group id is the default form name and child-id base, and the group's size/disabled are inherited; an explicit child name or size wins.
  - `js` takes a script URL/path (loaded once per page, page-bundle and `assets/` resources included) or inline source attached to the input's `change` event; `jsMode` forces the reading, `jsEvent` picks the event (`load` runs after `DOMContentLoaded`). `baseof.html` clears the page's `alice-checkbox-js` registry before the main block.
- `buttongroup`:
  - Template: `layouts/_shortcodes/buttongroup.html`. Styles: `static/css/buttongroup.css` (imported by `style.css`).
  - Wraps `button`, `radio`, and `checkbox` children in a native `<fieldset>` with an optional `<legend>`; `name` is the visible group title (inline Markdown), not a DOM id or form name. The fieldset `id` (default `buttongroup-<ordinal>`) seeds the default native name and child ids of its button/radio/checkbox children. Args: `name`, `orientation` (`vertical`/`v` default, `horizontal`/`h`), `size`, `disabled`, `ariaLabel`, `id`, and `class`. The group passes `size` to the children (a child's own size wins) and `disabled=true` disables every child; colors stay per control, and there is no group-level `js` because the child controls have different events. Defaults: `params.buttongroup` (`orientation`, `class`). Because Hugo renders nested shortcodes before the parent, the children derive the group id from `.Parent` and read its raw arguments instead of parent-computed state.
- `switch`:
  - Template: `layouts/_shortcodes/switch.html`. Styles: `static/css/switch.css` (imported by `style.css`).
  - A native checkbox with `role="switch"` under a styled track and thumb, so it works without JavaScript and keeps keyboard/screen-reader behavior. The look follows Apple's UISwitch: a borderless pill track, a round thumb with a soft drop shadow, and a short iOS-style ease. Args: `on` (initial state), `tintColor` (on-track color), `thumbColor` (thumb fill, default White), `size` (`small`/`s`, `medium`/`m` default, `large`/`l`), `label` (inline Markdown), `id`, and `class`; a switch without a label gets an automatic `Switch` accessible name. Defaults: `params.switch` (`on`, `tintColor`, `thumbColor`, `size`, `class`).
  - `js` takes a script URL/path (loaded once per page, page-bundle and `assets/` resources included) or inline source attached to the input's `change` event; `jsMode` forces the reading, `jsEvent` picks the event (`load` runs after `DOMContentLoaded`). `baseof.html` clears the page's `alice-switch-js` registry before the main block.
- `slider`:
  - Template: `layouts/_shortcodes/slider.html`. Styles: `static/css/slider.css` (imported by `style.css`). Script: `static/js/slider.js` (linked in `baseof` `<head>` when the page has the shortcode).
  - A native `<input type="range">` under a UISlider-style track and thumb: a thin rounded track whose minimum side is tinted, a white circular thumb with a soft drop shadow, and a short ease. The template computes the initial fill percentage and value readout at build time; `slider.js` keeps both in sync on `input`/`change`. The wrapper and its two rows are `<span>`s, so the control stays valid inside a paragraph; it is a full-width block by default, `width` constrains it (any CSS length/percentage), and `inline=true` switches it to `inline-flex`. Args: `value`, `min`, `max`, `step`, `unit`, `showValue`, `size` (`small`/`s`, `medium`/`m` default, `large`/`l`), `label` (inline Markdown), `tintColor` (minimum track), `trackColor` (remaining track), `thumbColor`, `minIcon`/`maxIcon` (UISlider value images, resolved by `icon.html`), `disabled`, `name`, `ariaLabel`, `id`, `class`, `width`, and `inline`; a slider without a label gets an automatic `Slider` accessible name. Defaults: `params.slider` (`value`, `min`, `max`, `step`, `unit`, `width`, `showValue`, `size`, `tintColor`, `trackColor`, `thumbColor`, `class`).
  - `js` takes a script URL/path (loaded once per page, page-bundle and `assets/` resources included) or inline source attached to the input's `input` event; `jsMode` forces the reading, `jsEvent` picks the event (`load` runs after `DOMContentLoaded`). `baseof.html` clears the page's `alice-slider-js` registry before the main block.
- `textline`:
  - Template: `layouts/_shortcodes/textline.html`. Styles: `static/css/textline.css` (imported by `style.css`).
  - A native `<input type="text">` in a themed single-line field, so it works without JavaScript and keeps keyboard, selection, and screen-reader behavior. Args: `value`, `placeholder`, `label` (inline Markdown), `tip` (inline Markdown, rendered below the field and linked with `aria-describedby`), `icon` (path under `static/`, or a bare name), `iconPos` (`start`/`left` default, `end`/`right`; `before`/`after` are aliases), `iconSet`, `type` (`text` default, `search`, `email`, `url`, `tel`, `password`), `size` (`small`/`s`, `medium`/`m` default, `large`/`l`), `width`, `inline`, `disabled`, `readonly`, `required`, `maxlength`, `autocomplete`, `name`, `ariaLabel` (default `Text input` when unlabelled), `title`, `id`, and `class`. The wrapper is a `<span>` so an inline field stays valid inside a paragraph. Defaults: `params.textline` (`value`, `placeholder`, `size`, `iconPos`, `width`, `class`).
  - `js` takes a script URL/path (loaded once per page, page-bundle and `assets/` resources included) or inline source attached to the input's `input` event, where `this` and `el` are the input and `el.value` is the text; `jsMode` forces the reading, `jsEvent` picks the event (`load` runs after `DOMContentLoaded`). `baseof.html` clears the page's `alice-textline-js` registry before the main block.
- `textfield`:
  - Template: `layouts/_shortcodes/textfield.html`. Styles: `static/css/textfield.css` (imported by `style.css`).
  - A native `<textarea>` in a themed multi-line block, so it works without JavaScript and keeps keyboard, selection, resize, and screen-reader behavior. Initial text comes from the paired shortcode's inner content (outer whitespace trimmed) or the `value` argument; because the template reads `.Inner`, a field with no initial text must be self-closed (`{{< textfield ... />}}`). Args: `value`, `placeholder`, `label` (inline Markdown), `tip` (inline Markdown, rendered below the field and linked with `aria-describedby`), `rows`, `icon`/`iconSet`/`iconPos` (the icon aligns with the first line), `size` (`small`/`s`, `medium`/`m` default, `large`/`l`), `resize` (`none`, `vertical` default, `horizontal`, `both`), `width`, `disabled`, `readonly`, `required`, `maxlength`, `autocomplete`, `name`, `ariaLabel` (default `Text field` when unlabelled), `title`, `id`, and `class`. Defaults: `params.textfield` (`placeholder`, `rows`, `size`, `iconPos`, `resize`, `width`, `class`).
  - `js` takes a script URL/path (loaded once per page, page-bundle and `assets/` resources included) or inline source attached to the textarea's `input` event, where `this` and `el` are the textarea and `el.value` is the text; `jsMode` forces the reading, `jsEvent` picks the event (`load` runs after `DOMContentLoaded`). `baseof.html` clears the page's `alice-textfield-js` registry before the main block.
- `carousel` and `slide`:
  - Image-only carousel; `carousel` wraps one or more `slide` children, and each `slide` is one image.
  - Shared partials: `layouts/_partials/carousel/navigator.html`, `layouts/_partials/carousel/position.html`, and `layouts/_partials/carousel/indicators.html` (holds every indicator style: dots, segments, counter, thumbnails).
  - Styles: `static/css/carousel.css`. Script: `static/js/carousel.js` (linked in `baseof` `<head>` when the page has the shortcode). The carousel frame is a plain background block with no border, radius, or drop shadow. By default `navigatorOverlay=true` and `indicatorOverlay=false`: prev/next float over the image as edge strips, while the indicator sits in a below-image bar. Each can be moved independently between the bar and overlay groups.
  - Defaults: `params.carousel` (`autoplay.*`, `navigator.*`, `indicator.*`, `perView`, `scrollHint`, `loop`, `keyboard`, `effect`, `contentMode`, `aspectRatio`, `captionPosition`, `label`, and `icons`); the shortcode arguments stay flat (`autoplay`, `navigatorOverlay`, `indicatorStyle`, etc.). Per-slide arguments: `image`, `alt`, `caption`, `description`, `captionPosition`, `link`, `target`, `rel`, `width`, `height`, `loading`, `contentMode`, `lightbox`, `class`.
  - `scrollHint` leaves small slivers of the adjacent slides on both edges (slide effect only; ignored with `effect="fade"` or when `perView` covers every slide). With `loop` every position has both peeks; with `loop=false` the first has no left peek and the last no right peek.
  - `perView` shows several images at once (slide effect only; ignored with `effect="fade"`): navigation moves one slide at a time, the counter (when selected) shows the visible range, the `segments` indicator's active segment marks the current position, and screens up to `40em` fall back to one image per view.
  - Touch swipes and mouse drags change slides; horizontal wheel/trackpad scroll (or Shift+wheel) moves one slide per gesture, while vertical scrolling stays with the page. With `effect="slide"` the scroll body follows the drag; `fade` switches on release. A short, fast flick counts as a swipe on release (10px within 300ms), even if it never crossed the drag slop. Touch uses touch events (so touchmove can prevent pan), mouse and pen use pointer events; both are tracked on the window so a flick that ends outside the carousel still commits.
  - Slides may carry `caption` and `description`, rendered in an always-visible frosted panel over the image; links inside stay clickable. `captionPosition` (`bottom-center` default, or another `top|bottom` + `left|center|right` corner) places it; a slide can override it. Both accept inline Markdown, and the caption becomes the alt text when `alt` is omitted.
  - `navigatorOverlay` defaults to `true` and floats prev/next over the image; `navigatorOverlay=false` puts them in the below bar. `indicatorOverlay` defaults to `false` and puts the indicator in the below bar; `indicatorOverlay=true` floats it. The two are independent. `navigatorPosition` places prev/next (`left|center|right|left-right` below; `bottom-left|bottom-center|bottom-right|top-left|top-center|top-right|left-right` overlaid), and `indicatorPosition` places the indicator (`left|center|right` below; the six top/bottom positions overlaid). `left-right` keeps prev/next as full-height edge strips; every other navigator position groups prev+next, and when both are overlaid an equal indicator position merges the group as prev → indicator → next. The below bar uses three zones; overlaid items use floating groups. Position values accept abbreviations (`l/r/c/m/b/t`), e.g. `bc` = `bottom-center` and `lr` = `left-right`. A caption at the same position as an overlay group is shifted inward, clear of the group, while the navigator stays at the edge. The autoplay button picks a free corner, and `indicatorStyle` is `dots` (default), `segments`, `counter`, or `thumbnails`; only one indicator is shown, and an interactive carousel always has one. With `thumbnails`, preview buttons occupy the indicator slot, scroll horizontally when they overflow, and keep the active preview in view; previews past `maxIndex` stay hidden. On screens up to `40em`, the below bar keeps prev / indicator / next on one row and the indicator strip (dots, segments, or thumbnails) scrolls sideways instead of wrapping; the active item is scrolled into view.
  - `autoplay` is a boolean switch (default `false`); `interval` is the delay in milliseconds (default `5000`). When autoplay is on, a corner button toggles autoplay; its label changes between Pause autoplay and Start autoplay, it sits before the slides in the tab order, and it moves to the first free corner when a navigator group or caption occupies the default one. `progressStyle` is `both` (default: thin bar plus ring), `bar`, `ring`, or `none`, and `progressPosition` puts the bar at the top (default) or bottom. `pause` defaults to `false`; set `pause=true` to pause autoplay on hover/focus. The carousel ids are generated from `.Ordinal` and are not configurable. `loop` defaults to `true`; with slide effect, the carousel keeps a continuous scroll coordinate and repositions real slides by ±one content size at the loop points (no DOM cloning or node rotation), so `perView` windows wrap (for example 3–4 → 4–1 → 1–2) and an in-flight scroll can be grabbed; with `loop=false`, prev/next are disabled at the first/last position.
  - Images use the page lightbox vendor when the page enables one; a slide `link` overrides it. `contentMode` picks the image `object-fit`: `scaleToFill` (default, `fill`), `aspectFit` (`contain`), or `aspectFill` (`cover`); set it on the carousel for a shared default or on a slide to override. `aspectRatio` (default `auto` = the ratio of the image shown first) fixes the carousel frame so its height never follows the active image; the script leaves the viewport height to CSS when the frame is fixed, and `contentMode` crops, fits, or stretches inside it. `effect="fade"` cross-fades instead of sliding; without scripting the frame falls back to the image heights.
- `tab` and `tabpanel`: `static/css/tabs.css`.
- `kbd`: `static/css/kbd.css`.
- `ruby`: `static/css/ruby.css`.
- `shell`, `cmd`, and `cmdout`: `static/css/shell.css`.
- `secret`: `static/css/secret.css`.
- `sidenote`: `static/css/sidenote.css`. On docs pages the right gutter belongs to the snaketoc, so `static/css/docs.css` renders `span.sidenote-content` inline instead of floating.
- `dropcap`: `static/css/dropcap.css`.
- `attachment`: `static/css/attachment.css`.
- `friend` and `frienmily`: `friend` maps one data entry onto `card.html` (`variant="friend"`); `frienmily` keeps the original grid markup. Styles: `static/css/friend.css` (the generic `card` reuses this skin; `card.css` adds its cover and tags).
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
  - Partials: `layouts/_partials/tex.html` holds all of it — engine selection, npm asset resolution, the MathJax/KaTeX/hugo markup, pseudocode.js loading, and the TikZ fallback tags. `baseof.html` calls it when `.Params.tex` or `site.Params.tex` exists, and the partial then gates every output on `tex.math` / `tex.algorithm` / `tex.tikz`. Hooks: `layouts/_markup/render-passthrough.html` (build-time delimiters), `render-codeblock-math.html` (the one math fence). TikZ markup itself goes through `layouts/_partials/tikz.html`, called by `_shortcodes/tikz.html`; `.tikz-diagram` rules are in `static/css/tikz.css`. There is deliberately no `render-codeblock-tikz.html`: a fence tagged `tikz` falls through to the normal code block renderer, so only the shortcode renders a diagram.
  - `params.tex.hugo.output` must be exactly `mathml`, `html`, or `htmlAndMathml`; anything else fails the build. Hugo itself only treats `mathml` as MathML and silently renders every other string as HTML, which is why the theme checks before calling `transform.ToMath`.
  - `params.tex.mathjax.version`, `params.tex.katex.version`, and `params.tex.hugo.version` are checked once per build against the mounted `package.json` (the `katex-hugo` copy for the `hugo` engine). `params.tex.pseudocode.version` is checked the same way. A mismatch fails the build.
  - There is a single math code fence, tagged `math`, for every engine. `katex` and `mathjax` are not fence names: Hugo dispatches `render-codeblock-<lang>.html` by the fence info string, so those fences would fall through to `render-codeblock.html` and render as highlighted source. Use `math`.
  - `katex`, `mathjax`, and `pseudocode` are npm dependencies declared in `package.json`. Consumers install them with `hugo mod npm pack` followed by `npm install`. The build tools (`svgo`, `svg-sprite`, `node-tikzjax`) live in `optionalDependencies` so `hugo mod npm pack` does not merge them into consumer dependencies; `npm install` in this repository still installs them. A site that wants static TikZ therefore installs `node-tikzjax` itself (and keeps `scripts/build-tikz.js` from the theme).
  - `config.toml` mounts `node_modules/katex/dist` → `assets/node_modules/katex/dist` (client `katex` engine), `node_modules/katex-hugo/dist` → `assets/node_modules/katex-hugo/dist` (build-time `hugo` engine), `node_modules/mathjax/es5`, and `node_modules/pseudocode/build`. `tex.html` republishes each one with `resources.Copy` under `/npm/<pkg>@<version>/...`, the jsDelivr layout, and keeps the SRI hash from a throwaway `fingerprint`. Nothing comes from a CDN.
  - Always publish through that versioned path rather than pointing at `assets/node_modules/...`: the version is what keeps old and new releases from sharing a font URL, since the font files keep their upstream names and reference each other by relative path. Two gotchas: derive the file name with `path.Base .Name` (`.Name` is already a path, and reading `.RelPermalink` inside a `resources.Match` loop also publishes the original, leaving a duplicate under `assets/node_modules/`).
  - The two KaTeX copies are independent: `katex` can be upgraded freely, while `katex-hugo` must track the KaTeX embedded in the Hugo release, since `transform.ToMath` output depends on it. `katex-hugo` is an npm alias (`"katex-hugo": "npm:katex@<version>"`).
  - `pseudocode.min.css` upstream begins with `@import url(...KaTeX/0.16.7...)`; `tex.html` strips it with `replaceRE` before fingerprinting so only the theme's own KaTeX stylesheet applies.
  - pseudocode.js options are `params.tex.pseudocode` (page front matter `tex.pseudocode` overrides them). They follow the library's global options. Hugo lowercases param keys, so `tex.html` rebuilds the camelCase object it serializes into `window.ALICE_PSEUDOCODE_OPTIONS`; `static/js/renderAlgorithm.js` reads that.
  - MathJax and KaTeX read their delimiters from `params.tex` (or page `tex` front matter): empty values default to `\(...\)` inline and `\[...\]` block, and the Goldmark passthrough extension is what keeps those backslashes intact. `$...$` / `$$...$$` are opt-in through those params. The `hugo` engine takes its delimiters from the passthrough extension instead. `tex.html` links `static/css/math.css` when `tex.math` is on, so wide display math scrolls instead of widening the page.
  - The `hugo` engine renders through `transform.ToMath`; `render-passthrough.html` and `render-codeblock-math.html` do the build-time work. `params.tex.hugo.output` (`mathml` default, `html`, `htmlAndMathml`) is read with `.Param`, so page front matter can override it. `transform.ToMath` runs from a WASM cache and therefore needs a writable `HUGO_CACHEDIR`. `tex.html` ships the `katex-hugo` CSS whenever `output` is not exactly `mathml` and whenever `tex.algorithm` is set, plus the `katex-hugo` JS for the `katex` global pseudocode.js needs.
  - TikZ has two modes, chosen by whether `assets/tikz/manifest.json` exists. **Build mode** (`npm run build:tikz` ran): `_partials/tikz.html` hashes the block source (`strings.TrimSpace`, CRLF→LF, SHA-256, first 16 hex chars), finds `assets/tikz/<hash>.svg`, and inlines it; `tex.html` (also in `<head>`) emits one `<style>` of `@font-face` rules per page from the manifest's font list, publishing `assets/tikz/fonts/<family>.ttf` through `resources.Fingerprint`, so the diagram is self-contained and needs no network. A production build **fails** when the manifest exists but a block has no SVG, rather than shipping an empty figure. **Client mode** (no manifest, or `hugo server`): `_partials/tikz.html` emits the classic `<script type="text/tikz">` and `tex.html` loads TikZJax's CSS + JS from `tikzjax.com`; `hugo server` always takes this path so editing a diagram does not require rerunning the script. The Node writer (`scripts/build-tikz.js`) also moves `\usepackage` / `\usetikzlibrary` lines into the node-tikzjax preamble and wraps the source in `\begin{document}…\end{document}` when the author did not. Fonts come from `node_modules/node-tikzjax/css/bakoma/ttf` (Computer Modern as TTF), and only the families an SVG actually names are copied.
  - Waline's `texRender` follows the page engine (`single.html`): MathJax if loaded, KaTeX otherwise, and none under `hugo` (no client engine is guaranteed there).
- Waline comments: `static/css/waline.css`, linked from `baseof.html` when the page sets `waline`.
- Markup only, no theme stylesheet: `bilibili`, `spotify`, `netease-cloud-music`, `loremipsum`. The `date` template is currently a stub that emits nothing.

Scripts in `static/js/` are served as-is and linked with `relURL`. A template loads each one only when that page needs it:

- `static/js/jumpButtons.js`
  - Loaded by the `jump-buttons.html` partial on every post and docs page.
  - Jump-to-top and jump-to-bottom buttons. Styles: `static/css/jump.css`.
- `static/js/treeNav.js`
  - Loaded by `layouts/docs/single.html` and `layouts/docs/section.html` on every docs page.
  - Restores the page tree's expanded/collapsed branches from `sessionStorage` and records the effective state on each load, so a branch opened because it is on the current path also stays open after following a link elsewhere; the branch leading to the current page is always reopened. Expanding a category collapses its sibling categories (when `params.treenav.autoCollapse` is true; site-only). A section page that sets `treenav.collapse: true` is collapsed outside the active path, and one that sets `false` stays expanded; the current page's section and its ancestors always open. The site default is `params.treenav.collapse` (`true`), and page front matter overrides it (page params win); the active section and its ancestors always open. Category changes animate with a measured height using Docusaurus's dynamic duration and `ease-in-out` (`prefers-reduced-motion` applies the final state immediately). A sidebar link click leaves a transition marker: on the next page the tree starts from the previous page's saved state and animates every changed branch simultaneously (the old category collapsing while the new one expands); a direct load/refresh applies the settled state without animation. Clicking the current section page's own title toggles that branch in place without a reload. `html.tree-nav-restoring` suppresses the chevron rotation while the initial state is applied.
- `static/js/copyCodeBlock.js`
  - Loaded by `baseof.html` when the page sets `codeblock.cursed`.
  - Copies a Chroma code block. The copy button is styled in `static/css/code.css`.
- `static/js/carousel.js`
  - Loaded by `baseof.html` when the page uses the `carousel` shortcode.
  - Drives `carousel`/`slide` slides, per-view layout, height, autoplay, indicators, touch swipes, mouse drags, and horizontal wheel/trackpad navigation. Styles: `static/css/carousel.css`.
  - The slide track is driven by a requestAnimationFrame scroll body (Embla-style duration + friction), not a CSS transform transition; drag, wheel, buttons, and keyboard update the same target. In loop mode the scroll coordinate wraps by one content size and the real slides are translated by ±that size; there are no clones and no CSS scroll-snap.
- `static/js/slider.js`
  - Loaded by `baseof.html` when the page uses the `slider` shortcode.
  - Syncs each native range input's `--slider-fill` custom property and `.slider-value` readout, appending the input's `data-unit` and updating `aria-valuetext`. Styles: `static/css/slider.css`.
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
