---
title: "Keyboard"
description: "Inline keyboard keys and shortcuts."
type: docs
aliases: ["/docs/shortcodes/widgets-and-components/kbd/"]
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

## Usage

Pass one or more keys as positional arguments. Each key is rendered as a
`<kbd>` element, with a separator between keys:

Press {{< kbd "Esc" >}} to leave the field, or {{< kbd "Ctrl" "K" >}} to open
the command palette.

Multiple keys work the same way:

{{< kbd "Shift" "Ctrl" "P" >}}

## Parameters

| Name | Description |
| --- | --- |
| positional keys | One or more key labels. Each is rendered as `<kbd>`. |
| `keys` | Named alternative: comma-separated keys, e.g. `keys="Ctrl,K"`. |
| `sep` | Separator between keys. Default: `+`. |
| `class` | Extra class on the `.kbd-combo` wrapper. |

Hugo does not allow mixing named and positional parameters. Use positional keys
for the default `+` separator, or the named `keys` form when you need a custom
separator:

```md
{{</* kbd keys="g,i" sep="then" */>}}
```

{{< kbd keys="g,i" sep="then" >}}

## Theming

The global `kbd` rule lives in `static/css/kbd.css`:

```css
kbd {
    font-family: var(--mono-font);
    border: 1px solid SlateGray;
    border-bottom-width: 2px;
    background-color: GhostWhite;
}
```

Override `kbd`, `.kbd-combo`, or `.kbd-sep` to change the key shape, spacing,
or separator color.
