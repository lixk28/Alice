---
title: "Icon"
description: "Render inline SVG icons from the theme's sprite."
date: 2024-10-04T00:09:24+08:00
lastmod: 2024-10-04T00:09:24+08:00
type: docs
aliases: ["/docs/interactive-shortcodes/icon/", "/docs/ui-components/icon/", "/docs/shortcodes/ui-components/icon/", "/docs/shortcodes/widgets-components/icon/"]
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
weight: 51
toc:
    show: true
    snake: true
codeblock:
    highlight: true
    cursed: true
---

`icon` renders an inline SVG from the theme's icon sprite. The icon inherits the surrounding text color by default; `color` and `size` override it per use. `size` accepts any CSS length, and a bare number means pixels.

{{< icon name="lightbulb-05" >}} default size (1em)<br>
{{< icon name="lightbulb-05" size="16" >}} 16px<br>
{{< icon name="lightbulb-05" size="24" color="Navy" >}} 24px, Navy<br>
{{< icon name="lightbulb-05" size="2em" color="RoyalBlue" >}} 2em, RoyalBlue

Icons flow with text too: a {{< icon name="check" color="Green" >}} check, a {{< icon name="x-close" color="Crimson" >}} cross, and a {{< icon name="info-square" color="RoyalBlue" >}} note.

An icon with `title` is announced as an image rather than hidden: {{< icon name="help-circle" title="Help" >}}

## Usage

```
{{</* icon name="check" size="24" color="Navy" */>}}

{{</* icon path="svg/ui-oval/check.svg" size="1.5em" */>}}
```

A bare `name` is looked up in `params.icon.set` (default `ui-oval`), so `name="check"` renders `svg/ui-oval/check.svg`. Use `path` for a custom icon under `static/`, or a path-shaped `name` such as `name="svg/my-set/logo.svg"`.

## Parameters

| Name | Description |
| --- | --- |
| `name` | Icon name in `set`, e.g. `check`; a name containing `/` or ending in `.svg` is treated as a path. |
| `path` | Icon path relative to `static/`, e.g. `svg/ui-oval/check.svg`; wins over `name`. |
| `set` | Icon set directory under `static/svg` for `name`. Default: `params.icon.set` or `ui-oval`. |
| `size` | CSS length applied to width and height; a bare number means px. Default: `params.icon.size`, then `1em`. |
| `width`, `height` | Per-dimension CSS length overrides; a bare number means px. |
| `color` | Any CSS color (named, hex, `rgb()`, `hsl()`, or `var(--token)`). Empty inherits the text color. |
| `class`, `id` | Extra class(es) and id on the `<svg>`. |
| `title` | Tooltip and accessible name; renders a `<title>`. |
| `ariaLabel` | Accessible name; defaults to `title`. Without either, the icon is `aria-hidden` and decorative. |
| `style`, `attrs` | Extra inline CSS and raw attributes on the `<svg>`. |
| `mapPath` | Custom `sprites.json` path, for an advanced sprite setup. |

## Site-wide defaults and theming

```toml
[params.icon]
    set = "ui-oval"
    size = ""
    color = ""
    class = ""
```

`static/css/icon.css` exposes `--icon-size`, `--icon-color`, `--icon-vertical-align`, `--icon-width`, and `--icon-height`, so a custom stylesheet can retheme every icon.
