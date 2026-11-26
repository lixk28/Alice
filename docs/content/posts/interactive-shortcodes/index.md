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

`icon` takes a sprite path under `static/` and resolves it through the theme's `svg-icon.html` partial. `iconPos` is `start` (default) or `end`. An icon-only button needs `label=""` plus `ariaLabel` or `title`.

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
| `icon` | Icon path under `static/`, e.g. `svg/ui-oval/chevron-right.svg`; resolved by `svg-icon.html`. |
| `iconPos` | Icon placement: `start` (default) or `end`; `before`/`after` are aliases. |
| `title` | Native tooltip, also used as the accessible name for an icon-only button. |
| `ariaLabel` | Accessible name when the visible label is empty or differs. |
| `id` | Element id, useful for external scripts. Default: `button-<ordinal>`. |

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

Set defaults under `params.carousel` in the site configuration. Autoplay, navigator, and indicator settings are grouped under their own tables; shortcode arguments stay flat (`autoplay`, `navigatorOverlay`, `indicatorStyle`, etc.). Any shortcode argument overrides them. The `icons` table maps each control to an icon path under `static/`, resolved by `svg-icon.html`.

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
