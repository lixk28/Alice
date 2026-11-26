---
title: "Slider"
description: "A UISlider-style range control."
date: 2024-10-04T00:09:24+08:00
lastmod: 2024-10-04T00:09:24+08:00
type: docs
aliases: ["/docs/interactive-shortcodes/slider/", "/docs/ui-components/slider/", "/docs/shortcodes/ui-components/slider/", "/docs/shortcodes/widgets-components/slider/"]
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
weight: 60
toc:
    show: true
    snake: true
codeblock:
    highlight: true
    cursed: true
---

`slider` renders a themed horizontal range control modelled on Apple's UISlider: a thin rounded track with a tinted minimum side, a white circular thumb lifted by a soft shadow, and a short ease. It is a native `<input type="range">` under the styled track, so it works without JavaScript, is reachable with <kbd>Tab</kbd>, and moves with the arrow keys, <kbd>Home</kbd>, and <kbd>End</kbd>. The `label` accepts inline Markdown.

By default the shortcode renders as a full-width block. Use `width` for a narrower block, or `inline=true` to share a line with text — see [Width and inline layout](#width-and-inline-layout).

## Usage

```
{{</* slider label="Volume" value=60 unit="%" */>}}

{{</* slider label="Text size" min=10 max=24 step=1 value=16 minIcon="svg/ui-oval/align-left-02.svg" maxIcon="svg/ui-oval/align-right-01.svg" */>}}
```

Basic sliders (`value` sets the initial state, `unit` suffixes the readout):

{{< slider label="Volume" value=60 unit="%" >}}

{{< slider label="Brightness" value=35 unit="%" >}}

{{< slider label="Opacity" min=0 max=1 step=0.05 value=0.65 >}}

## Range and step

`min`, `max`, and `step` define the range. `value` is clamped to `[min, max]` and snapped to the nearest step:

{{< slider label="Zoom" min=0 max=10 step=0.5 value=7.5 unit="×" >}}

{{< slider label="Temperature" min=-10 max=40 step=1 value=22 unit=" °C" >}}

## Colors

`tintColor` paints the minimum side of the track, `trackColor` the remaining side, and `thumbColor` the thumb. Any CSS color works:

{{< slider label="RoyalBlue" value=70 tintColor="RoyalBlue" >}}

{{< slider label="SeaGreen" value=45 tintColor="SeaGreen" trackColor="Gainsboro" >}}

{{< slider label="Gold thumb" value=55 tintColor="RoyalBlue" thumbColor="Gold" >}}

Without them the control follows the theme: CornflowerBlue, Gainsboro, and White. Retheme every slider at once with the `--slider-*` variables (see [Slider defaults and theming](#slider-defaults-and-theming)).

## Sizes

`size` accepts `small`/`s`, `medium`/`m` (default), or `large`/`l`:

{{< slider label="Small" size="small" value=25 >}}

{{< slider label="Medium" size="medium" value=50 >}}

{{< slider label="Large" size="large" value=75 >}}

## End icons

`minIcon` and `maxIcon` draw an icon at the two ends of the track, like UISlider's `minimumValueImage` and `maximumValueImage`. They take an icon path under `static/` and resolve through `icon.html`:

{{< slider label="Text size" min=10 max=24 step=1 value=16 minIcon="svg/ui-oval/align-left-02.svg" maxIcon="svg/ui-oval/align-right-01.svg" >}}

## Layout and states

`showValue=false` hides the readout; `id` sets the input's id (default `slider-<ordinal>`), which is what external scripts should look up; `class` adds classes to the wrapper. A slider with no visible label gets `aria-label="Slider"` unless `ariaLabel` is passed. `disabled=true` disables the control, and `name` adds a form field name.

{{< slider label="No readout" value=40 showValue=false >}}

{{< slider label="Disabled" value=65 disabled=true >}}

## Width and inline layout

By default the slider is a block-level box that fills its container (`width: 100%`). Set `width` to any CSS length or percentage to constrain it; it still occupies its own line:

{{< slider label="Narrow" value=45 width="20em" >}}

{{< slider label="Percentage" value=30 width="60%" >}}

`inline=true` switches the wrapper to `inline-flex`, so the control can share a line with text. The shortcode renders a `<span>`, which keeps it valid inside a paragraph. Without `width` an inline slider shrinks to a 12em track; pass `width` to fix the size:

Inline sliders side by side: {{< slider label="Left" value=30 size="small" inline=true >}} {{< slider label="Right" value=70 size="small" inline=true >}}

## JavaScript

`js` accepts a single-token URL/path; it loads once per page with `<script src>` (page bundle and `assets/` resources are published and loaded directly), while anything else is inline source. Inline source runs on the input's `input` event by default, where `this` and `el` are the input and `el.value` is the new value. Use `jsEvent="load"` to run it once after `DOMContentLoaded`, or `jsMode="src"` / `jsMode="inline"` to force how `js` is read.

{{< slider label="Log the value" js="console.log(el.id, el.value)" >}}

```
{{</* slider id="my-slider" label="Run" js="/js/demo.js" */>}}
```

## Parameters

| Name | Description |
| --- | --- |
| `value` | Initial value; clamped to `[min, max]` and snapped to `step`. Default: `params.slider.value` or `50`. |
| `min`, `max` | Range endpoints. Defaults: `0` and `100`. |
| `step` | Increment; must be greater than `0`. Default: `params.slider.step` or `1`. |
| `label` | Visible text; inline Markdown. |
| `unit` | Suffix appended to the value readout, e.g. `%` or `" °C"`. |
| `showValue` | Show the current value beside the label. Default: `params.slider.showValue` or `true`. |
| `size` | `small`/`s`, `medium`/`m` (default), or `large`/`l`. Default: `params.slider.size` or `medium`. |
| `tintColor` | Minimum-track color. Default: the theme's CornflowerBlue. |
| `trackColor` | Remaining-track color. Default: Gainsboro. |
| `thumbColor` | Thumb color. Default: White. |
| `minIcon`, `maxIcon` | Icon paths under `static/` drawn at the track ends, e.g. `svg/ui-oval/align-left-02.svg`; resolved by `icon.html`. |
| `disabled` | Disabled state. |
| `name` | Form field name. |
| `ariaLabel` | Accessible name when there is no visible label. |
| `id` | Input id. Default: `slider-<ordinal>`. |
| `class` | Extra classes on the wrapper. |
| `width` | CSS width of the whole control, e.g. `20em`, `60%`, or a `calc()` expression. Default: `params.slider.width`, or `100%` for a block slider and `auto` for an inline one. |
| `inline` | Render as an inline-flex box that can share a line with text; default `false`. |
| `js` | Script URL/path (loaded once per page, including page bundle and `assets/` resources), or inline JavaScript source. |
| `jsMode` | `auto` (default), `src`, or `inline`; forces how `js` is read. |
| `jsEvent` | Event for inline `js`; default `input`. `load` runs it after `DOMContentLoaded`. |

`static/js/slider.js` keeps the tinted minimum track and the readout in sync as the thumb moves. The initial fill and readout are computed at build time, so the control looks right before that script runs.

## Slider defaults and theming

Set defaults under `params.slider`; any shortcode argument overrides them. The geometry, colors, and motion are `--slider-*` CSS variables in `static/css/slider.css`, so a custom stylesheet (see `params.customCSS`) can retheme every slider.

```toml
[params.slider]
    value = 50
    min = 0
    max = 100
    step = 1
    unit = ""
    width = ""
    showValue = true
    size = "medium"
    tintColor = ""
    trackColor = ""
    thumbColor = ""
    class = ""
```
