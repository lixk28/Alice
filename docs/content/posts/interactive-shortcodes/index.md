---
title: "Alice (4): Interactive Shortcodes"
description: ""
keywords: []
date: 2024-10-04T00:09:24+08:00
lastmod: 2024-10-04T00:09:24+08:00
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
toc:
    show: true
    cursed: false
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
    # katex or mathjax
    engine: katex
    math: false
    algorithm: false
    tikz: false
mermaid: false
---

## Icon

`icon` renders an inline SVG from the theme's icon sprite. The icon inherits the surrounding text color by default; `color` and `size` override it per use. `size` accepts any CSS length, and a bare number means pixels.

{{< icon name="lightbulb-05" >}} default size (1em)<br>
{{< icon name="lightbulb-05" size="16" >}} 16px<br>
{{< icon name="lightbulb-05" size="24" color="Navy" >}} 24px, Navy<br>
{{< icon name="lightbulb-05" size="2em" color="RoyalBlue" >}} 2em, RoyalBlue

Icons flow with text too: a {{< icon name="check" color="Green" >}} check, a {{< icon name="x-close" color="Crimson" >}} cross, and a {{< icon name="info-square" color="RoyalBlue" >}} note.

An icon with `title` is announced as an image rather than hidden: {{< icon name="help-circle" title="Help" >}}

Usage:

```
{{</* icon name="check" size="24" color="Navy" */>}}

{{</* icon path="svg/ui-oval/check.svg" size="1.5em" */>}}
```

A bare `name` is looked up in `params.icon.set` (default `ui-oval`), so `name="check"` renders `svg/ui-oval/check.svg`. Use `path` for a custom icon under `static/`, or a path-shaped `name` such as `name="svg/my-set/logo.svg"`.

Parameters:

| Name | Description |
| --- | --- |
| `name` | Icon name in `set`, e.g. `check`; a name containing `/` or ending in `.svg` is treated as a path. |
| `path` | Icon path relative to `static/`, e.g. `svg/ui-oval/check.svg`; wins over `name`. |
| `set` | Icon set directory under `static/svg` for `name`. Default: `params.icon.set` or `ui-oval`. |
| `size` | CSS length applied to width and height; a bare number means px. Default: `params.icon.size`, then `1em`. |
| `width`, `height` | Per-dimension CSS length overrides; a bare number means px. |
| `color` | Any CSS color (named, hex, `rgb()`, `hsl()`, or `var(--token)`). Empty inherits the text color. |
| `class`, `id` | Extra class(es) and id on the `<svg>`. |
| `title` | Tooltip and accessible name; renders a `<title>`. |
| `ariaLabel` | Accessible name; defaults to `title`. Without either, the icon is `aria-hidden` and decorative. |
| `style`, `attrs` | Extra inline CSS and raw attributes on the `<svg>`. |
| `mapPath` | Custom `sprites.json` path, for an advanced sprite setup. |

Site-wide defaults and theming:

```toml
[params.icon]
    set = "ui-oval"
    size = ""
    color = ""
    class = ""
```

`static/css/icon.css` exposes `--icon-size`, `--icon-color`, `--icon-vertical-align`, `--icon-width`, and `--icon-height`, so a custom stylesheet can retheme every icon.

## Label

`label` renders a compact inline label for one-line text. The text comes from the inner content (inline Markdown) or the `text` argument. Typography, color, background, border, and shadow are direct CSS controls, so a label can be neutral, colored, bordered, or elevated without adding new variants. It replaces the old `mark` shortcode: use `color`, `backgroundColor`, `fontSize`, and `fontWeight` for the same highlighting controls.

{{< label >}}Default{{< /label >}}
{{< label backgroundColor="AliceBlue" borderColor="RoyalBlue" color="Navy" >}}Info{{< /label >}}
{{< label backgroundColor="Honeydew" borderColor="MediumSeaGreen" color="DarkGreen" >}}Success{{< /label >}}
{{< label backgroundColor="MistyRose" borderColor="Crimson" color="DarkRed" shadow=".1em .1em .2em LightSlateGray" >}}Danger{{< /label >}}

Sizes:

{{< label size="2xs" >}}2XS{{< /label >}}
{{< label size="xs" >}}XS{{< /label >}}
{{< label size="sm" >}}SM{{< /label >}}
{{< label size="md" >}}MD{{< /label >}}
{{< label size="lg" >}}LG{{< /label >}}

Icons can sit on the left (default) or the right:

{{< label icon="check" >}}Passed{{< /label >}}
{{< label icon="chevron-right" iconPos="right" >}}Next{{< /label >}}
{{< label icon="info-square" iconColor="RoyalBlue" >}}Note{{< /label >}}
{{< label icon="check" iconColor="White" backgroundColor="Navy" borderColor="Navy" color="White" >}}Done{{< /label >}}

A bare `icon` value is an icon name; a path-shaped value such as `svg/ui-oval/check.svg` is used directly. `iconName` names an icon in `iconSet`.

An icon-only label takes its accessible name from `ariaLabel` or `title`: {{< label icon="check" title="Done" />}}

Free-form styling with `fontSize`, `border`, `shadow`, and the other controls:

{{< label fontSize="1.1rem" color="Navy" backgroundColor="Lavender" border="none" >}}Custom font{{< /label >}}
{{< label border="2px dashed SlateGray" shadow=".15em .15em 0 Silver" >}}Dashed{{< /label >}}

A self-closing label uses `text`:

{{< label text="New" backgroundColor="Navy" borderColor="Navy" color="White" />}}

Usage:

```
{{</* label backgroundColor="AliceBlue" borderColor="RoyalBlue" color="Navy" */>}}Info{{</* /label */>}}

{{</* label icon="check" iconPos="right" size="lg" */>}}Passed{{</* /label */>}}
```

Parameters:

| Name | Description |
| --- | --- |
| `text` | Label text for a self-closing shortcode; inner content wins. |
| `size` | `2xs`, `xs`, `sm`, `md`, or `lg`, or a CSS font-size length. Default: `params.label.size` or `sm`. |
| `fontSize` | CSS font-size override. |
| `color` | Text color (any CSS color). |
| `backgroundColor` | Background color (any CSS color). |
| `border` | Full CSS border shorthand, e.g. `1px solid Silver`; wins over the individual border controls. |
| `borderWidth`, `borderStyle`, `borderColor` | Border width, style, and color. Defaults: `1px solid Silver`. |
| `borderRadius` | Border radius. Default: `.3em`. |
| `shadow` | CSS `box-shadow`. Default: none. |
| `padding` | CSS padding shorthand; overrides the size preset's padding. |
| `fontWeight` | CSS `font-weight`. Default: `500`. |
| `gap` | Gap between the icon and text. Default: follows the size preset. |
| `icon` | Icon path, or a bare icon name such as `check`. |
| `iconName` | Icon name inside `iconSet`. |
| `iconSet` | Icon set directory under `static/svg` for `iconName`; defaults to `params.icon.set`. |
| `iconPos` | `left` (default) or `right`; `start`/`end` and `before`/`after` are aliases. |
| `iconSize` | CSS icon size. Default: `1em`. |
| `iconColor` | CSS icon color. Default: the label text color. |
| `class`, `id` | Extra class(es) and id on the label span. |
| `title` | Native tooltip. |
| `ariaLabel` | Accessible name, useful for an icon-only label. |

Site-wide defaults and theming:

```toml
[params.label]
    size = "sm"
    color = ""
    backgroundColor = ""
    border = ""
    borderWidth = ""
    borderStyle = ""
    borderColor = ""
    borderRadius = ""
    shadow = ""
    padding = ""
    fontWeight = ""
    gap = ""
    iconSize = ""
    iconColor = ""
    class = ""
```

`static/css/label.css` exposes `--label-font-size`, `--label-color`, `--label-bgcolor`, `--label-border-*`, `--label-shadow`, `--label-padding-*`, `--label-gap`, and `--label-icon-size`, so a custom stylesheet can retheme every label.

## Tabs

### Single Tab

Single tab:
{{< tab "An orphan tab" >}}
So lonely
{{< /tab >}}

### Tab Panels

Tab panel `{{</* tabpanel */>}}` with tab1 selected `choice=2` by default:
{{< tabpanel choice=2 >}}

{{< tab >}}
1
{{< /tab >}}

{{< tab >}}
22
{{< /tab >}}

{{< tab >}}
333
{{< /tab >}}

{{< tab >}}
4444
{{< /tab >}}

{{< /tabpanel >}}

nested tab panels:
{{< tabpanel >}}

{{< tab >}}
{{< loremipsum paragraphs=1 >}}
{{< /tab >}}

{{< tab "NEST BABY" >}}
{{< tabpanel >}}

{{< tab >}}
Yeah, you like that?
{{< /tab >}}

{{< tab "MORE NEST BABY" >}}
{{< tab "FREAKING NEST BABY" >}}
```C
#include <stdio.h>

int main() {
    printf("WE NEED NEST!!!");
    return 0;
}
```
{{< /tab >}}
{{< /tab >}}
{{< /tabpanel >}}

{{< /tab >}}

{{< /tabpanel >}}

### Grouping Tabs

You can also group several tab panels by specifying the `group` attribute.
It's used for synchronizing tab choices across tab panels in the same group, e.g. a doc on different platforms.

{{< tabpanel group="os" >}}
{{< tab "Linux" >}} Hello {{< /tab >}}
{{< tab "Windows" >}} o_O {{< /tab >}}
{{< tab "macOS" >}} O_O {{< /tab >}}
{{< /tabpanel >}}

{{< tabpanel group="os" >}}
{{< tab "Linux" >}} World {{< /tab >}}
{{< tab "Windows" >}} Win {{< /tab >}}
{{< tab "macOS" >}} Mac {{< /tab >}}
{{< /tabpanel >}}

Tab choices are persistent, try reloading this page.

## Dropdown

Floating panel with an optional left-side `title` and a play caret on the right. The same partial also powers nested header menu items (any `menu.main` entry with `parent` children).

Do not put the shortcode inside a Markdown list item or paragraph — the panel is block-level HTML and will break if wrapped in a `<p>`.

Usage:

```
{{</* dropdown title="More" mode="hover" */>}}
- [Documentation](/categories/documentation/)
- [Alice](/tags/alice/)
{{</* /dropdown */>}}
```

Parameters:

| Name | Description |
| --- | --- |
| `title` | Left-side label; passed through `markdownify` (links work) |
| `mode` | <ul><li><code>hover</code>: open on hover; click caret to dismiss</li><li><code>click</code>: click caret to toggle</li></ul>Default: <code>params.dropdown.mode</code> or <code>hover</code> |

Click mode (`mode="click"`):

{{< dropdown title="More" mode="click" >}}
- [Documentation](/categories/documentation/)
- [Alice](/tags/alice/)
- [Markdown](/tags/markdown/)
{{< /dropdown >}}

Hover mode (`mode="hover"`):

{{< dropdown title="Browse" mode="hover" >}}
- [Categories](/categories/)
- [Tags](/tags/)
- [Posts](/posts/)
{{< /dropdown >}}

Markdown `title` with a link:

{{< dropdown title="[Tags](/tags/)">}}
- [Alice](/tags/alice/)
- [Shortcode](/tags/shortcode/)
- [Markdown](/tags/markdown/)
{{< /dropdown >}}

## Button

`button` renders a Bootstrap-style button whose default `plain` look is black text on a white background with a thin black border, a small offset shadow, and short transitions. It is a native `<button>` by default; pass `href` to render an `<a role="button">` instead. Inline Markdown works in `label`.

Usage:

```
{{</* button label="Read more" href="/posts/" */>}}

{{</* button label="Say hello" js="alert('Hello!')" */>}}

{{</* button label="Load a script" js="/js/your-script.js" */>}}
```

### Types

There are four core types. `plain` is the black-on-white default, `primary` is white on cornflower blue, `secondary` is navy on white smoke, and `link` is a text link dressed as a button, with a matching border. A fifth action preset, `download`, is covered below.

Each type provides its own default colors. Override any channel per button with `borderColor`, `tintColor`, and `textColor`; `tintColor="transparent"` gives an outline button:

{{< button label="Plain" >}}
{{< button label="Primary" type="primary" >}}
{{< button label="Secondary" type="secondary" >}}
{{< button label="Link" type="link" >}}

Custom colors (`borderColor`, `tintColor`, `textColor`):

{{< button label="Outline" tintColor="transparent" borderColor="Navy" textColor="Navy" >}}
{{< button label="Custom" tintColor="AliceBlue" borderColor="RoyalBlue" textColor="Navy" >}}

### Download button

`type="download"` is an action preset: it uses the navy download style, adds a download arrow when `icon` is omitted, and on a link it adds the `download` attribute automatically so the browser downloads the target instead of navigating to it. Pass `download="name.ext"` to suggest a file name, `download=false` to opt out, or `icon="..."` to replace the arrow.

{{< button label="Download the Alice logo" type="download" href="/img/HugoAliceLogo.webp" >}}

{{< button label="Download (outline)" type="download" href="/img/HugoAliceLogo.webp" download="alice-logo.webp" tintColor="transparent" borderColor="Navy" textColor="Navy" >}}

### Sizes and layout

`size` accepts `sm`, `md` (default), or `lg`. `block=true` makes the button fill its parent. With no `href`, the button renders as a native `<button type="button">`.

{{< button label="Small" size="sm" >}}
{{< button label="Medium" size="md" >}}
{{< button label="Large" size="lg" >}}

{{< button label="Block-level primary button" type="primary" block=true >}}

### States

`active=true` renders the pressed look (and sets `aria-pressed="true"`). `disabled=true` adds the native `disabled` attribute to a `<button>`, or `aria-disabled="true"` and `tabindex="-1"` to a link.

{{< button label="Active" active=true >}}
{{< button label="Disabled" disabled=true >}}
{{< button label="Disabled link" href="/posts/" disabled=true >}}

### Icons

`icon` takes a sprite path under `static/` and resolves it through the theme's `icon.html` partial. `iconPos` is `start` (default) or `end`. An icon-only button needs `label=""` plus `ariaLabel` or `title`.

{{< button label="Read the posts" href="/posts/" icon="svg/ui-oval/chevron-right.svg" iconPos="end" >}}
{{< button label="" icon="svg/ui-oval/copy-01.svg" title="Copy something" >}}

### JavaScript

`js` accepts a script URL or JavaScript source. A single-token URL/path (`http(s)://`, `//`, `/`, `./`, `../`, or a bare `*.js` path) is loaded as `<script src="..." defer>`; anything else is treated as source and attached to the button's click event. Set `jsMode="src"` or `jsMode="inline"` to force a mode.

Inline source runs as an event handler: `this` is the button, `event` is the event, and `el` is the button element. `jsEvent` changes the event (default `click`); `jsEvent="load"` runs the code once after the DOM is ready instead.

{{< button label="Toggle active" js="this.classList.toggle('active'); this.setAttribute('aria-pressed', this.classList.contains('active'));" >}}

The link form loads a script once per page, even when several buttons share it. Pass the script's path or URL; the script can find the button through its `id` (auto-generated as `button-<ordinal>` when omitted) and attach its own handler:

```
{{</* button id="my-button" label="Run the script" js="/js/my-script.js" */>}}
```

`jsMode="src"` forces this form when a path is ambiguous; `jsMode="inline"` forces source.

### Parameters

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

### Site-wide defaults and theming

Set defaults under `params.button`; any shortcode argument overrides them. All geometry, colors, and motion are `--button-*` CSS variables in `static/css/button.css`, so a custom stylesheet (see `params.customCSS`) can retheme every button.

```toml
[params.button]
    type = "plain"
    size = "md"
    block = false
    class = ""
```

## Switch

`switch` renders a themed on/off toggle in the spirit of Apple's UISwitch: a borderless pill track, a round thumb with a soft drop shadow, and a short iOS-style ease. It is a native `<input type="checkbox" role="switch">` under the styled track and thumb, so it works without JavaScript, is reachable with <kbd>Tab</kbd>, and toggles with <kbd>Space</kbd>. The `label` accepts inline Markdown.

Usage:

```
{{</* switch label="Notifications" on=true */>}}

{{</* switch label="Large" size="large" tintColor="RoyalBlue" on=true */>}}
```

Basic toggles (`on` sets the initial state):

{{< switch label="Notifications" >}}
{{< switch label="Auto-save" on=true >}}
{{< switch label="Sync **only** on Wi-Fi" on=true >}}

### Sizes

`size` accepts `small`/`s`, `medium`/`m` (default), or `large`/`l`:

{{< switch label="Small" size="small" >}}
{{< switch label="Medium" size="medium" on=true >}}
{{< switch label="Large" size="large" on=true >}}

### Tint color

`tintColor` is the track color while the switch is on. Without it, the theme uses a CornflowerBlue track. Any CSS color works:

{{< switch label="RoyalBlue" on=true tintColor="RoyalBlue" >}}
{{< switch label="SeaGreen" on=true tintColor="SeaGreen" >}}
{{< switch label="SlateGray" on=true tintColor="SlateGray" >}}
{{< switch label="Theme default" on=true >}}

The off state stays the theme's light gray. To retheme both states, override the `--switch-*` variables instead (see [Switch defaults and theming](#switch-defaults-and-theming)).

### Thumb color

`thumbColor` sets the thumb fill and defaults to `White`. The soft shadow stays underneath, so a colored thumb still lifts off the track:

{{< switch label="White" on=true >}}
{{< switch label="Gold" on=true thumbColor="Gold" >}}
{{< switch label="Navy" on=true thumbColor="Navy" >}}
{{< switch label="Cream on green" on=true tintColor="SeaGreen" thumbColor="Cornsilk" >}}

### Layout and JavaScript

`id` sets the input's id (default `switch-<ordinal>`), which is what external scripts should look up; `class` adds classes to the wrapper label. A switch with no visible label gets `aria-label="Switch"` automatically; with a visible label, the label text is the name.

`js` accepts a single-token URL/path; it loads once per page with `<script src>` (page bundle and `assets/` resources are published and loaded directly), while anything else is inline source. Inline source runs on the input's `change` event by default, where `this` and `el` are the input and `el.checked` is the new state. Use `jsEvent="load"` to run it once after `DOMContentLoaded`, or `jsMode="src"` / `jsMode="inline"` to force how `js` is read.

{{< switch label="Log the state" js="console.log(el.id, el.checked)" >}}

```
{{</* switch id="my-switch" label="Run" js="/js/demo.js" */>}}
```

### Parameters

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

### Switch defaults and theming

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

## Radio

`radio` renders one radio option in the spirit of Apple's AppKit `NSButton` radio type: a small circular ring that fills with the theme's CornflowerBlue and reveals a centered white dot when selected. It is a native `<input type="radio">` under the styled ring, so it works without JavaScript, is reachable with <kbd>Tab</kbd>, and moves the selection with the arrow keys. The `label` accepts inline Markdown.

Radios are grouped by the native `name` attribute: give several `radio` shortcodes the same `name` and the browser keeps exactly one selected. A radio without a `name` gets a unique one, so it never clears another control by accident. To group options under a visible title, wrap them in a [`buttongroup`](#button-group); its id becomes their default native name.

Usage:

```
{{</* radio name="drink" label="Coffee" checked=true */>}}
{{</* radio name="drink" label="Tea" */>}}
{{</* radio name="drink" label="Water" */>}}
```

A group (`checked` sets the initial selection):

{{< radio name="drink" label="Coffee" checked=true >}}
{{< radio name="drink" label="Tea" >}}
{{< radio name="drink" label="Water" >}}

### Sizes

`size` accepts `small`/`s`, `medium`/`m` (default), or `large`/`l`:

{{< radio name="radio-size" label="Small" size="small" >}}
{{< radio name="radio-size" label="Medium" size="medium" checked=true >}}
{{< radio name="radio-size" label="Large" size="large" >}}

### Colors

`tintColor` fills the selected ring, `dotColor` sets the inner dot, and `borderColor` sets the ring border while unselected. Any CSS color works:

{{< radio name="radio-tone" label="RoyalBlue" tintColor="RoyalBlue" checked=true >}}
{{< radio name="radio-tone" label="SeaGreen dot" tintColor="SeaGreen" dotColor="Cornsilk" >}}
{{< radio name="radio-tone" label="Navy border" borderColor="Navy" >}}

Without them the control follows the theme: CornflowerBlue, White, and SlateGray. Retheme every radio at once with the `--radio-*` variables (see [Radio defaults and theming](#radio-defaults-and-theming)).

### States and JavaScript

`disabled=true` disables an option; the wrapper dims and the native input stops responding. `id` sets the input's id (default `radio-<ordinal>`), which is what external scripts should look up, and `class` adds classes to the wrapper label. A radio with no visible label gets `aria-label="Radio"` unless `ariaLabel` is passed.

`js` accepts a single-token URL/path; it loads once per page with `<script src>` (page bundle and `assets/` resources are published and loaded directly), while anything else is inline source. Inline source runs on the input's `change` event by default, where `this` and `el` are the input and `el.checked` is the new state. Use `jsEvent="load"` to run it once after `DOMContentLoaded`, or `jsMode="src"` / `jsMode="inline"` to force how `js` is read.

{{< radio name="radio-disabled" label="Disabled" disabled=true >}}
{{< radio name="radio-disabled" label="Disabled, selected" checked=true disabled=true >}}

{{< radio name="radio-log" label="Log the state" checked=true js="console.log(el.id, el.checked)" >}}

```
{{</* radio id="my-radio" name="my-group" label="Run" js="/js/demo.js" */>}}
```

### Parameters

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

### Radio defaults and theming

Set defaults under `params.radio`; any shortcode argument overrides them. The geometry, colors, and motion are `--radio-*` CSS variables in `static/css/radio.css`, so a custom stylesheet (see `params.customCSS`) can retheme every radio.

```toml
[params.radio]
    size = "medium"
    tintColor = ""
    dotColor = ""
    borderColor = ""
    class = ""
```

## Checkbox

`checkbox` renders a theme-styled checkbox: a small square box with a thin SlateGray border and an inset shadow that fills with the theme's CornflowerBlue and shows the theme's `svg/ui-oval/check.svg` check mark when selected. It is a native `<input type="checkbox">` under the styled box, so it works without JavaScript, is reachable with <kbd>Tab</kbd>, and toggles with <kbd>Space</kbd>. The `label` accepts inline Markdown.

Usage:

```
{{</* checkbox label="Subscribe to the newsletter" */>}}

{{</* checkbox label="Remember me" checked=true */>}}
```

Basic checkboxes (`checked` sets the initial state):

{{< checkbox label="Subscribe to the newsletter" >}}
{{< checkbox label="Remember me" checked=true >}}
{{< checkbox label="Send **only** important mail" checked=true >}}

### Sizes

`size` accepts `small`/`s`, `medium`/`m` (default), or `large`/`l`:

{{< checkbox label="Small" size="small" >}}
{{< checkbox label="Medium" size="medium" checked=true >}}
{{< checkbox label="Large" size="large" checked=true >}}

### Colors

`tintColor` fills the selected box, `checkColor` sets the check mark, and `borderColor` sets the box border while unchecked. Any CSS color works:

{{< checkbox label="RoyalBlue" tintColor="RoyalBlue" checked=true >}}
{{< checkbox label="SeaGreen check" tintColor="SeaGreen" checkColor="Cornsilk" checked=true >}}
{{< checkbox label="Navy border" borderColor="Navy" >}}

Without them the control follows the theme: CornflowerBlue, White, and SlateGray. Retheme every checkbox at once with the `--checkbox-*` variables (see [Checkbox defaults and theming](#checkbox-defaults-and-theming)).

### Groups, states, and JavaScript

Checkboxes are independent. Give several checkboxes the same `name` to submit them as one form field with one value per checked option; without a name each checkbox gets a unique one so it never joins another field by accident. To group them under a visible title, wrap them in a [`buttongroup`](#button-group); the group id becomes their default name, and a child's own `name` still wins. `value` sets the submitted value and defaults to the plain-text label (or `on` when there is no label).

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

### Parameters

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

### Checkbox defaults and theming

Set defaults under `params.checkbox`; any shortcode argument overrides them. The geometry, colors, and motion are `--checkbox-*` CSS variables in `static/css/checkbox.css`, so a custom stylesheet (see `params.customCSS`) can retheme every checkbox.

```toml
[params.checkbox]
    size = "medium"
    tintColor = ""
    checkColor = ""
    borderColor = ""
    class = ""
```

## Button Group

`buttongroup` wraps one or more `button`, `radio`, or `checkbox` shortcodes in a native `<fieldset>` with an optional `<legend>`. `name` is the visible group title (inline Markdown), rendered as the legend; it is not a DOM id or form name. The fieldset id defaults to `buttongroup-<ordinal>` and seeds the default child ids of button/radio/checkbox children plus the default native name of radio/checkbox children, so a group of radios is mutually exclusive without setting `name` on each one. The group is a thin Silver-bordered panel with a plain bold Navy title. `orientation` chooses a vertical stack (default) or a wrapping horizontal row.

The group passes `size` to its children (a child's own `size` wins) and `disabled=true` disables every child. Colors stay with each component: use a button `type`/`tintColor`, a radio `tintColor`/`dotColor`, or a checkbox `tintColor`/`checkColor`. There is no group-level `js`; attach `js` to the individual control that needs behavior.

Usage:

```
{{</* buttongroup name="Actions" orientation="horizontal" */>}}
  {{</* button label="Save" type="primary" */>}}
  {{</* button label="Preview" */>}}
  {{</* button label="Cancel" */>}}
{{</* /buttongroup */>}}
```

A horizontal group of buttons:

{{< buttongroup name="Actions" orientation="horizontal" >}}
  {{< button label="Save" type="primary" >}}
  {{< button label="Preview" >}}
  {{< button label="Cancel" >}}
{{< /buttongroup >}}

A group of radios (`name` on each child is optional; the group id is the default native name):

{{< buttongroup name="Drink" >}}
  {{< radio label="Coffee" checked=true >}}
  {{< radio label="Tea" >}}
  {{< radio label="Water" >}}
{{< /buttongroup >}}

A horizontal group of checkboxes:

{{< buttongroup name="Toppings" orientation="horizontal" >}}
  {{< checkbox label="Cheese" checked=true >}}
  {{< checkbox label="Olives" >}}
  {{< checkbox label="Mushrooms" >}}
{{< /buttongroup >}}

### Shared size and disabled state

`size` (or `s` / `m` / `l`) is a fallback for every child; a child's own size wins. `disabled=true` disables all buttons, radios, and checkboxes in the group.

{{< buttongroup name="Plan" orientation="horizontal" size="large" >}}
  {{< radio label="Basic" checked=true >}}
  {{< radio label="Pro" size="small" >}}
  {{< button label="Choose" type="primary" >}}
{{< /buttongroup >}}

A disabled group:

{{< buttongroup name="Unavailable" orientation="horizontal" disabled=true >}}
  {{< button label="Action" >}}
  {{< radio name="disabled-radio" label="Option A" checked=true >}}
  {{< checkbox name="disabled-checkbox" label="Option B" >}}
{{< /buttongroup >}}

### Parameters

| Name | Description |
| --- | --- |
| `name` | Visible group title; inline Markdown. Rendered as the fieldset legend. |
| `orientation` | `vertical`/`v` (default) or `horizontal`/`h`. |
| `size` | Fallback size for the children: `small`/`s`, `medium`/`m`, or `large`/`l`. A child's own size wins. |
| `disabled` | Disable every child button, radio, and checkbox. |
| `ariaLabel` | Accessible name when there is no visible title. Default: `Button group`. |
| `id` | Fieldset id. Default: `buttongroup-<ordinal>`. Also the default native name and child-id base for button/radio/checkbox children. |
| `class` | Extra classes on the fieldset. |

### Button group defaults and theming

Set site defaults under `params.buttongroup` for orientation and extra classes; a shortcode argument still wins. Group geometry and the title are `--button-group-*` CSS variables in `static/css/buttongroup.css`; the children keep their own `--button-*`, `--radio-*`, and `--checkbox-*` variables.

```toml
[params.buttongroup]
    orientation = "vertical"
    class = ""
```

## Slider

`slider` renders a themed horizontal range control modelled on Apple's UISlider: a thin rounded track with a tinted minimum side, a white circular thumb lifted by a soft shadow, and a short ease. It is a native `<input type="range">` under the styled track, so it works without JavaScript, is reachable with <kbd>Tab</kbd>, and moves with the arrow keys, <kbd>Home</kbd>, and <kbd>End</kbd>. The `label` accepts inline Markdown.

By default the shortcode renders as a full-width block. Use `width` for a narrower block, or `inline=true` to share a line with text — see [Width and inline layout](#width-and-inline-layout).

Usage:

```
{{</* slider label="Volume" value=60 unit="%" */>}}

{{</* slider label="Text size" min=10 max=24 step=1 value=16 minIcon="svg/ui-oval/align-left-02.svg" maxIcon="svg/ui-oval/align-right-01.svg" */>}}
```

Basic sliders (`value` sets the initial state, `unit` suffixes the readout):

{{< slider label="Volume" value=60 unit="%" >}}

{{< slider label="Brightness" value=35 unit="%" >}}

{{< slider label="Opacity" min=0 max=1 step=0.05 value=0.65 >}}

### Range and step

`min`, `max`, and `step` define the range. `value` is clamped to `[min, max]` and snapped to the nearest step:

{{< slider label="Zoom" min=0 max=10 step=0.5 value=7.5 unit="×" >}}

{{< slider label="Temperature" min=-10 max=40 step=1 value=22 unit=" °C" >}}

### Colors

`tintColor` paints the minimum side of the track, `trackColor` the remaining side, and `thumbColor` the thumb. Any CSS color works:

{{< slider label="RoyalBlue" value=70 tintColor="RoyalBlue" >}}

{{< slider label="SeaGreen" value=45 tintColor="SeaGreen" trackColor="Gainsboro" >}}

{{< slider label="Gold thumb" value=55 tintColor="RoyalBlue" thumbColor="Gold" >}}

Without them the control follows the theme: CornflowerBlue, Gainsboro, and White. Retheme every slider at once with the `--slider-*` variables (see [Slider defaults and theming](#slider-defaults-and-theming)).

### Sizes

`size` accepts `small`/`s`, `medium`/`m` (default), or `large`/`l`:

{{< slider label="Small" size="small" value=25 >}}

{{< slider label="Medium" size="medium" value=50 >}}

{{< slider label="Large" size="large" value=75 >}}

### End icons

`minIcon` and `maxIcon` draw an icon at the two ends of the track, like UISlider's `minimumValueImage` and `maximumValueImage`. They take an icon path under `static/` and resolve through `icon.html`:

{{< slider label="Text size" min=10 max=24 step=1 value=16 minIcon="svg/ui-oval/align-left-02.svg" maxIcon="svg/ui-oval/align-right-01.svg" >}}

### Layout and states

`showValue=false` hides the readout; `id` sets the input's id (default `slider-<ordinal>`), which is what external scripts should look up; `class` adds classes to the wrapper. A slider with no visible label gets `aria-label="Slider"` unless `ariaLabel` is passed. `disabled=true` disables the control, and `name` adds a form field name.

{{< slider label="No readout" value=40 showValue=false >}}

{{< slider label="Disabled" value=65 disabled=true >}}

### Width and inline layout

By default the slider is a block-level box that fills its container (`width: 100%`). Set `width` to any CSS length or percentage to constrain it; it still occupies its own line:

{{< slider label="Narrow" value=45 width="20em" >}}

{{< slider label="Percentage" value=30 width="60%" >}}

`inline=true` switches the wrapper to `inline-flex`, so the control can share a line with text. The shortcode renders a `<span>`, which keeps it valid inside a paragraph. Without `width` an inline slider shrinks to a 12em track; pass `width` to fix the size:

Inline sliders side by side: {{< slider label="Left" value=30 size="small" inline=true >}} {{< slider label="Right" value=70 size="small" inline=true >}}

### JavaScript

`js` accepts a single-token URL/path; it loads once per page with `<script src>` (page bundle and `assets/` resources are published and loaded directly), while anything else is inline source. Inline source runs on the input's `input` event by default, where `this` and `el` are the input and `el.value` is the new value. Use `jsEvent="load"` to run it once after `DOMContentLoaded`, or `jsMode="src"` / `jsMode="inline"` to force how `js` is read.

{{< slider label="Log the value" js="console.log(el.id, el.value)" >}}

```
{{</* slider id="my-slider" label="Run" js="/js/demo.js" */>}}
```

### Parameters

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

### Slider defaults and theming

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

## Carousel

`carousel` is an image-only, dependency-free slideshow. It wraps one or more `slide` shortcodes, and each `slide` contributes one image. It supports previous/next buttons, several indicator styles (dots, segments, counter, or thumbnails), keyboard navigation, autoplay, a cross-fade effect, multiple images per view, and overlaid captions. Swipe, drag, or scroll horizontally to change slides.

Keep the shortcode block-level: do not put it inside a Markdown list item or paragraph (it breaks inside a `<p>`), and do not nest carousels.

### Basic usage

```
{{</* carousel label="Photo tour" */>}}

{{</* slide image="photo-1.jpg" alt="..." */>}}

{{</* slide image="photo-2.jpg" alt="..." */>}}

{{</* /carousel */>}}
```

A minimal carousel with the default navigator and dots:

{{< carousel label="Carousel shortcode demo" >}}

{{< slide image="img/carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="img/IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< slide image="img/IMG_0896.webp" alt="Canton Tower in Guangzhou" >}}

{{< /carousel >}}

`image` accepts a page resource, a global resource from `assets/`, or a URL; `alt` is its alternative text. A slide needs `image`, and should have `alt` for accessibility. Arguments are optional key/value pairs, such as `autoplay=true` or `indicatorStyle="thumbnails"`. Site-wide defaults come from `params.carousel` and are overridden by any shortcode argument; see [Parameters](#parameters).

#### Content mode

`contentMode` controls how an image fills its frame:

- `scaleToFill` (default): stretch to fill the frame, ignoring aspect ratio.
- `aspectFit`: fit inside the frame, preserving aspect ratio — the whole image is visible.
- `aspectFill`: fill the frame, preserving aspect ratio and cropping the overflow.

Set it on the carousel for a shared default, or on an individual slide to override it. Every carousel keeps a fixed frame: by default it is the ratio of the image shown first, so switching images never changes the carousel height. `aspectFill` crops each image into that frame, `aspectFit` letterboxes it, and `scaleToFill` stretches it. Set `aspectRatio` to choose a different frame (for example `aspectRatio="16/9"`).

This example uses `aspectFill` with an explicit `3/2` frame:

{{< carousel label="Aspect fill" contentMode="aspectFill" aspectRatio="3/2" >}}

{{< slide image="img/carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="img/IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< /carousel >}}

#### Captions

Give a slide a `caption` and/or `description`; both render in a frosted panel over the image. The caption is the stronger first line, and the description sits below it in smaller text. The panel is always visible, so it also works on touch screens, and links inside it stay clickable. Both values accept inline Markdown. If `alt` is omitted, the caption is used as the image's alternative text.

{{< carousel label="Slide captions" >}}

{{< slide image="img/carousel-example.webp" alt="Kada coast in Wakayama" caption="Kada **coast**" description="Wakayama, Japan. [More](/posts/)" >}}

{{< slide image="img/IMG_5999.webp" alt="Lake Biwa" caption="Lake Biwa" description="Shiga, Japan" captionPosition="tr" >}}

{{< /carousel >}}

The panel sits at `bottom-center` by default. `captionPosition` accepts `bottom-left`, `bottom-center`, `bottom-right`, `top-left`, `top-center`, or `top-right`; a slide can override the carousel value (the second slide above uses `top-right`). When an overlay control group shares the caption's exact position, the caption moves inward, above/below the group, automatically.

#### Common parameters

These are the options used most often; the full list is in [Carousel parameters](#carousel-parameters) and [Slide parameters](#slide-parameters).

| Name | Scope | Description |
| --- | --- | --- |
| `image` | slide | Page resource, global resource from `assets/`, or URL. |
| `alt` | slide | Alternative text; use `alt=""` for a decorative image. |
| `caption` | slide | Overlay title; supports inline Markdown. |
| `description` | slide | Overlay description under the caption; supports inline Markdown. |
| `captionPosition` | both | Caption panel position: `bottom-center` (default) or another corner/edge; a slide overrides the carousel value. |
| `contentMode` | both | Image fit: `scaleToFill` (default), `aspectFit`, or `aspectFill`. |
| `aspectRatio` | carousel | Frame ratio such as `3/2` or `16/9`. Default `auto`: the ratio of the image shown first. |
| `link` | slide | Wrap the image in a link; overrides the lightbox. |
| `lightbox` | slide | Open the image in the page lightbox; on by default when the page enables one. |
| `label` | carousel | Accessible name for the region; default `Carousel`. |
| `navigator` | carousel | Show previous/next buttons; default `true`. |
| `indicatorStyle` | carousel | `dots` (default), `segments`, `counter`, or `thumbnails`. |
| `perView` | carousel | Images visible at once; default `1`. |

#### Links and lightbox

By default, an image opens in the page lightbox when the page enables one. Set `lightbox=false` to disable that, or give the slide a `link` to navigate somewhere instead:

```
{{</* slide image="photo-1.jpg" alt="Kada coast" link="https://example.com" target="_blank" */>}}
```

`target="_blank"` defaults `rel` to `noopener noreferrer`; pass `rel` to override it. A slide also accepts `width`, `height`, `loading`, and `class`; see [Slide parameters](#slide-parameters).

### Layout

#### Multiple images per view

`perView` shows several images at once. Navigation still moves one slide at a time, so the counter shows the visible range (for example `1–2 of 4`) and the `segments` indicator's active segment marks the current position. Screens up to `40em` wide fall back to one image, and `perView` is ignored with `effect="fade"`.

This example shows two images at a time with a counter:

{{< carousel label="Two images per view" perView=2 indicatorStyle="counter" >}}

{{< slide image="img/IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< slide image="img/IMG_0896.webp" alt="Canton Tower in Guangzhou" >}}

{{< slide image="img/IMG_2173.webp" alt="Kyoto City KYOCERA Museum of Art" >}}

{{< slide image="img/IMG_3710.webp" alt="The Bund in Shanghai" >}}

{{< /carousel >}}

#### Scroll hint

`scrollHint=true` narrows each slide slightly so the adjacent slides peek in at both edges. With `loop`, every position has a peek on both sides; with `loop=false`, the first slide has no left peek and the last has no right peek. It is ignored with `effect="fade"` and when `perView` already covers every slide.

{{< carousel label="Scroll hint" scrollHint=true >}}

{{< slide image="img/carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="img/IMG_5999.webp" alt="Lake Biwa" >}}

{{< slide image="img/IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< /carousel >}}

{{< carousel label="Scroll hint" scrollHint=true loop=false >}}

{{< slide image="img/carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="img/IMG_5999.webp" alt="Lake Biwa" >}}

{{< slide image="img/IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< /carousel >}}

#### Transition

`effect` picks how slides change: `slide` (default) moves the track horizontally, while `fade` cross-fades in place. Fade ignores `perView`.

{{< carousel label="Fade carousel" effect="fade" >}}

{{< slide image="img/carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="img/IMG_5999.webp" alt="Lake Biwa" >}}

{{< /carousel >}}

### Navigator

#### Previous/next and indicators

`navigator` shows or hides the previous/next buttons; the indicator is independent. `indicatorStyle` chooses what appears in the navigator area:

| Style | Description |
| --- | --- |
| `dots` | Small dots; the active dot is larger and highlighted. Default. |
| `segments` | Segmented bar; active bar 2× wide, 1.5× thick. |
| `counter` | Text such as `1 / 4`. |
| `thumbnails` | Preview images in the same row as previous/next. |

Only one indicator is shown, and an interactive carousel always has one. This example hides previous/next and leaves the counter:

{{< carousel label="No arrows, counter indicator" navigator=false indicatorStyle="counter" >}}

{{< slide image="img/carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="img/IMG_5999.webp" alt="Lake Biwa" >}}

{{< slide image="img/IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< /carousel >}}

This example uses the segmented indicator, with prev/next still visible:

{{< carousel label="Segment indicator" indicatorStyle="segments" >}}

{{< slide image="img/carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="img/IMG_5999.webp" alt="Lake Biwa" >}}

{{< slide image="img/IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< /carousel >}}

#### Thumbnails

`indicatorStyle="thumbnails"` replaces the indicator with a row of preview images. Clicking a preview jumps to that slide and the active preview is outlined. If the previews overflow, their slot scrolls sideways and keeps the active one in view. The preview row follows `indicatorPosition`, in the below bar or in an overlay group.

Thumbnails work with `perView`, `loop`, and `fade`. With `perView`, every slide can be a starting position when `loop` is on; with `loop=false`, previews past the last starting position are hidden.

{{< carousel label="Thumbnail indicator" indicatorStyle="thumbnails" >}}

{{< slide image="img/carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="img/IMG_5999.webp" alt="Lake Biwa" >}}

{{< slide image="img/IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< slide image="img/IMG_2173.webp" alt="Kyoto City KYOCERA Museum of Art" >}}

{{< /carousel >}}

#### Positions

`navigatorOverlay` and `indicatorOverlay` are independent. Prev/next float over the image by default (`navigatorOverlay=true`), while the indicator sits in the below-image bar by default (`indicatorOverlay=false`).

The old `controlsPlacement`, `prevAlign`, `indicatorAlign`, `nextAlign`, and `captionAlign` arguments are replaced by `navigator`, `navigatorOverlay`, `indicatorOverlay`, `navigatorPosition`, `indicatorPosition`, and `captionPosition`.

`navigatorPosition` places previous/next:

- With `navigatorOverlay=true`: `bottom-left`, `bottom-center`, `bottom-right`, `top-left`, `top-center`, `top-right`, or `left-right` (default).
- With `navigatorOverlay=false`: `left`, `center`, `right`, or `left-right` (default).

`left-right` separates prev and next into the left/right edge strips. Any other value groups prev and next together at that position.

`indicatorPosition` places the indicator:

- With `indicatorOverlay=true`: `bottom-left`, `bottom-center` (default), `bottom-right`, `top-left`, `top-center`, or `top-right`.
- With `indicatorOverlay=false`: `left`, `center` (default), or `right`.

When both are overlaid and `navigatorPosition` equals `indicatorPosition`, they merge into one group in the order prev → indicator → next. This example merges all three at the bottom center:

{{< carousel label="Merged bottom-center overlay" navigatorOverlay=true indicatorOverlay=true navigatorPosition="bc" indicatorPosition="bc" >}}

{{< slide image="img/carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="img/IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< slide image="img/IMG_5999.webp" alt="Lake Biwa" >}}

{{< /carousel >}}

Positions can be written in full or abbreviated. `l`/`r` = left/right, `c`/`m` = center, `b`/`t` = bottom/top; so `bc` = `bottom-center`, `tr` = `top-right`, and `lr` = `left-right`. This example puts the navigator top-left and the indicator bottom-right:

{{< carousel label="Split overlay positions" navigatorOverlay=true indicatorOverlay=true navigatorPosition="tl" indicatorPosition="br" >}}

{{< slide image="img/carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="img/IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< slide image="img/IMG_5999.webp" alt="Lake Biwa" >}}

{{< /carousel >}}

With both overlays off, the same positions use the below-image bar. Here prev/next are grouped on the right and the indicator sits on the left:

{{< carousel label="Below bar with split positions" navigatorOverlay=false indicatorOverlay=false navigatorPosition="right" indicatorPosition="left" >}}

{{< slide image="img/IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< slide image="img/IMG_0896.webp" alt="Canton Tower in Guangzhou" >}}

{{< slide image="img/IMG_2173.webp" alt="Kyoto City KYOCERA Museum of Art" >}}

{{< /carousel >}}

Caption panels are independent of the navigator. If a caption and an overlay group share the same position, the caption is shifted inward so it does not cover the group; the navigator stays at the chosen edge. The autoplay corner button also moves to a free corner when a navigator group or caption occupies its default corner. If a navigator group sits along the top edge, set `progressPosition="bottom"` so the autoplay progress bar stays clear of it.

**Overlay with autoplay**

{{< carousel label="Overlay navigator with autoplay" navigatorOverlay=true indicatorOverlay=true autoplay=true pause=true navigatorPosition="left-right" indicatorPosition="bc" >}}

{{< slide image="img/carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="img/IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< /carousel >}}

**Overlay with thumbnails**

`indicatorStyle="thumbnails"` also works over the image: the preview strip sits on its frosted indicator panel, scrolls sideways when it overflows, and keeps the current preview in view. Because the strip is taller and wider than dots, it covers more of the image; use `indicatorPosition` or a caption position that leaves room.

{{< carousel label="Overlay navigator with thumbnails" navigatorOverlay=true indicatorOverlay=true indicatorStyle="thumbnails" indicatorPosition="bc" >}}

{{< slide image="img/carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="img/IMG_5999.webp" alt="Lake Biwa" >}}

{{< slide image="img/IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< slide image="img/IMG_2173.webp" alt="Kyoto City KYOCERA Museum of Art" >}}

{{< /carousel >}}

### Behavior

#### Dragging and scrolling

Swipe left or right on a touch screen, or click and drag with a mouse. A horizontal wheel or trackpad scroll — or `Shift` plus the wheel — moves one slide per gesture, and vertical scrolling stays with the page. With `effect="slide"` the track follows the pointer; with `effect="fade"` the gesture switches slides without the follow movement.

The gestures wrap at the ends when `loop` is on, and work with `perView` by moving one slide at a time.

#### Autoplay

Set `autoplay=true` to advance automatically; `interval` sets the delay in milliseconds (default `5000`). The pause/play control is a small circular button in a free image corner (top-right by default); its label changes between Pause autoplay and Start autoplay. `pause=true` also pauses autoplay while the pointer or keyboard focus is inside. With `prefers-reduced-motion`, autoplay starts paused.

`progressStyle` chooses how the interval is shown:

| Value | Effect |
| --- | --- |
| `both` | The thin progress bar and the ring around the corner button. Default. |
| `bar` | Only the thin progress bar; the corner button stays but has no ring. |
| `ring` | Only the ring around the corner button. |
| `none` | Only the corner button, with no progress visual. |

`progressPosition` puts the bar at the top (default) or bottom of the image. With `bar` or `none`, the corner button keeps working but has no progress ring.

The control is self-contained: it never takes a slot in the control position, so prev/next and the indicator keep their own layout. It picks the first free corner (top-right, bottom-right, top-left, bottom-left), so a control group or caption in the default corner moves it out of the way.

{{< carousel label="Autoplay carousel" autoplay=true pause=true interval=4000 indicatorStyle="counter" >}}

{{< slide image="img/IMG_2173.webp" alt="Kyoto City KYOCERA Museum of Art" >}}

{{< slide image="img/IMG_3710.webp" alt="The Bund in Shanghai" >}}

{{< /carousel >}}

#### Looping

`loop` controls the ends. The default, `true`, wraps one slide at a time: Next on the last slide continues forward into the first, and Prev on the first goes to the last. With `perView`, the window can wrap too, for example `3–4 → 4–1 → 1–2`. With `false`, Prev is disabled on the first slide and Next on the last.

{{< carousel label="Non-looping carousel" loop=false >}}

{{< slide image="img/IMG_0896.webp" alt="Canton Tower in Guangzhou" >}}

{{< slide image="img/IMG_2173.webp" alt="Kyoto City KYOCERA Museum of Art" >}}

{{< slide image="img/IMG_3710.webp" alt="The Bund in Shanghai" >}}

{{< /carousel >}}

#### Keyboard and starting slide

With `keyboard=true` (the default), Left/Right, Home, and End navigate while the carousel is focused; set `keyboard=false` to turn that off. `start` selects the initially active slide by its zero-based index; out-of-range values are clamped. This example starts on the second slide:

{{< carousel label="Starts on the second slide" start=1 >}}

{{< slide image="img/IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< slide image="img/IMG_0896.webp" alt="Canton Tower in Guangzhou" >}}

{{< slide image="img/IMG_2173.webp" alt="Kyoto City KYOCERA Museum of Art" >}}

{{< /carousel >}}

### Parameters

All carousel and slide arguments are optional. `params.carousel` supplies site-wide defaults, and any shortcode argument overrides them.

#### Carousel parameters

**Layout and content**

| Name | Description |
| --- | --- |
| `class` | Extra classes on the carousel root. |
| `label` | Accessible name for the carousel region; default `Carousel`. |
| `perView` | Number of images visible at once; default `1`. Ignored with `effect="fade"`; screens up to `40em` show one. |
| `scrollHint` | Leave slivers of the adjacent slides visible; default `false`. Ignored with `effect="fade"` or when `perView` covers every slide. |
| `effect` | `slide` (default) or `fade`. |
| `contentMode` | Default image fit: `scaleToFill` (default), `aspectFit`, or `aspectFill`. A slide can override it. |
| `aspectRatio` | Frame ratio such as `3/2`, `16/9`, or `1.5`. Default `auto`: the ratio of the image shown first. An explicit ratio overrides it, and `contentMode` crops, fits, or stretches each image inside the frame. With `perView`, each image fills its cell of that frame. |
| `start` | Zero-based index of the initially active slide; default `0`. Out-of-range values are clamped. |

**Captions**

| Name | Description |
| --- | --- |
| `captionPosition` | Caption panel position: `bottom-left`, `bottom-center` (default), `bottom-right`, `top-left`, `top-center`, or `top-right`. A slide can override it. |

**Navigator**

| Name | Description |
| --- | --- |
| `navigator` | Show previous/next buttons; default `true`. |
| `navigatorOverlay` | Float prev/next over the image; default `true`. Set `false` for the below bar. |
| `navigatorPosition` | Prev/next placement. Overlay: `bottom-left`, `bottom-center`, `bottom-right`, `top-left`, `top-center`, `top-right`, `left-right` (default). Below: `left`, `center`, `right`, `left-right` (default). |
| `indicatorStyle` | Indicator style: `dots` (default), `segments`, `counter`, or `thumbnails`. An interactive carousel always shows one. |
| `indicatorOverlay` | Float the indicator over the image; default `false`. Set `true` for an overlay group. |
| `indicatorPosition` | Indicator placement. Overlay: `bottom-left`, `bottom-center` (default), `bottom-right`, `top-left`, `top-center`, `top-right`. Below: `left`, `center` (default), `right`. |

**Autoplay**

| Name | Description |
| --- | --- |
| `autoplay` | Advance automatically; default `false`. |
| `interval` | Delay between advances in milliseconds; default `5000`. |
| `progressStyle` | Autoplay progress: `both` (default), `bar`, `ring`, or `none`. |
| `progressPosition` | Progress bar position: `top` (default) or `bottom`. |
| `pause` | Pause autoplay while the pointer or keyboard focus is inside; default `false`. |

**Navigation**

| Name | Description |
| --- | --- |
| `loop` | Wrap one slide at a time, including across `perView` windows (for example `3–4 → 4–1`); default `true`. With `false`, prev/next stop at the ends. |
| `keyboard` | Left/Right, Home, and End navigate while the carousel is focused; default `true`. |

Carousel ids are generated from the shortcode's ordinal on the page and are not configurable.

#### Slide parameters

| Name | Description |
| --- | --- |
| `image` | Page resource, global resource from `assets/`, or URL. |
| `alt` | Image alternative text; set `alt=""` for a decorative image. Defaults to the plain-text caption when omitted. |
| `caption` | Overlay title; supports inline Markdown. |
| `description` | Overlay description under the caption; supports inline Markdown. |
| `captionPosition` | Per-slide caption position: `bottom-left`, `bottom-center`, `bottom-right`, `top-left`, `top-center`, or `top-right`; defaults to the carousel value. |
| `link` | Wrap the image in a link; overrides the lightbox. |
| `target`, `rel` | Link attributes; `target="_blank"` defaults `rel` to `noopener noreferrer`. |
| `width`, `height` | Image dimension attributes; the file itself is not resized. |
| `loading` | `lazy` or `eager`; the initially visible slide defaults to `eager`, the rest to `lazy`. |
| `contentMode` | Per-slide image fit, overriding the carousel-level value. |
| `lightbox` | Open the image in the page lightbox: `true` (default when the page enables one) or `false`. |
| `class` | Extra classes on the slide wrapper. |

### Site-wide defaults

Set defaults under `params.carousel` in the site configuration. Autoplay, navigator, and indicator settings are grouped under their own tables; shortcode arguments stay flat (`autoplay`, `navigatorOverlay`, `indicatorStyle`, etc.). Any shortcode argument overrides them. The `icons` table maps each control to an icon path under `static/`, resolved by `icon.html`.

```toml
[params.carousel]
    perView = 1
    scrollHint = false
    loop = true
    keyboard = true
    effect = "slide"
    contentMode = "scaleToFill"
    aspectRatio = "auto"
    captionPosition = "bottom-center"
    label = "Carousel"

    [params.carousel.autoplay]
        enabled = false
        interval = 5000
        progressStyle = "both"
        progressPosition = "top"
        pause = false

    [params.carousel.navigator]
        enabled = true
        overlay = true
        position = "left-right"

    [params.carousel.indicator]
        style = "dots"
        overlay = false
        position = "center"

    [params.carousel.icons]
        prev = "svg/ui-oval/chevron-left.svg"
        next = "svg/ui-oval/chevron-right.svg"
        play = "svg/ui-oval/play.svg"
        pause = "svg/ui-oval/pause.svg"
```
