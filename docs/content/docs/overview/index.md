---
title: "Overview"
description: "An introduction to the Alice theme and how its documentation is organized."
date: 2024-10-04T00:09:24+08:00
lastmod: 2024-10-04T00:09:24+08:00
pinned: true
type: docs
weight: 10
aliases: ["/posts/overview/"]
categories: ["Documentation"]
tags: ["Alice"]
toc:
    show: true
    snake: true
---

Alice is a classic, editorial Hugo theme for blogs and documentation. It keeps
plain Markdown readable, adds a small set of reusable components, and lets each
site turn those components on or off.

## Documentation map

- [Basic Markdown Syntax](../basic-markdown-syntax/) covers headings, lists,
  links, images, tables, and other everyday Markdown.
- [Markdown Options and Extensions](../markdown-options-and-extensions/) covers
  the Goldmark settings that change how Markdown renders.
- [Shortcodes](../shortcodes/) covers the component library and content helpers:
    - [Widgets & Components](../shortcodes/widgets-and-components/) covers icons, labels,
      buttons, form controls, tabs, dropdowns, admonitions, details, the
      carousel, and the code editor.
    - [Authoring Shortcodes](../shortcodes/authoring-shortcodes/) covers
      attachments, sidenotes, commands, math, diagrams, dropcaps, secrets, and
      other content helpers.
    - [Miscellaneous Shortcodes](../shortcodes/miscellaneous-shortcodes/)
      covers the smaller helpers that do not belong to a component.
- [Configuration and Customizations](../configuration-and-customizations/)
  covers site parameters, menus, and theme overrides.

## Getting help

Each docs page keeps its own table of contents on the right. The page tree on
the left follows the sections under `content/docs/`, so a new folder with an
`_index.md` becomes a new group in the navigation.
