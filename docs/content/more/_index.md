---
title: More
---

## What's "More" 😄

**More** is an optional special **section** at `/more/` (`content/more/`). It holds links to other sections and taxonomies so the header menu stays short: keep the main items on the top bar, and tuck the rest under More when you still want them in the nav without crowding it.

- The menu item (`identifier = "more"`) in the header opens a dropdown of those quick links.
- This page lists the **same** children (`parent = "more"`), so the hub and dropdown stay in sync.

On this example site:

- Categories and Tags stay on the top bar.
- More’s children are:
    - **Gallery** (another section showing photos).
    - **Jokes** (a taxonomy containing jokes).

## Configure your more page

### Enable more section

More is **off by default** (the theme does not ship a More menu entry or `content/more/`). To enable it:

1. Add `content/more/_index.md` — its body is rendered under `.more-content` on `/more/` (after the hub list).
2. Add a `[[menu.main]]` with `identifier = "more"` and `url = "/more/"`.

Note that please keep More itself out of `mainSections` unless you want it in the home feed.

```toml
[[menu.main]]
    identifier = "more"
    name = "More"
    url = "/more/"
    weight = 5
```

### Add new taxos

Example: **Jokes**.

1. Add it under `[taxonomies]` (singular key → plural name), e.g. `joke = "jokes"`. Redeclare every taxonomy you need — a bare `[taxonomies]` replaces Hugo’s defaults.
2. Tag posts in front matter, e.g. `jokes: ["Demo"]`.
3. Optional: `content/jokes/_index.md` for the taxonomy list title / description.
4. Point More at it with a menu child (`parent = "more"`).

```toml
[taxonomies]
    category = "categories"
    tag = "tags"
    joke = "jokes"

[[menu.main]]
    identifier = "jokes"
    name = "Jokes"
    url = "/jokes/"
    parent = "more"
    weight = 2
    # Optional; falls back to content/jokes/_index.md description.
    # [menu.main.params]
    #     description = "…"
```

### Add new sections

Example: **Gallery** (same idea as More itself).

1. Create the section under `content/gallery/` (e.g. `_index.md` plus page bundles).
2. Add `"gallery"` to `params.mainSections` if it should appear in the home feed / related lists.
3. Point More at it with a menu child (`parent = "more"`). Do **not** put gallery under `[taxonomies]`.

```toml
[params]
    mainSections = ["posts", "gallery"]

[[menu.main]]
    identifier = "gallery"
    name = "Gallery"
    url = "/gallery/"
    parent = "more"
    weight = 1
    # Optional; falls back to content/gallery/_index.md description.
    # [menu.main.params]
    #     description = "…"
```

## Customize your own more page

Theme templates (copy into your **site** `layouts/` at the same path to override):

- `layouts/more/section.html` — the `/more/` page shell: title, hub list, then this file’s body in `.more-content`.
- `layouts/_partials/morehub.html` — the hub list (More menu children: name, kind, description).

What to change:

- Link list look only → override `_partials/morehub.html`.
- Whole page layout → override `more/section.html`.
- Text under the list only → edit this `_index.md`.
