---
title: "TextLine"
description: "A themed single-line text input."
date: 2024-10-04T00:09:24+08:00
lastmod: 2024-10-04T00:09:24+08:00
type: docs
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
weight: 61
toc:
    show: true
    snake: true
codeblock:
    highlight: true
    cursed: true
---

`textline` renders a themed single-line text field: a white input with a thin SlateGray border, a small inset shadow, and a short focus ring. It is a native `<input>` whose type defaults to `text`, so it works without JavaScript and keeps the browser's keyboard, selection, and screen-reader behavior. `label` and `tip` accept inline Markdown.

## Usage

```
{{</* textline label="Display name" placeholder="Alice" tip="Shown on your profile and posts." */>}}

{{</* textline icon="user-01" placeholder="Username" ariaLabel="Username" */>}}

{{</* textline label="Search" icon="search" iconPos="right" js="console.log(el.id, el.value)" */>}}
```

A labelled field with a placeholder and a hint below it:

{{< textline label="Display name" placeholder="Alice" tip="Shown on your profile and posts." >}}

The `tip` is linked to the input with `aria-describedby`, so it is announced as the field's description rather than as a separate paragraph.

## Icon placement

`icon` takes a sprite path under `static/`, or a bare icon name such as `user-01` (looked up in `iconSet`, default `ui-oval`). `iconPos` places it at the `start` (left, the default) or `end` (right); `left`/`right` and `before`/`after` are accepted as aliases.

{{< textline icon="user-01" placeholder="Username" ariaLabel="Username" tip="Letters, numbers, and underscores only." >}}

{{< textline icon="svg/ui-oval/help-circle.svg" iconPos="right" placeholder="Ask a question" ariaLabel="Your question" >}}

The icon is decorative and does not take the field's accessible name; pass `ariaLabel` when there is no visible `label`.

## Sizes and layout

`size` accepts `small`/`s`, `medium`/`m` (default), or `large`/`l`. By default the field is a full-width block; `width` narrows it, and `inline=true` lets it share a line with text. The wrapper is a `<span>`, so an inline field stays valid inside a paragraph.

{{< textline label="Small" size="small" placeholder="Small" >}}

{{< textline label="Large" size="large" placeholder="Large" >}}

{{< textline label="Narrow" width="20em" placeholder="20em wide" >}}

Inline fields: {{< textline placeholder="Left" inline=true >}} {{< textline placeholder="Right" inline=true >}}

`disabled=true` disables the control, `readonly=true` keeps it focusable but not editable, and `required=true`, `maxlength`, and `autocomplete` map to the matching native attributes. `type` may be `text` (default), `search`, `email`, `url`, `tel`, or `password`.

{{< textline label="Disabled" value="Read only for now" disabled=true tip="Editing is turned off." >}}

{{< textline label="Read-only" value="Alice" readonly=true >}}

{{< textline label="Email" type="email" placeholder="alice@example.com" autocomplete="email" >}}

## JavaScript

`js` accepts a single-token URL/path; it loads once per page with `<script src>` (page-bundle and `assets/` resources are published and loaded directly), while anything else is inline source. Inline source runs on the input's `input` event by default, where `this` and `el` are the input and `el.value` is the current text. Use `jsEvent="change"` for change-only callbacks, `jsEvent="load"` to run it once after `DOMContentLoaded`, or `jsMode="src"` / `jsMode="inline"` to force how `js` is read.

{{< textline label="Log every keystroke" js="console.log(el.id, el.value)" placeholder="Type here" >}}

```
{{</* textline id="my-textline" label="Run" js="/js/demo.js" */>}}
```

A script loaded this way can find the field through its `id` (`textline-<ordinal>` when omitted) and attach its own listeners. The inline callback receives the event as its argument:

{{< textline label="Uppercase the hint" js="el.closest('.textline').querySelector('.textline-tip').textContent = el.value.toUpperCase() || 'Type something.'" placeholder="Type here" tip="Type something." >}}

## Parameters

| Name | Description |
| --- | --- |
| `value` | Initial text. Default: `params.textline.value` or `""`. |
| `placeholder` | Hint shown while the field is empty. Default: `params.textline.placeholder` or `""`. |
| `label` | Visible text above the field; inline Markdown. |
| `tip` | Short hint below the field; inline Markdown. Linked with `aria-describedby`. |
| `icon` | Icon path under `static/`, or a bare icon name such as `user-01`; resolved by `icon.html`. |
| `iconSet` | Icon set directory under `static/svg` for a bare icon name. Default: `ui-oval`. |
| `iconPos` | `start`/`left` (default) or `end`/`right`; `before`/`after` are aliases. |
| `type` | `text` (default), `search`, `email`, `url`, `tel`, or `password`. |
| `size` | `small`/`s`, `medium`/`m` (default), or `large`/`l`. Default: `params.textline.size` or `medium`. |
| `width` | CSS width of the whole control. Default: `params.textline.width`, or `100%` for a block field and `12em` for an inline one. |
| `inline` | Render as an inline-flex box that can share a line with text; default `false`. |
| `disabled` | Disabled state. |
| `readonly` | Read-only state. |
| `required` | Mark the field as required by a form. |
| `maxlength` | Maximum number of characters. |
| `autocomplete` | Native autocomplete token, e.g. `email` or `off`. |
| `name` | Form field name. |
| `ariaLabel` | Accessible name when there is no visible label. Default: `Text input` for an unlabelled field. |
| `title` | Native tooltip. |
| `id` | Input id. Default: `textline-<ordinal>`. |
| `class` | Extra classes on the wrapper. |
| `js` | Script URL/path (loaded once per page, including page bundle and `assets/` resources), or inline JavaScript source. |
| `jsMode` | `auto` (default), `src`, or `inline`; forces how `js` is read. |
| `jsEvent` | Event for inline `js`; default `input`. `load` runs it after `DOMContentLoaded`. |

## TextLine defaults and theming

Set defaults under `params.textline`; any shortcode argument overrides them. Geometry, colors, sizes, and motion are `--textline-*` CSS variables in `static/css/textline.css`, so a custom stylesheet (see `params.customCSS`) can retheme every text line.

```toml
[params.textline]
    value = ""
    placeholder = ""
    size = "medium"
    iconPos = "start"
    width = ""
    class = ""
```
