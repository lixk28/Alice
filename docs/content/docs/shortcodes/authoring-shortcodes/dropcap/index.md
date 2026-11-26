---
title: "Dropcap"
description: "A floated initial letter for the start of a paragraph."
type: docs
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
weight: 49
toc:
    show: true
    snake: true
codeblock:
    highlight: true
    cursed: true
---

## Usage

Place the shortcode at the start of a paragraph and pass the first letter with
`char`. The default is `T`; the shortcode does not read the following text, so
set the letter explicitly when the paragraph starts with something else:

```md
{{</* dropcap char="A" */>}}lice opens this paragraph with a floated initial.
```

The shortcode is an inline `<span>`, so it works inside a paragraph and the text
continues beside the floated letter.

## Styles

`style="plain"` (default) colors the letter with `MidnightBlue`:

```md
{{</* dropcap char="A" */>}}lice opens this paragraph.
```

`style="paint"` fills a `MidnightBlue` block and sets the letter to `MintCream`:

```md
{{</* dropcap char="P" style="paint" */>}}aint is the block version.
```

## Parameters

| Name | Description |
| --- | --- |
| `char` | Character to render. Default: `T`. |
| `style` | `plain` (default) or `paint`. |

## Theming

The component is a floated `<span>`:

```css
span[class^="dropcap"] { /* size, float, spacing */ }
span.dropcap-plain { color: MidnightBlue; }
span.dropcap-paint { background: MidnightBlue; color: MintCream; }
```

Override the class styles to change the size or colors.

## Example

{{< dropcap char="A" >}}lice opens this paragraph with a floated initial. The
paragraph continues beside the letter for several lines, which is how a drop cap
is meant to work in running text. When the paragraph ends, the next block
returns to the full column width.

{{< dropcap char="P" style="paint" >}}aint uses the filled block style. The
second example starts after the first paragraph, and no heading follows it, so
both letters sit in the running text without disturbing the page structure.
