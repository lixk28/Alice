---
title: "{{ replace .Name "-" " " | title }}"
description: ""
keywords: []
date: {{ .Date }}
lastmod: {{ .Date }}
type: posts
draft: true
# Show this post first on /posts/ and category/tag lists
pinned: false
categories: []
tags: []
tldr:
    title: ""
    content: ""
card:
    # auto, portrait or landscape
    layout: auto
    thumbnail: ""
featuredimage:
    src: ""
    title: ""
toc:
    show: true
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
    # mathjax | katex | hugo (build time)
    engine: mathjax
    # Site defaults live in params.tex; these are per page.
    math: false
    algorithm: false
    tikz: false
    # Optional overrides: *Delimiter keys and a pseudocode block.
    # See the math docs.
codeeditor:
    # (codemirror5 | cm5) or (codemirror6 | cm6)
    vendor: codemirror5
    # https://codemirror.net/5/doc/manual.html#addons
    addons: []
    # https://codemirror.net/5/mode
    modes: []
waline:
    language: en
    reaction: false
mermaid: false
prext: true
related: true
---
