---
title: "Secret"
description: "Visually hidden text that is revealed on hover."
type: docs
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
weight: 50
toc:
    show: true
    snake: true
codeblock:
    highlight: true
    cursed: true
---

## Usage

Inline content stays in the current paragraph:

A {{< secret >}}because light attracts bugs{{< /secret >}} punchline is hidden
until you hover it.

Set `display="block"` for a standalone hidden paragraph:

{{< secret display="block" title="Spoiler" >}}
This paragraph is hidden until you hover it.
{{< /secret >}}

The inner content is parsed as Markdown, so links, code, and inline math work
inside it.

## Parameters

| Name | Description |
| --- | --- |
| `title` | Tooltip text on the hidden element. Default: `You know too much`. |
| `display` | `inline` (default) or `block`. `block` renders a `<p class="secret">`. |

## Theming

`static/css/secret.css` exposes:

```css
:root {
    --secret-hidden-color: Black;
    --secret-reveal-color: White;
}
```

The element uses the hidden color for both text and background, then switches
the text color on hover. Override the variables to retheme every secret.

## Caveat

This is a visual effect only. The content is still present in the HTML and
accessible to screen readers, search engines, and view-source. Do not use it
for actual secrets.
