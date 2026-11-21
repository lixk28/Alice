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

A minimal carousel with the default controls and dots:

{{< carousel label="Carousel shortcode demo" >}}

{{< slide image="carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< slide image="IMG_0896.webp" alt="Canton Tower in Guangzhou" >}}

{{< /carousel >}}

`image` accepts a page resource, a global resource from `assets/`, or a URL; `alt` is its alternative text. A slide needs `image`, and should have `alt` for accessibility. Arguments are optional key/value pairs, such as `autoplay=true` or `indicatorStyle="thumbnails"`. Site-wide defaults come from `params.carousel` and are overridden by any shortcode argument; see [Parameters](#parameters).

#### Content mode

`contentMode` controls how an image fills its frame:

- `scaleToFill` (default): stretch to fill the frame, ignoring aspect ratio.
- `aspectFit`: fit inside the frame, preserving aspect ratio — the whole image is visible.
- `aspectFill`: fill the frame, preserving aspect ratio and cropping the overflow.

Set it on the carousel for a shared default, or on an individual slide to override it. This example uses `aspectFill`:

{{< carousel label="Aspect fill" contentMode="aspectFill" >}}

{{< slide image="carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< /carousel >}}

#### Captions

Give a slide a `caption` and/or `description`; both render in a frosted panel over the image. The caption is the stronger first line, and the description sits below it in smaller text. The panel is always visible, so it also works on touch screens, and links inside it stay clickable. Both values accept inline Markdown. If `alt` is omitted, the caption is used as the image's alternative text.

{{< carousel label="Slide captions" >}}

{{< slide image="carousel-example.webp" alt="Kada coast in Wakayama" caption="Kada **coast**" description="Wakayama, Japan. [More](/posts/)" >}}

{{< slide image="IMG_5999.webp" alt="Lake Biwa" caption="Lake Biwa" description="Shiga, Japan" captionPosition="top" captionAlign="right" >}}

{{< /carousel >}}

The panel sits at the bottom-left by default. Set `captionPosition` to `bottom` (default) or `top`, and `captionAlign` to `left` (default), `center`, or `right`; a slide can override either value with its own `captionPosition` / `captionAlign` (the second slide above uses the top-right corner). With an overlay control bar at the bottom, use `captionPosition="top"` so the caption stays clear of the controls.

#### Common parameters

These are the options used most often; the full list is in [Carousel parameters](#carousel-parameters) and [Slide parameters](#slide-parameters).

| Name | Scope | Description |
| --- | --- | --- |
| `image` | slide | Page resource, global resource from `assets/`, or URL. |
| `alt` | slide | Alternative text; use `alt=""` for a decorative image. |
| `caption` | slide | Overlay title; supports inline Markdown. |
| `description` | slide | Overlay description under the caption; supports inline Markdown. |
| `captionPosition` | both | Caption panel position: `bottom` (default) or `top`; a slide overrides the carousel value. |
| `captionAlign` | both | Caption panel alignment: `left` (default), `center`, or `right`; a slide overrides the carousel value. |
| `contentMode` | both | Image fit: `scaleToFill` (default), `aspectFit`, or `aspectFill`. |
| `link` | slide | Wrap the image in a link; overrides the lightbox. |
| `lightbox` | slide | Open the image in the page lightbox; on by default when the page enables one. |
| `label` | carousel | Accessible name for the region; default `Carousel`. |
| `controls` | carousel | Show previous/next buttons; default `true`. |
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

{{< carousel label="Two images per view" perView=2 indicatorStyle="counter" counterSeparator="of" >}}

{{< slide image="IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< slide image="IMG_0896.webp" alt="Canton Tower in Guangzhou" >}}

{{< slide image="IMG_2173.webp" alt="Kyoto City KYOCERA Museum of Art" >}}

{{< slide image="IMG_3710.webp" alt="The Bund in Shanghai" >}}

{{< /carousel >}}

#### Transition

`effect` picks how slides change: `slide` (default) moves the track horizontally, while `fade` cross-fades in place. Fade ignores `perView`.

{{< carousel label="Fade carousel" effect="fade" >}}

{{< slide image="carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="IMG_5999.webp" alt="Lake Biwa" >}}

{{< /carousel >}}

### Controls

#### Previous/next and indicators

`controls` shows or hides the previous/next buttons; the indicator is independent. `indicatorStyle` chooses what appears in the control bar:

| Style | Description |
| --- | --- |
| `dots` | Small dots, with the active dot highlighted. Default. |
| `segments` | Segmented bar: short inactive segments, with the active one widened. |
| `counter` | Text such as `1 / 4`; `counterSeparator` changes the middle text. |
| `thumbnails` | Preview images in the same row as previous/next. |

Only one indicator is shown, and an interactive carousel always has one. This example hides previous/next and leaves the counter:

{{< carousel label="No arrows, counter indicator" controls=false indicatorStyle="counter" counterSeparator="of" >}}

{{< slide image="carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="IMG_5999.webp" alt="Lake Biwa" >}}

{{< slide image="IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< /carousel >}}

#### Thumbnails

`indicatorStyle="thumbnails"` replaces the indicator with a row of preview images in the control bar, in the same row as previous/next. Clicking a preview jumps to that slide and the active preview is outlined. If the previews overflow, their slot scrolls sideways and keeps the active one in view. `indicatorAlign` decides whether the slot sits on the left, in the center, or on the right; the slot also gets extra width so a few previews stay visible.

Thumbnails work with `perView`, `loop`, and `fade`, and they join the overlay bar when `controlsPosition="top"` or `"bottom"` is used. With `perView`, previews past the last starting position are hidden.

{{< carousel label="Thumbnail indicator" indicatorStyle="thumbnails" >}}

{{< slide image="carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="IMG_5999.webp" alt="Lake Biwa" >}}

{{< slide image="IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< slide image="IMG_2173.webp" alt="Kyoto City KYOCERA Museum of Art" >}}

{{< /carousel >}}

#### Alignment

Each control and the indicator picks a horizontal zone with `prevAlign`, `indicatorAlign`, and `nextAlign`; each accepts `left`, `center`, or `right`. Within a zone the order is prev → indicator → next. Defaults are prev `left`, indicator `center`, and next `right`. Set all three to `center` for one centered row, or give prev/next the same zone to group them on one side.

This example moves prev/next to the left and puts the `segments` indicator on the right:

{{< carousel label="Controls left, segments right" prevAlign="left" nextAlign="left" indicatorAlign="right" indicatorStyle="segments" >}}

{{< slide image="IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< slide image="IMG_0896.webp" alt="Canton Tower in Guangzhou" >}}

{{< slide image="IMG_2173.webp" alt="Kyoto City KYOCERA Museum of Art" >}}

{{< /carousel >}}

#### Overlay placement

`controlsPosition` places the control bar below the image (`below`, the default) or overlays it on the image at `top` or `bottom`. In overlay mode, previous/next become full-height clickable strips on the left and right edges. The icon sits on a small frosted chip, centered horizontally and placed vertically by `vAlign` (`top`, `center` default, or `bottom`); hovering highlights the whole strip. The indicator floats on a matching frosted panel at the top or bottom so it stays readable over the photo. With the bar overlaid at the top, set `progressPosition="bottom"` so the autoplay bar stays clear of the controls. When autoplay is on, its corner button stays opposite the bar and shifts clear of an edge prev/next chip when `vAlign` places one in the same corner.

**Overlay at the bottom**

{{< carousel label="Overlay controls at the bottom" controlsPosition="bottom" >}}

{{< slide image="carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< /carousel >}}

**Overlay at the top**

{{< carousel label="Overlay controls at the top" controlsPosition="top" progressPosition="bottom" >}}

{{< slide image="IMG_5999.webp" alt="Lake Biwa" >}}

{{< slide image="IMG_2173.webp" alt="Kyoto City KYOCERA Museum of Art" >}}

{{< slide image="IMG_3710.webp" alt="The Bund in Shanghai" >}}

{{< /carousel >}}

**Overlay with autoplay**

Autoplay and overlay controls coexist: the corner button takes the top-right, the progress bar runs along the top edge, and the bottom overlay bar keeps prev/next and the indicator. If the overlay bar is at the top instead, the corner button moves to the bottom-right.

{{< carousel label="Overlay controls with autoplay" autoplay=true pause=true controlsPosition="bottom" >}}

{{< slide image="carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< /carousel >}}

**Overlay with thumbnails**

`indicatorStyle="thumbnails"` also works in the overlay bar: the preview strip sits on the bar's frosted panel, scrolls sideways when it overflows, and keeps the current preview in view. Because the strip is taller and wider than dots, it covers more of the image. If a caption also sits at the bottom, move it with `captionPosition="top"` or keep it clear of the strip horizontally. With autoplay on as well, the corner button still moves to the corner opposite the bar.

{{< carousel label="Overlay controls with thumbnails" controlsPosition="bottom" indicatorStyle="thumbnails" >}}

{{< slide image="carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="IMG_5999.webp" alt="Lake Biwa" >}}

{{< slide image="IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< slide image="IMG_2173.webp" alt="Kyoto City KYOCERA Museum of Art" >}}

{{< /carousel >}}

### Behavior

#### Dragging and scrolling

Swipe left or right on a touch screen, or click and drag with a mouse. A horizontal wheel or trackpad scroll — or `Shift` plus the wheel — moves one slide per gesture, and vertical scrolling stays with the page. With `effect="slide"` the track follows the pointer; with `effect="fade"` the gesture switches slides without the follow movement.

The gestures wrap at the ends when `loop` is on, and work with `perView` by moving one slide at a time.

#### Autoplay

Set `autoplay=true` to advance automatically; `interval` sets the delay in milliseconds (default `5000`). The pause/play control is a small circular button in the top-right corner of the image; its label changes between Pause autoplay and Start autoplay. `pause=true` also pauses autoplay while the pointer or keyboard focus is inside. With `prefers-reduced-motion`, autoplay starts paused.

`progressStyle` chooses how the interval is shown:

| Value | Effect |
| --- | --- |
| `both` | The thin progress bar and the ring around the corner button. Default. |
| `bar` | Only the thin progress bar; the corner button stays but has no ring. |
| `ring` | Only the ring around the corner button. |
| `none` | Only the corner button, with no progress visual. |

`progressPosition` puts the bar at the top (default) or bottom of the image. With `bar` or `none`, the corner button keeps working but has no progress ring.

The control is self-contained: it never takes a slot in the control bar, so prev/next and the indicator keep their own layout. The ring sits in the top-right corner, or the bottom-right corner when the overlay control bar is at the top, so keep a caption out of that corner when both are enabled.

{{< carousel label="Autoplay carousel" autoplay=true pause=true interval=4000 indicatorStyle="counter" >}}

{{< slide image="IMG_2173.webp" alt="Kyoto City KYOCERA Museum of Art" >}}

{{< slide image="IMG_3710.webp" alt="The Bund in Shanghai" >}}

{{< /carousel >}}

#### Looping

`loop` controls the ends. The default, `true`, wraps: Next on the last slide goes to the first, and Prev on the first goes to the last. With `false`, Prev is disabled on the first slide and Next on the last.

{{< carousel label="Non-looping carousel" loop=false >}}

{{< slide image="IMG_0896.webp" alt="Canton Tower in Guangzhou" >}}

{{< slide image="IMG_2173.webp" alt="Kyoto City KYOCERA Museum of Art" >}}

{{< slide image="IMG_3710.webp" alt="The Bund in Shanghai" >}}

{{< /carousel >}}

#### Keyboard and starting slide

With `keyboard=true` (the default), Left/Right, Home, and End navigate while the carousel is focused; set `keyboard=false` to turn that off. `start` selects the initially active slide by its zero-based index; out-of-range values are clamped. This example starts on the second slide:

{{< carousel label="Starts on the second slide" start=1 >}}

{{< slide image="IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< slide image="IMG_0896.webp" alt="Canton Tower in Guangzhou" >}}

{{< slide image="IMG_2173.webp" alt="Kyoto City KYOCERA Museum of Art" >}}

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
| `effect` | `slide` (default) or `fade`. |
| `contentMode` | Default image fit: `scaleToFill` (default), `aspectFit`, or `aspectFill`. A slide can override it. |
| `start` | Zero-based index of the initially active slide; default `0`. Out-of-range values are clamped. |

**Captions**

| Name | Description |
| --- | --- |
| `captionPosition` | Caption panel position: `bottom` (default) or `top`. A slide can override it. |
| `captionAlign` | Caption panel alignment: `left` (default), `center`, or `right`. A slide can override it. |

**Controls**

| Name | Description |
| --- | --- |
| `controls` | Show previous/next buttons; default `true`. |
| `controlsPosition` | Control bar placement: `below` (default), `top`, or `bottom`; top/bottom overlay the image. |
| `indicatorStyle` | Indicator style: `dots` (default), `segments`, `counter`, or `thumbnails`. An interactive carousel always shows one. |
| `indicatorAlign` | Zone for the indicator: `left`, `center` (default), or `right`. |
| `prevAlign` | Zone for the previous button in `below` mode; default `left`. |
| `nextAlign` | Zone for the next button in `below` mode; default `right`. |
| `vAlign` | Vertical place of the overlay previous/next icon: `top`, `center` (default), or `bottom`. |
| `counterSeparator` | Text between current and total with `indicatorStyle="counter"`; default `/`. |

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
| `loop` | Wrap from the last slide to the first and from the first to the last; default `true`. With `false`, prev/next stop at the ends. |
| `keyboard` | Left/Right, Home, and End navigate while the carousel is focused; default `true`. |

Carousel ids are generated from the shortcode's ordinal on the page and are not configurable.

#### Slide parameters

| Name | Description |
| --- | --- |
| `image` | Page resource, global resource from `assets/`, or URL. |
| `alt` | Image alternative text; set `alt=""` for a decorative image. Defaults to the plain-text caption when omitted. |
| `caption` | Overlay title; supports inline Markdown. |
| `description` | Overlay description under the caption; supports inline Markdown. |
| `captionPosition` | Per-slide caption position: `top` or `bottom`; defaults to the carousel value. |
| `captionAlign` | Per-slide caption alignment: `left`, `center`, or `right`; defaults to the carousel value. |
| `link` | Wrap the image in a link; overrides the lightbox. |
| `target`, `rel` | Link attributes; `target="_blank"` defaults `rel` to `noopener noreferrer`. |
| `width`, `height` | Image dimension attributes; the file itself is not resized. |
| `loading` | `lazy` or `eager`; the initially visible slide defaults to `eager`, the rest to `lazy`. |
| `contentMode` | Per-slide image fit, overriding the carousel-level value. |
| `lightbox` | Open the image in the page lightbox: `true` (default when the page enables one) or `false`. |
| `class` | Extra classes on the slide wrapper. |

### Site-wide defaults

Set defaults under `params.carousel` in the site configuration. Any shortcode argument overrides them. The `icons` table maps each control to an icon path under `static/`, resolved by `svg-icon.html`.

```toml
[params.carousel]
    autoplay = false
    interval = 5000
    progressStyle = "both"
    progressPosition = "top"
    controls = true
    controlsPosition = "below"
    prevAlign = "left"
    indicatorStyle = "dots"
    indicatorAlign = "center"
    nextAlign = "right"
    perView = 1
    counterSeparator = "/"
    loop = true
    keyboard = true
    pause = false
    effect = "slide"
    contentMode = "scaleToFill"
    captionPosition = "bottom"
    captionAlign = "left"
    vAlign = "center"
    label = "Carousel"

    [params.carousel.icons]
        prev = "svg/ui-oval/chevron-left.svg"
        next = "svg/ui-oval/chevron-right.svg"
        play = "svg/ui-oval/play.svg"
        pause = "svg/ui-oval/pause.svg"
```
