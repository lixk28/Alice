# AGENTS.md

## Example site

Start the example site with:

```bash
hugo server --source=docs --bind 127.0.0.1 --port 1314 --disableFastRender
```

Open it in the browser at http://localhost:1314.

After code changes, do not start this server on your own to verify the site. Assume the user runs it when they want a preview, or the server is already started and listening.

The published GitHub Pages site is https://lixk28.github.io/Alice/. That is the official deployment of the example site, not a substitute for the local server.

## Project Structure

This repository is the Alice theme. Theme templates, static files, assets, and the default config live at the repository root. `docs/` is the example site. Hugo is started with `--source=docs`; `docs/config.toml` sets `theme = "Alice"` and `themesDir = "../.."`, so the theme resolves to this repository.

Change theme behavior in the root `layouts/`, `static/`, `assets/`, and `config.toml`. Change example posts, example data, and the example site's own settings under `docs/`. The root `config.toml` is the theme default. `docs/config.toml` overrides it for the example site. When a key exists in both files, change `docs/config.toml` for it to show up at http://localhost:1314.

CI uses Hugo 0.170.0 (single binary; the extended edition was removed upstream in 0.170).

- `layouts/` holds the templates. `layouts/baseof.html` wraps every page. Shortcodes go in `layouts/_shortcodes/`, partials in `layouts/_partials/`, and render hooks in `layouts/_markup/`.
- `static/css/` and `static/js/` are served as-is. `static/css/style.css` is linked on every page and `@import`s the shared component sheets. Scripts in `static/js/` are linked with `relURL` only when a page needs them.
- `assets/` holds files passed through `resources.Get`.
- Example data lives under `docs/data/`. Friend YAML is in `docs/data/friends/`. Homepage news is in `docs/data/news/`. Change those files when editing the Friends page or the home sidebar; do not add a second copy at the theme root.

Which template, stylesheet, and script belongs to which page or shortcode is listed under Components.

## Components

`layouts/baseof.html` wraps every page: the header partial, the `main` block, and the footer partial. It always links `static/css/style.css`. That file sets the global page (fonts, colors, lists, headings, footnotes) and `@import`s the shared component sheets, so those sheets are loaded on every page. Put page-wide rules in `style.css`. Put a component's rules in its own sheet under `static/css/`, and `@import` that sheet from `style.css` when it should load everywhere. `baseof.html` links the other sheets only when a page turns that feature on.

Pages:

- `layouts/home.html` renders `/`.
  - Partials: `post-card.html`, `paginator.html`, and `layouts/_partials/sidebar/` (`news`, `recent-updates`, `tag-list`, `category-list`).
  - Styles: `static/css/home.css`, `static/css/paginator.css`.
- `layouts/single.html` renders one post.
  - Pieces: table of contents, featured image, title, `post-meta.html`, `post-tldr.html`, content, previous/next (`post-prext.html`), related posts (`post-related.html`), jump buttons. Front matter `prext` / `related` default on; set either to `false` to hide that block.
  - Styles: `static/css/post.css` (article layout), `static/css/toc.css`, `static/css/img.css` (featured image and figures), `static/css/prext.css`, `static/css/related.css`, `static/css/jump.css`.
- `layouts/posts/section.html` renders `/posts/`.
  - Grouped by year through `post-list.html` and `post-item.html`.
  - `layouts/list.html` is the fallback list. List-item rules live in `style.css`.
- Taxonomy pages:
  - `layouts/categories/taxonomy.html` renders `/categories/`. `layouts/tags/taxonomy.html` renders `/tags/`.
  - `layouts/more/section.html` renders `/more/` (section hub via `content/more/`); the link list is `layouts/_partials/morehub.html` (`menu.main` children of `identifier = "more"`).
  - Term-size bins: `static/css/taxo.css`. Tag and category link tilt: `style.css`.
  - `layouts/categories/term.html` and `layouts/tags/term.html` render one category or one tag with `post-list.html`.
- `layouts/friends.html` renders `/friends/`.
  - Cards come from the `friend` and `frienmily` shortcodes.
  - Styles: `static/css/friend.css`.
- `layouts/about.html` renders `/about/`. Spacing for `.about-content` is in `style.css`.
- `layouts/404.html` renders the 404 page and has no separate stylesheet.
- Chrome on every page:
  - `layouts/_partials/header.html`. Styles: `static/css/header.css`.
    - Menu entries: `layouts/_partials/header/menu-entry.html` and `menu-icon.html`.
    - Menu icons: path relative to `static/` via `[menu.main.params] icon`; default `svg/menu/{identifier}.svg` (built-ins under `static/svg/menu/`). Rendered as CSS-mask `span.menu-icon`.
    - Nested menus use the shared `dropdown` partial with Hugo native `parent` children (`menu-entry.html`).
  - `layouts/_partials/footer.html`. Styles: `static/css/footer.css`.
  - `layouts/_partials/head-extra.html`: empty hook called at the end of `<head>` in `baseof.html`. Sites override it to inject page CSS/JS without copying `baseof`.

Shortcodes in `layouts/_shortcodes/` are used inside post content, and on the friends page. Unless noted, their CSS is imported by `style.css`:

- Admonitions: `note`, `tip`, `info`, `help`, `alert`, `admonition`, and `details`.
  - Shared partial: `layouts/_partials/details.html`.
  - Styles: `static/css/admonition.css`, `static/css/details.css`.
- `dropdown`:
  - Shared partial: `layouts/_partials/dropdown.html` (also used by header menu entries with children).
  - Styles: `static/css/dropdown.css`. Script: `static/js/dropdown.js` (linked in `baseof` `<head>` when the page has the shortcode or the header menu has children).
  - Left side optional `title` (markdownified); right side play caret (`static/svg/minimal-ui/play-1001.svg`). Header menu entries still pass left-side HTML into the partial.
  - Mode `hover` (default) or `click` via shortcode arg, `params.dropdown.mode`, or `params.header.dropdown.mode` for the header. Hamburger menus always use `click`.
- `tab` and `tabpanel`: `static/css/tabs.css`.
- `shell`, `cmd`, and `cmdout`: `static/css/shell.css`.
- `secret`: `static/css/secret.css`.
- `sidenote`: `static/css/sidenote.css`.
- `mark`: `static/css/mark.css`.
- `dropcap`: `static/css/dropcap.css`.
- `resource`: `static/css/resource.css`.
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

## Git commits

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
