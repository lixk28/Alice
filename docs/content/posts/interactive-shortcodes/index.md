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

{{< slide image="IMG_5999.webp" alt="Lake Biwa" caption="Lake Biwa" description="Shiga, Japan" captionPosition="tr" >}}

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

`controls` shows or hides the previous/next buttons; the indicator is independent. `indicatorStyle` chooses what appears in the control area:

| Style | Description |
| --- | --- |
| `dots` | Small dots; the active dot is larger and highlighted. Default. |
| `segments` | Segmented bar; active bar 2× wide, 1.5× thick. |
| `counter` | Text such as `1 / 4`; `counterSeparator` changes the middle text. |
| `thumbnails` | Preview images in the same row as previous/next. |

Only one indicator is shown, and an interactive carousel always has one. This example hides previous/next and leaves the counter:

{{< carousel label="No arrows, counter indicator" controls=false indicatorStyle="counter" counterSeparator="of" >}}

{{< slide image="carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="IMG_5999.webp" alt="Lake Biwa" >}}

{{< slide image="IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< /carousel >}}

#### Thumbnails

`indicatorStyle="thumbnails"` replaces the indicator with a row of preview images. Clicking a preview jumps to that slide and the active preview is outlined. If the previews overflow, their slot scrolls sideways and keeps the active one in view. The preview row follows `indicatorPosition`, in the below bar or in an overlay group.

Thumbnails work with `perView`, `loop`, and `fade`. With `perView`, every slide can be a starting position when `loop` is on; with `loop=false`, previews past the last starting position are hidden.

{{< carousel label="Thumbnail indicator" indicatorStyle="thumbnails" >}}

{{< slide image="carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="IMG_5999.webp" alt="Lake Biwa" >}}

{{< slide image="IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< slide image="IMG_2173.webp" alt="Kyoto City KYOCERA Museum of Art" >}}

{{< /carousel >}}

#### Positions

`overlay` controls whether the controls float over the image. It defaults to `false`, so they sit in a bar below the image; set `overlay=true` to float them over it.

The old `controlsPlacement`, `prevAlign`, `indicatorAlign`, `nextAlign`, and `captionAlign` arguments are replaced by `overlay`, `controlsPosition`, `indicatorPosition`, and `captionPosition`.

`controlsPosition` places previous/next:

- Below the image: `left`, `center`, `right`, or `left-right` (default).
- Over the image: `bottom-left`, `bottom-center`, `bottom-right`, `top-left`, `top-center`, `top-right`, or `left-right` (default).

`left-right` separates prev and next into the left/right edge strips. Any other value groups prev and next together at that position.

`indicatorPosition` places the indicator:

- Below the image: `left`, `center` (default), or `right`.
- Over the image: `bottom-left`, `bottom-center` (default), `bottom-right`, `top-left`, `top-center`, or `top-right`.

When `controlsPosition` and `indicatorPosition` are the same, they merge into one group in the order prev → indicator → next. This example merges all three at the bottom center:

{{< carousel label="Merged bottom-center overlay" overlay=true controlsPosition="bc" indicatorPosition="bc" >}}

{{< slide image="carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< slide image="IMG_5999.webp" alt="Lake Biwa" >}}

{{< /carousel >}}

Positions can be written in full or abbreviated. `l`/`r` = left/right, `c`/`m` = center, `b`/`t` = bottom/top; so `bc` = `bottom-center`, `tr` = `top-right`, and `lr` = `left-right`. This example puts the controls top-left and the indicator bottom-right:

{{< carousel label="Split overlay positions" overlay=true controlsPosition="tl" indicatorPosition="br" >}}

{{< slide image="carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< slide image="IMG_5999.webp" alt="Lake Biwa" >}}

{{< /carousel >}}

With `overlay=false` the same positions use the below-image bar. Here prev/next are grouped in the center and the indicator sits on the right:

{{< carousel label="Below bar with split positions" overlay=false controlsPosition="center" indicatorPosition="right" >}}

{{< slide image="IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< slide image="IMG_0896.webp" alt="Canton Tower in Guangzhou" >}}

{{< slide image="IMG_2173.webp" alt="Kyoto City KYOCERA Museum of Art" >}}

{{< /carousel >}}

Caption panels are independent of the controls. If a caption and an overlay group share the same position, the caption is shifted inward so it does not cover the group; the controls stay at the chosen edge. The autoplay corner button also moves to a free corner when a control group or caption occupies its default corner. If a control group sits along the top edge, set `progressPosition="bottom"` so the autoplay progress bar stays clear of it.

**Overlay with autoplay**

{{< carousel label="Overlay controls with autoplay" overlay=true autoplay=true pause=true controlsPosition="left-right" indicatorPosition="bc" >}}

{{< slide image="carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< /carousel >}}

**Overlay with thumbnails**

`indicatorStyle="thumbnails"` also works over the image: the preview strip sits on its frosted indicator panel, scrolls sideways when it overflows, and keeps the current preview in view. Because the strip is taller and wider than dots, it covers more of the image; use `indicatorPosition` or a caption position that leaves room.

{{< carousel label="Overlay controls with thumbnails" overlay=true indicatorStyle="thumbnails" indicatorPosition="bc" >}}

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

{{< slide image="IMG_2173.webp" alt="Kyoto City KYOCERA Museum of Art" >}}

{{< slide image="IMG_3710.webp" alt="The Bund in Shanghai" >}}

{{< /carousel >}}

#### Looping

`loop` controls the ends. The default, `true`, wraps one slide at a time: Next on the last slide continues forward into the first, and Prev on the first goes to the last. With `perView`, the window can wrap too, for example `3–4 → 4–1 → 1–2`. With `false`, Prev is disabled on the first slide and Next on the last.

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
| `captionPosition` | Caption panel position: `bottom-left`, `bottom-center` (default), `bottom-right`, `top-left`, `top-center`, or `top-right`. A slide can override it. |

**Controls**

| Name | Description |
| --- | --- |
| `controls` | Show previous/next buttons; default `true`. |
| `overlay` | Float the controls over the image; default `false`. Set `true` for overlay groups. |
| `controlsPosition` | Prev/next placement. Below: `left`, `center`, `right`, `left-right` (default). Overlay: `bottom-left`, `bottom-center`, `bottom-right`, `top-left`, `top-center`, `top-right`, `left-right` (default). |
| `indicatorStyle` | Indicator style: `dots` (default), `segments`, `counter`, or `thumbnails`. An interactive carousel always shows one. |
| `indicatorPosition` | Indicator placement. Below: `left`, `center` (default), `right`. Overlay: `bottom-left`, `bottom-center` (default), `bottom-right`, `top-left`, `top-center`, `top-right`. |
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

Set defaults under `params.carousel` in the site configuration. Any shortcode argument overrides them. The `icons` table maps each control to an icon path under `static/`, resolved by `svg-icon.html`.

```toml
[params.carousel]
    autoplay = false
    interval = 5000
    progressStyle = "both"
    progressPosition = "top"
    controls = true
    overlay = false
    controlsPosition = "left-right"
    indicatorStyle = "dots"
    indicatorPosition = "center"
    perView = 1
    counterSeparator = "/"
    loop = true
    keyboard = true
    pause = false
    effect = "slide"
    contentMode = "scaleToFill"
    captionPosition = "bottom-center"
    label = "Carousel"

    [params.carousel.icons]
        prev = "svg/ui-oval/chevron-left.svg"
        next = "svg/ui-oval/chevron-right.svg"
        play = "svg/ui-oval/play.svg"
        pause = "svg/ui-oval/pause.svg"
```
