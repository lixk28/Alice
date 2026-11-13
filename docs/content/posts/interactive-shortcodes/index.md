---
title: "Alice (4): Interactive Shortcodes"
description: ""
keywords: []
date: 2024-10-04T00:09:24+08:00
lastmod: 2024-10-04T00:09:24+08:00
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
jokes: ["Demo"]
toc:
    show: true
    cursed: false
    snake: true
tab:
    cursed: true
codeblock:
    highlight: true
    cursed: true
lightbox:
    # fancybox or glightbox
    vendor: fancybox
tex:
    # katex or mathjax
    engine: katex
    math: false
    algorithm: false
    tikz: false
mermaid: false
---

## Dropdown

Floating panel with an optional left-side `title` and a play caret on the right. The same partial also powers nested header menu items (any `menu.main` entry with `parent` children).

Usage:

```
{{</* dropdown title="More" mode="hover" */>}}
- [Documentation](/categories/documentation/)
- [Alice](/tags/alice/)
{{</* /dropdown */>}}
```

Parameters:

| Name | Description |
| --- | --- |
| `title` | Left-side label; passed through `markdownify` (links work) |
| `mode` | <ul><li><code>hover</code>: open on hover; click caret to dismiss</li><li><code>click</code>: click caret to toggle</li></ul>Default: <code>params.dropdown.mode</code> or <code>hover</code> |

Examples:
- Click mode (`mode="click"`):
{{< dropdown title="More" mode="click" >}}
- [Documentation](/categories/documentation/)
- [Alice](/tags/alice/)
- [Markdown](/tags/markdown/)
{{< /dropdown >}}

- Hover mode (`mode="hover"`):
{{< dropdown title="Browse" mode="hover" >}}
- [Categories](/categories/)
- [Tags](/tags/)
- [Posts](/posts/)
{{< /dropdown >}}

- Markdown `title` with a link:
{{< dropdown title="[Categories](/categories/)" mode="click" >}}
- [Documentation](/categories/documentation/)
{{< /dropdown >}}
