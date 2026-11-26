---
title: "Checkbox"
description: "Themed checkboxes backed by native inputs."
date: 2024-10-04T00:09:24+08:00
lastmod: 2024-10-04T00:09:24+08:00
type: docs
aliases: ["/docs/interactive-shortcodes/checkbox/", "/docs/ui-components/checkbox/", "/docs/shortcodes/ui-components/checkbox/", "/docs/shortcodes/widgets-components/checkbox/"]
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
weight: 58
toc:
    show: true
    snake: true
codeblock:
    highlight: true
    cursed: true
---

`checkbox` renders a theme-styled checkbox: a small square box with a thin SlateGray border and an inset shadow that fills with the theme's CornflowerBlue and shows the theme's `svg/ui-oval/check.svg` check mark when selected. It is a native `<input type="checkbox">` under the styled box, so it works without JavaScript, is reachable with <kbd>Tab</kbd>, and toggles with <kbd>Space</kbd>. The `label` accepts inline Markdown.

## Usage

```
{{</* checkbox label="Subscribe to the newsletter" */>}}

{{</* checkbox label="Remember me" checked=true */>}}
```

Basic checkboxes (`checked` sets the initial state):

{{< checkbox label="Subscribe to the newsletter" >}}
{{< checkbox label="Remember me" checked=true >}}
{{< checkbox label="Send **only** important mail" checked=true >}}

## Sizes

`size` accepts `small`/`s`, `medium`/`m` (default), or `large`/`l`:

{{< checkbox label="Small" size="small" >}}
{{< checkbox label="Medium" size="medium" checked=true >}}
{{< checkbox label="Large" size="large" checked=true >}}

## Colors

`tintColor` fills the selected box, `checkColor` sets the check mark, and `borderColor` sets the box border while unchecked. Any CSS color works:

{{< checkbox label="RoyalBlue" tintColor="RoyalBlue" checked=true >}}
{{< checkbox label="SeaGreen check" tintColor="SeaGreen" checkColor="Cornsilk" checked=true >}}
{{< checkbox label="Navy border" borderColor="Navy" >}}

Without them the control follows the theme: CornflowerBlue, White, and SlateGray. Retheme every checkbox at once with the `--checkbox-*` variables (see [Checkbox defaults and theming](#checkbox-defaults-and-theming)).

## Groups, states, and JavaScript

Checkboxes are independent. Give several checkboxes the same `name` to submit them as one form field with one value per checked option; without a name each checkbox gets a unique one so it never joins another field by accident. To group them under a visible title, wrap them in a [`buttongroup`](../button-group/); the group id becomes their default name, and a child's own `name` still wins. `value` sets the submitted value and defaults to the plain-text label (or `on` when there is no label).

`disabled=true` disables an option; the wrapper dims and the native input stops responding. A disabled `buttongroup` disables every child. `id` sets the input's id (default `checkbox-<ordinal>`), which is what external scripts should look up, and `class` adds classes to the wrapper label. A checkbox with no visible label gets `aria-label="Checkbox"` unless `ariaLabel` is passed.

{{< checkbox name="features" value="alpha" label="Feature A" checked=true >}}
{{< checkbox name="features" value="beta" label="Feature B" >}}

{{< checkbox name="checkbox-disabled" label="Disabled" disabled=true >}}
{{< checkbox name="checkbox-disabled" label="Disabled, checked" checked=true disabled=true >}}

`js` accepts a single-token URL/path; it loads once per page with `<script src>` (page bundle and `assets/` resources are published and loaded directly), while anything else is inline source. Inline source runs on the input's `change` event by default, where `this` and `el` are the input and `el.checked` is the new state. Use `jsEvent="load"` to run it once after `DOMContentLoaded`, or `jsMode="src"` / `jsMode="inline"` to force how `js` is read.

{{< checkbox label="Log the state" checked=true js="console.log(el.id, el.checked)" >}}

```
{{</* checkbox id="my-checkbox" label="Run" js="/js/demo.js" */>}}
```

## Parameters

| Name | Description |
| --- | --- |
| `label` | Visible text; inline Markdown. |
| `name` | Form field name. Checkboxes that share a name submit as one field. Inside a `buttongroup`, a missing name defaults to the group id; an explicit name wins. Default: `checkbox-<ordinal>`, unique per shortcode. |
| `value` | Value submitted by the form. Default: the plain-text label, or `on` when there is no label. |
| `checked` | Initially selected: `true` or `false`. `selected` and `on` are aliases. Default: `false`. |
| `disabled` | Disabled state; a disabled `buttongroup` disables every child. |
| `size` | `small`/`s`, `medium`/`m` (default), or `large`/`l`. Default: `params.checkbox.size` or `medium`; a `buttongroup` size is the fallback. |
| `tintColor` | Checked box fill color. Default: the theme's CornflowerBlue. |
| `checkColor` | Check mark color. Default: White. |
| `borderColor` | Box border color while unchecked. Default: SlateGray. |
| `ariaLabel` | Accessible name when there is no visible label. Default: `Checkbox`. |
| `id` | Input id. Default: `checkbox-<ordinal>`, or `<group-id>-checkbox-<ordinal>` inside a `buttongroup`. |
| `class` | Extra classes on the wrapper label. |
| `js` | Script URL/path (loaded once per page, including page bundle and `assets/` resources), or inline JavaScript source. |
| `jsMode` | `auto` (default), `src`, or `inline`; forces how `js` is read. |
| `jsEvent` | Event for inline `js`; default `change`. `load` runs it after `DOMContentLoaded`. |

## Checkbox defaults and theming

Set defaults under `params.checkbox`; any shortcode argument overrides them. The geometry, colors, and motion are `--checkbox-*` CSS variables in `static/css/checkbox.css`, so a custom stylesheet (see `params.customCSS`) can retheme every checkbox.

```toml
[params.checkbox]
    size = "medium"
    tintColor = ""
    checkColor = ""
    borderColor = ""
    class = ""
```
