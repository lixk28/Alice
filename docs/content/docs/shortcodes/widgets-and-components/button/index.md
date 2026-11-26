---
title: "Button"
description: "Themed buttons with types, states, icons, and scripts."
date: 2024-10-04T00:09:24+08:00
lastmod: 2024-10-04T00:09:24+08:00
type: docs
aliases: ["/docs/interactive-shortcodes/button/", "/docs/ui-components/button/", "/docs/shortcodes/ui-components/button/", "/docs/shortcodes/widgets-components/button/"]
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
weight: 55
toc:
    show: true
    snake: true
codeblock:
    highlight: true
    cursed: true
---

`button` renders a Bootstrap-style button whose default `plain` look is black text on a white background with a thin black border, a small offset shadow, and short transitions. It is a native `<button>` by default; pass `href` to render an `<a role="button">` instead. Inline Markdown works in `label`.

## Usage

```
{{</* button label="Read more" href="/posts/" */>}}

{{</* button label="Say hello" js="alert('Hello!')" */>}}

{{</* button label="Load a script" js="/js/your-script.js" */>}}
```

## Types

There are four core types. `plain` is the black-on-white default, `primary` is white on cornflower blue, `secondary` is navy on white smoke, and `link` is a text link dressed as a button, with a matching border. A fifth action preset, `download`, is covered below.

Each type provides its own default colors. Override any channel per button with `borderColor`, `tintColor`, and `textColor`; `tintColor="transparent"` gives an outline button:

{{< button label="Plain" >}}
{{< button label="Primary" type="primary" >}}
{{< button label="Secondary" type="secondary" >}}
{{< button label="Link" type="link" >}}

Custom colors (`borderColor`, `tintColor`, `textColor`):

{{< button label="Outline" tintColor="transparent" borderColor="Navy" textColor="Navy" >}}
{{< button label="Custom" tintColor="AliceBlue" borderColor="RoyalBlue" textColor="Navy" >}}

## Download button

`type="download"` is an action preset: it uses the navy download style, adds a download arrow when `icon` is omitted, and on a link it adds the `download` attribute automatically so the browser downloads the target instead of navigating to it. Pass `download="name.ext"` to suggest a file name, `download=false` to opt out, or `icon="..."` to replace the arrow.

{{< button label="Download the Alice logo" type="download" href="/img/HugoAliceLogo.webp" >}}

{{< button label="Download (outline)" type="download" href="/img/HugoAliceLogo.webp" download="alice-logo.webp" tintColor="transparent" borderColor="Navy" textColor="Navy" >}}

## Sizes and layout

`size` accepts `sm`, `md` (default), or `lg`. `block=true` makes the button fill its parent. With no `href`, the button renders as a native `<button type="button">`.

{{< button label="Small" size="sm" >}}
{{< button label="Medium" size="md" >}}
{{< button label="Large" size="lg" >}}

{{< button label="Block-level primary button" type="primary" block=true >}}

## States

`active=true` renders the pressed look (and sets `aria-pressed="true"`). `disabled=true` adds the native `disabled` attribute to a `<button>`, or `aria-disabled="true"` and `tabindex="-1"` to a link.

{{< button label="Active" active=true >}}
{{< button label="Disabled" disabled=true >}}
{{< button label="Disabled link" href="/posts/" disabled=true >}}

## Icons

`icon` takes a sprite path under `static/` and resolves it through the theme's `icon.html` partial. `iconPos` is `start` (default) or `end`. An icon-only button needs `label=""` plus `ariaLabel` or `title`.

{{< button label="Read the posts" href="/posts/" icon="svg/ui-oval/chevron-right.svg" iconPos="end" >}}
{{< button label="" icon="svg/ui-oval/copy-01.svg" title="Copy something" >}}

## JavaScript

`js` accepts a script URL or JavaScript source. A single-token URL/path (`http(s)://`, `//`, `/`, `./`, `../`, or a bare `*.js` path) is loaded as `<script src="..." defer>`; anything else is treated as source and attached to the button's click event. Set `jsMode="src"` or `jsMode="inline"` to force a mode.

Inline source runs as an event handler: `this` is the button, `event` is the event, and `el` is the button element. `jsEvent` changes the event (default `click`); `jsEvent="load"` runs the code once after the DOM is ready instead.

{{< button label="Toggle active" js="this.classList.toggle('active'); this.setAttribute('aria-pressed', this.classList.contains('active'));" >}}

The link form loads a script once per page, even when several buttons share it. Pass the script's path or URL; the script can find the button through its `id` (auto-generated as `button-<ordinal>` when omitted) and attach its own handler:

```
{{</* button id="my-button" label="Run the script" js="/js/my-script.js" */>}}
```

`jsMode="src"` forces this form when a path is ambiguous; `jsMode="inline"` forces source.

## Parameters

| Name | Description |
| --- | --- |
| `label` | Visible text; inline Markdown. Default `button`; set `label=""` for an icon-only button. |
| `class` | Extra classes on the button. |
| `js` | Script URL or inline JavaScript source (see [JavaScript](#javascript)). |
| `jsMode` | `auto` (default), `src`, or `inline`. |
| `jsEvent` | Event for inline `js`; default `click`. `load` runs it after `DOMContentLoaded`. |
| `href` | Link target. When set, the button renders as an `<a role="button">`. |
| `target`, `rel` | Link attributes. `target="_blank"` defaults `rel="noopener noreferrer"`. |
| `download` | Link download attribute: `true`, or a suggested file name. The `download` type adds it automatically on links; `download=false` opts out. |
| `type` | <ul><li><code>plain</code>: black-on-white paper button (default)</li><li><code>primary</code>: white on cornflower blue</li><li><code>secondary</code>: navy on white smoke</li><li><code>download</code>: navy action preset with a download icon and automatic <code>download</code> attribute on links</li><li><code>link</code>: text link with a matching border</li></ul><code>default</code> is accepted as an alias for <code>plain</code>. Default: <code>params.button.type</code> or <code>plain</code> |
| `borderColor` | CSS border color; overrides the type default. |
| `tintColor` | CSS background/tint color; overrides the type default. Use `transparent` for an outline button. |
| `textColor` | CSS label and icon color; overrides the type default. |
| `size` | `sm`, `md`, or `lg`; also accepts `small`, `medium`, `normal`, and `large`. Default: `params.button.size` or `md`. |
| `block` | Full-width button. Default: `params.button.block` or `false`. |
| `active` | Pressed appearance; also sets `aria-pressed="true"`. |
| `disabled` | Disabled state. |
| `icon` | Icon path under `static/`, e.g. `svg/ui-oval/chevron-right.svg`; resolved by `icon.html`. |
| `iconPos` | Icon placement: `start` (default) or `end`; `before`/`after` are aliases. |
| `title` | Native tooltip, also used as the accessible name for an icon-only button. |
| `ariaLabel` | Accessible name when the visible label is empty or differs. |
| `id` | Element id, useful for external scripts. Default: `button-<ordinal>`, or `<group-id>-button-<ordinal>` inside a `buttongroup`. |

## Site-wide defaults and theming

Set defaults under `params.button`; any shortcode argument overrides them. All geometry, colors, and motion are `--button-*` CSS variables in `static/css/button.css`, so a custom stylesheet (see `params.customCSS`) can retheme every button.

```toml
[params.button]
    type = "plain"
    size = "md"
    block = false
    class = ""
```
