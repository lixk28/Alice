---
title: "{{ replace .Name "-" " " | title }}"
description: ""
keywords: []
date: {{ .Date }}
lastmod: {{ .Date }}
type: docs
draft: true

# Order in the left docs page tree and in section page lists.
weight: 10

# Short label for the docs tree and breadcrumbs. Empty uses the title.
linkTitle: ""

# Page tree navigation. Page params override `params.treenav` (page params
# win); `autoCollapse` is site-only. `collapse = true` collapses this section
# outside the active path; set `collapse: false` to keep it expanded. The
# active section and its ancestors always open.
#   treenav:
#       collapse: false

toc:
    show: true
    snake: true

# Content feature switches shared with posts. Remove what the page does not
# use; a missing switch falls back to the site default.
tab:
    cursed: true
codeblock:
    highlight: true
    cursed: true
lightbox:
    # fancybox or glightbox
    vendor: fancybox
tex:
    # mathjax | katex | hugo (build time)
    engine: katex
    math: false
    algorithm: false
    tikz: false
codeeditor:
    # (codemirror5 | cm5) or (codemirror6 | cm6)
    vendor: codemirror5
    addons: []
    modes: []
mermaid: false
---
