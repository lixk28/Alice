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

# Docs pages render a left page tree and, when this is on, the snaketoc on
# the right. Set `nav: false` in this map to drop the left tree on one page.
docs:
    nav: true

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
