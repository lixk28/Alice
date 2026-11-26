---
title: "Date"
description: "Reserved date and time shortcode; the current template is a stub."
type: docs
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
weight: 48
toc:
    show: true
    snake: true
codeblock:
    highlight: true
    cursed: true
---

> **Current status:** the `date` shortcode is a stub. Its template reads the
> arguments below but does not emit any HTML, so it renders nothing on the page.
> Do not rely on it in published content yet.

## Parameters

| Name | Description |
| --- | --- |
| `year` | Year value, read by the template. |
| `month` | Month value, read by the template. |
| `day` | Day value, read by the template. |
| `hour` | Hour value, read by the template. |
| `minute` | Minute value, read by the template. |
| `seconds` | Seconds value, read by the template. |
| `zone` | Time zone value, read by the template. |

The arguments are currently only assigned to local variables. There are no
defaults and no output.

## Usage

The intended call shape is:

```md
{{</* date year="2026" month="11" day="26" zone="Asia/Tokyo" */>}}
```

Until the template is implemented, write the date directly in Markdown or use
the page's `date` front matter when a machine-readable value is enough.
