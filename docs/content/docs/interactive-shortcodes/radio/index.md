---
title: "Radio"
description: "AppKit-style radio buttons backed by native inputs."
date: 2024-10-04T00:09:24+08:00
lastmod: 2024-10-04T00:09:24+08:00
type: docs
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
weight: 57
toc:
    show: true
    snake: true
codeblock:
    highlight: true
    cursed: true
---

`radio` renders one radio option in the spirit of Apple's AppKit `NSButton` radio type: a small circular ring that fills with the theme's CornflowerBlue and reveals a centered white dot when selected. It is a native `<input type="radio">` under the styled ring, so it works without JavaScript, is reachable with <kbd>Tab</kbd>, and moves the selection with the arrow keys. The `label` accepts inline Markdown.

Radios are grouped by the native `name` attribute: give several `radio` shortcodes the same `name` and the browser keeps exactly one selected. A radio without a `name` gets a unique one, so it never clears another control by accident. To group options under a visible title, wrap them in a [`buttongroup`](../button-group/); its id becomes their default native name.

## Usage

```
{{</* radio name="drink" label="Coffee" checked=true */>}}
{{</* radio name="drink" label="Tea" */>}}
{{</* radio name="drink" label="Water" */>}}
```

A group (`checked` sets the initial selection):

{{< radio name="drink" label="Coffee" checked=true >}}
{{< radio name="drink" label="Tea" >}}
{{< radio name="drink" label="Water" >}}

## Sizes

`size` accepts `small`/`s`, `medium`/`m` (default), or `large`/`l`:

{{< radio name="radio-size" label="Small" size="small" >}}
{{< radio name="radio-size" label="Medium" size="medium" checked=true >}}
{{< radio name="radio-size" label="Large" size="large" >}}

## Colors

`tintColor` fills the selected ring, `dotColor` sets the inner dot, and `borderColor` sets the ring border while unselected. Any CSS color works:

{{< radio name="radio-tone" label="RoyalBlue" tintColor="RoyalBlue" checked=true >}}
{{< radio name="radio-tone" label="SeaGreen dot" tintColor="SeaGreen" dotColor="Cornsilk" >}}
{{< radio name="radio-tone" label="Navy border" borderColor="Navy" >}}

Without them the control follows the theme: CornflowerBlue, White, and SlateGray. Retheme every radio at once with the `--radio-*` variables (see [Radio defaults and theming](#radio-defaults-and-theming)).

## States and JavaScript

`disabled=true` disables an option; the wrapper dims and the native input stops responding. `id` sets the input's id (default `radio-<ordinal>`), which is what external scripts should look up, and `class` adds classes to the wrapper label. A radio with no visible label gets `aria-label="Radio"` unless `ariaLabel` is passed.

`js` accepts a single-token URL/path; it loads once per page with `<script src>` (page bundle and `assets/` resources are published and loaded directly), while anything else is inline source. Inline source runs on the input's `change` event by default, where `this` and `el` are the input and `el.checked` is the new state. Use `jsEvent="load"` to run it once after `DOMContentLoaded`, or `jsMode="src"` / `jsMode="inline"` to force how `js` is read.

{{< radio name="radio-disabled" label="Disabled" disabled=true >}}
{{< radio name="radio-disabled" label="Disabled, selected" checked=true disabled=true >}}

{{< radio name="radio-log" label="Log the state" checked=true js="console.log(el.id, el.checked)" >}}

```
{{</* radio id="my-radio" name="my-group" label="Run" js="/js/demo.js" */>}}
```

## Parameters

| Name | Description |
| --- | --- |
| `label` | Visible text; inline Markdown. |
| `name` | Group name. Options sharing it are mutually exclusive. Inside a `buttongroup`, a missing name defaults to the group id; an explicit name wins. Default: `radio-<ordinal>`, unique per shortcode. |
| `value` | Value submitted by the form. Default: the plain-text label, or `on` when there is no label. |
| `checked` | Initially selected: `true` or `false`. `selected` and `on` are aliases. Default: `false`. |
| `disabled` | Disabled state; a disabled `buttongroup` disables every child. |
| `size` | `small`/`s`, `medium`/`m` (default), or `large`/`l`. Default: `params.radio.size` or `medium`; a `buttongroup` size is the fallback. |
| `tintColor` | Selected-ring fill color. Default: the theme's CornflowerBlue. |
| `dotColor` | Inner dot (mark) color. Default: White. |
| `borderColor` | Ring border color while unselected. Default: SlateGray. |
| `ariaLabel` | Accessible name when there is no visible label. Default: `Radio`. |
| `id` | Input id. Default: `radio-<ordinal>`, or `<group-id>-radio-<ordinal>` inside a `buttongroup`. |
| `class` | Extra classes on the wrapper label. |
| `js` | Script URL/path (loaded once per page, including page bundle and `assets/` resources), or inline JavaScript source. |
| `jsMode` | `auto` (default), `src`, or `inline`; forces how `js` is read. |
| `jsEvent` | Event for inline `js`; default `change`. `load` runs it after `DOMContentLoaded`. |

## Radio defaults and theming

Set defaults under `params.radio`; any shortcode argument overrides them. The geometry, colors, and motion are `--radio-*` CSS variables in `static/css/radio.css`, so a custom stylesheet (see `params.customCSS`) can retheme every radio.

```toml
[params.radio]
    size = "medium"
    tintColor = ""
    dotColor = ""
    borderColor = ""
    class = ""
```
