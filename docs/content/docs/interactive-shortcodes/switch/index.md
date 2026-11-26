---
title: "Switch"
description: "An iOS-style on/off switch backed by a native checkbox."
date: 2024-10-04T00:09:24+08:00
lastmod: 2024-10-04T00:09:24+08:00
type: docs
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
weight: 56
toc:
    show: true
    snake: true
codeblock:
    highlight: true
    cursed: true
---

`switch` renders a themed on/off toggle in the spirit of Apple's UISwitch: a borderless pill track, a round thumb with a soft drop shadow, and a short iOS-style ease. It is a native `<input type="checkbox" role="switch">` under the styled track and thumb, so it works without JavaScript, is reachable with <kbd>Tab</kbd>, and toggles with <kbd>Space</kbd>. The `label` accepts inline Markdown.

## Usage

```
{{</* switch label="Notifications" on=true */>}}

{{</* switch label="Large" size="large" tintColor="RoyalBlue" on=true */>}}
```

Basic toggles (`on` sets the initial state):

{{< switch label="Notifications" >}}
{{< switch label="Auto-save" on=true >}}
{{< switch label="Sync **only** on Wi-Fi" on=true >}}

## Sizes

`size` accepts `small`/`s`, `medium`/`m` (default), or `large`/`l`:

{{< switch label="Small" size="small" >}}
{{< switch label="Medium" size="medium" on=true >}}
{{< switch label="Large" size="large" on=true >}}

## Tint color

`tintColor` is the track color while the switch is on. Without it, the theme uses a CornflowerBlue track. Any CSS color works:

{{< switch label="RoyalBlue" on=true tintColor="RoyalBlue" >}}
{{< switch label="SeaGreen" on=true tintColor="SeaGreen" >}}
{{< switch label="SlateGray" on=true tintColor="SlateGray" >}}
{{< switch label="Theme default" on=true >}}

The off state stays the theme's light gray. To retheme both states, override the `--switch-*` variables instead (see [Switch defaults and theming](#switch-defaults-and-theming)).

## Thumb color

`thumbColor` sets the thumb fill and defaults to `White`. The soft shadow stays underneath, so a colored thumb still lifts off the track:

{{< switch label="White" on=true >}}
{{< switch label="Gold" on=true thumbColor="Gold" >}}
{{< switch label="Navy" on=true thumbColor="Navy" >}}
{{< switch label="Cream on green" on=true tintColor="SeaGreen" thumbColor="Cornsilk" >}}

## Layout and JavaScript

`id` sets the input's id (default `switch-<ordinal>`), which is what external scripts should look up; `class` adds classes to the wrapper label. A switch with no visible label gets `aria-label="Switch"` automatically; with a visible label, the label text is the name.

`js` accepts a single-token URL/path; it loads once per page with `<script src>` (page bundle and `assets/` resources are published and loaded directly), while anything else is inline source. Inline source runs on the input's `change` event by default, where `this` and `el` are the input and `el.checked` is the new state. Use `jsEvent="load"` to run it once after `DOMContentLoaded`, or `jsMode="src"` / `jsMode="inline"` to force how `js` is read.

{{< switch label="Log the state" js="console.log(el.id, el.checked)" >}}

```
{{</* switch id="my-switch" label="Run" js="/js/demo.js" */>}}
```

## Parameters

| Name | Description |
| --- | --- |
| `on` | Initial state: `true` or `false`. Default: `params.switch.on` or `false`. |
| `tintColor` | Track color while on. Default: the theme's CornflowerBlue. |
| `thumbColor` | Thumb fill color. Default: `params.switch.thumbColor` or `White`. |
| `size` | `small`/`s`, `medium`/`m` (default), or `large`/`l`. Default: `params.switch.size` or `medium`. |
| `label` | Visible text; inline Markdown. |
| `id` | Input id. Default: `switch-<ordinal>`. |
| `class` | Extra classes on the wrapper label. |
| `js` | Script URL/path (loaded once per page, including page bundle and `assets/` resources), or inline JavaScript source. |
| `jsMode` | `auto` (default), `src`, or `inline`; forces how `js` is read. |
| `jsEvent` | Event for inline `js`; default `change`. `load` runs it after `DOMContentLoaded`. |

## Switch defaults and theming

Set defaults under `params.switch`; any shortcode argument overrides them. The geometry, colors, and motion are `--switch-*` CSS variables in `static/css/switch.css`, so a custom stylesheet (see `params.customCSS`) can retheme every switch.

```toml
[params.switch]
    on = false
    tintColor = ""
    # Empty uses White.
    thumbColor = ""
    size = "medium"
    class = ""
```
