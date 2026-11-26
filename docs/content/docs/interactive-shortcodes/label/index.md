---
title: "Label"
description: "Compact inline labels with colors, borders, shadows, and icons."
date: 2024-10-04T00:09:24+08:00
lastmod: 2024-10-04T00:09:24+08:00
type: docs
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
weight: 52
toc:
    show: true
    snake: true
codeblock:
    highlight: true
    cursed: true
---

`label` renders a compact inline label for one-line text. The text comes from the inner content (inline Markdown) or the `text` argument. Typography, color, background, border, and shadow are direct CSS controls, so a label can be neutral, colored, bordered, or elevated without adding new variants. It replaces the old `mark` shortcode: use `color`, `backgroundColor`, `fontSize`, and `fontWeight` for the same highlighting controls.

{{< label >}}Default{{< /label >}}
{{< label backgroundColor="AliceBlue" borderColor="RoyalBlue" color="Navy" >}}Info{{< /label >}}
{{< label backgroundColor="Honeydew" borderColor="MediumSeaGreen" color="DarkGreen" >}}Success{{< /label >}}
{{< label backgroundColor="MistyRose" borderColor="Crimson" color="DarkRed" shadow=".1em .1em .2em LightSlateGray" >}}Danger{{< /label >}}

Sizes:

{{< label size="2xs" >}}2XS{{< /label >}}
{{< label size="xs" >}}XS{{< /label >}}
{{< label size="sm" >}}SM{{< /label >}}
{{< label size="md" >}}MD{{< /label >}}
{{< label size="lg" >}}LG{{< /label >}}

Icons can sit on the left (default) or the right:

{{< label icon="check" >}}Passed{{< /label >}}
{{< label icon="chevron-right" iconPos="right" >}}Next{{< /label >}}
{{< label icon="info-square" iconColor="RoyalBlue" >}}Note{{< /label >}}
{{< label icon="check" iconColor="White" backgroundColor="Navy" borderColor="Navy" color="White" >}}Done{{< /label >}}

A bare `icon` value is an icon name; a path-shaped value such as `svg/ui-oval/check.svg` is used directly. `iconName` names an icon in `iconSet`.

An icon-only label takes its accessible name from `ariaLabel` or `title`: {{< label icon="check" title="Done" />}}

Free-form styling with `fontSize`, `border`, `shadow`, and the other controls:

{{< label fontSize="1.1rem" color="Navy" backgroundColor="Lavender" border="none" >}}Custom font{{< /label >}}
{{< label border="2px dashed SlateGray" shadow=".15em .15em 0 Silver" >}}Dashed{{< /label >}}

A self-closing label uses `text`:

{{< label text="New" backgroundColor="Navy" borderColor="Navy" color="White" />}}

## Usage

```
{{</* label backgroundColor="AliceBlue" borderColor="RoyalBlue" color="Navy" */>}}Info{{</* /label */>}}

{{</* label icon="check" iconPos="right" size="lg" */>}}Passed{{</* /label */>}}
```

## Parameters

| Name | Description |
| --- | --- |
| `text` | Label text for a self-closing shortcode; inner content wins. |
| `size` | `2xs`, `xs`, `sm`, `md`, or `lg`, or a CSS font-size length. Default: `params.label.size` or `sm`. |
| `fontSize` | CSS font-size override. |
| `color` | Text color (any CSS color). |
| `backgroundColor` | Background color (any CSS color). |
| `border` | Full CSS border shorthand, e.g. `1px solid Silver`; wins over the individual border controls. |
| `borderWidth`, `borderStyle`, `borderColor` | Border width, style, and color. Defaults: `1px solid Silver`. |
| `borderRadius` | Border radius. Default: `.3em`. |
| `shadow` | CSS `box-shadow`. Default: none. |
| `padding` | CSS padding shorthand; overrides the size preset's padding. |
| `fontWeight` | CSS `font-weight`. Default: `500`. |
| `gap` | Gap between the icon and text. Default: follows the size preset. |
| `icon` | Icon path, or a bare icon name such as `check`. |
| `iconName` | Icon name inside `iconSet`. |
| `iconSet` | Icon set directory under `static/svg` for `iconName`; defaults to `params.icon.set`. |
| `iconPos` | `left` (default) or `right`; `start`/`end` and `before`/`after` are aliases. |
| `iconSize` | CSS icon size. Default: `1em`. |
| `iconColor` | CSS icon color. Default: the label text color. |
| `class`, `id` | Extra class(es) and id on the label span. |
| `title` | Native tooltip. |
| `ariaLabel` | Accessible name, useful for an icon-only label. |

## Site-wide defaults and theming

```toml
[params.label]
    size = "sm"
    color = ""
    backgroundColor = ""
    border = ""
    borderWidth = ""
    borderStyle = ""
    borderColor = ""
    borderRadius = ""
    shadow = ""
    padding = ""
    fontWeight = ""
    gap = ""
    iconSize = ""
    iconColor = ""
    class = ""
```

`static/css/label.css` exposes `--label-font-size`, `--label-color`, `--label-bgcolor`, `--label-border-*`, `--label-shadow`, `--label-padding-*`, `--label-gap`, and `--label-icon-size`, so a custom stylesheet can retheme every label.
