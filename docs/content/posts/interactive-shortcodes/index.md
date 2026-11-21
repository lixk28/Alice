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

`carousel` is an image-only, dependency-free slideshow. It wraps one or more `slide` shortcodes, and each `slide` contributes one image. It supports previous/next buttons, several indicator styles, keyboard navigation, autoplay, a cross-fade effect, and multiple images per view; touch swipe works out of the box.

```
{{</* carousel label="Photo tour" */>}}

{{</* slide image="photo-1.jpg" alt="..." */>}}

{{</* slide image="photo-2.jpg" alt="..." */>}}

{{</* /carousel */>}}
```

Keep the shortcode block-level: do not put it inside a Markdown list item or paragraph (it breaks inside a `<p>`), and do not nest carousels.

### Content

#### Images

{{< carousel label="Carousel shortcode demo" >}}

{{< slide image="carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< slide image="IMG_0896.webp" alt="Canton Tower in Guangzhou" >}}

{{< /carousel >}}

`image` is a page resource, a global resource, or a URL, and `alt` is its alt text (`alt=""` for a decorative image). A `link` turns the image into a link and overrides the page lightbox; otherwise the image opens in the page lightbox when the page enables one, and `lightbox=false` disables that.

#### Image fit

Each image has a `contentMode` that controls how it fills its frame:

- `scaleToFill` (default): stretch to fill the frame, ignoring aspect ratio.
- `aspectFit`: fit within the frame, preserving aspect ratio — the whole image is visible.
- `aspectFill`: fill the frame, preserving aspect ratio and cropping the overflow.

Set `contentMode` on the carousel for a shared default, or on an individual `slide` to override it.

{{< carousel label="Aspect fill" contentMode="aspectFill" >}}

{{< slide image="carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< /carousel >}}

### Behavior

#### Autoplay

Set `autoplay=true` to advance automatically, with `interval` giving the delay in milliseconds (default `5000`). The pause button appears with autoplay, and a thin progress line fills each interval and hides while paused. It sits above the image — `progressPosition="bottom"` moves it below — and `pause=true` also pauses on hover/focus.

{{< carousel label="Autoplay carousel" autoplay=true interval=4000 indicatorStyle="counter" >}}

{{< slide image="IMG_2173.webp" alt="Kyoto City KYOCERA Museum of Art" >}}

{{< slide image="IMG_3710.webp" alt="The Bund in Shanghai" >}}

{{< /carousel >}}

#### Transition

`effect` picks how slides change: `slide` (default) moves the track horizontally, and `fade` cross-fades in place. Fade ignores `perView`.

{{< carousel label="Fade carousel" effect="fade" indicatorStyle="dots" >}}

{{< slide image="carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="IMG_5999.webp" alt="Lake Biwa" >}}

{{< /carousel >}}

#### Multiple images per view

`perView` shows more than one image at a time. Navigation still moves one slide at a time, so the counter shows the visible range (for example `1–2 of 4`) and the bar's active segment marks the current position. Screens up to `40em` wide fall back to one image, and `perView` is ignored with `effect="fade"`.

{{< carousel label="Two images per view" perView=2 indicatorStyle="counter" counterSeparator="of" >}}

{{< slide image="IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< slide image="IMG_0896.webp" alt="Canton Tower in Guangzhou" >}}

{{< slide image="IMG_2173.webp" alt="Kyoto City KYOCERA Museum of Art" >}}

{{< slide image="IMG_3710.webp" alt="The Bund in Shanghai" >}}

{{< /carousel >}}

#### Looping

`loop` controls the ends. `true` (the default) wraps: Next on the last slide goes to the first, and Prev on the first goes to the last. `false` stops: Prev is disabled on the first slide and Next on the last.

**Loop**

{{< carousel label="Looping carousel" loop=true >}}

{{< slide image="carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="IMG_5999.webp" alt="Lake Biwa" >}}

{{< slide image="IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< /carousel >}}

**No loop**

{{< carousel label="Non-looping carousel" loop=false >}}

{{< slide image="IMG_0896.webp" alt="Canton Tower in Guangzhou" >}}

{{< slide image="IMG_2173.webp" alt="Kyoto City KYOCERA Museum of Art" >}}

{{< slide image="IMG_3710.webp" alt="The Bund in Shanghai" >}}

{{< /carousel >}}

### Controls

#### Buttons and indicators

`controls=false` hides previous/next. `indicatorStyle` picks the indicator: `dots` (default), `bar` (segmented, with the active segment widened), `counter`, or `none`.

{{< carousel label="Default controls" indicatorStyle="dots" >}}

{{< slide image="carousel-example.webp" alt="Kada coast in Wakayama" >}}

{{< slide image="IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< slide image="IMG_0896.webp" alt="Canton Tower in Guangzhou" >}}

{{< /carousel >}}

#### Alignment

Each control and the indicator picks a horizontal zone with `prevAlign`, `indicatorAlign`, `nextAlign`, and `autoplayAlign` — each accepts `left`, `center`, or `right`. Within a zone the order is prev → indicator → next → play/pause. Defaults are prev left, indicator center, next right, play/pause right; set all four to `center` for one centered row, or give prev/next/autoplay the same zone to group them on one side.

{{< carousel label="Controls left, bar right" prevAlign="left" nextAlign="left" autoplayAlign="left" indicatorAlign="right" indicatorStyle="bar" >}}

{{< slide image="IMG_0183.webp" alt="Kyoto Station with Kyoto Tower" >}}

{{< slide image="IMG_0896.webp" alt="Canton Tower in Guangzhou" >}}

{{< slide image="IMG_2173.webp" alt="Kyoto City KYOCERA Museum of Art" >}}

{{< /carousel >}}

#### Overlay placement

Set `controlsPosition="top"` or `"bottom"` to overlay the controls on the image instead of placing a bar below. Previous/next become full-height clickable strips on the left and right edges. The icon sits on a small frosted chip, centered horizontally and placed vertically by `vAlign` (`top`, `center` default, or `bottom`); the whole strip highlights on hover. The indicator and play/pause float on a matching frosted panel at the top or bottom so they stay readable over the photo. `progressPosition` remains independent.

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

### Parameters

`carousel` parameters (all optional; `params.carousel` supplies the site defaults):

| Name | Description |
| --- | --- |
| `class` | Extra classes on the root |
| `label` | Accessible name for the carousel region |
| `autoplay` | Enable autoplay: `true` or `false` (default `false`) |
| `interval` | Autoplay delay in milliseconds (default `5000`) |
| `progressPosition` | Autoplay progress bar position: `top` (default) or `bottom` |
| `controls` | Previous/next buttons: `true` or `false` |
| `controlsPosition` | Control bar placement: `below` (default), `top`, or `bottom`; top/bottom overlay the image |
| `prevAlign` | Previous button zone in `below` mode: `left` (default), `center`, or `right` |
| `indicatorStyle` | Indicator style: `dots` (default), `bar`, `counter`, or `none` |
| `indicatorAlign` | Indicator zone: `left`, `center` (default), or `right` |
| `nextAlign` | Next button zone in `below` mode: `left`, `center`, or `right` (default `right`) |
| `autoplayAlign` | Play/pause zone: `left`, `center`, or `right` (default `right`) |
| `vAlign` | Vertical place of the overlay prev/next icon: `top`, `center` (default), or `bottom` |
| `perView` | Images visible at once (default `1`); ignored with `effect="fade"`; screens up to `40em` show one |
| `counterSeparator` | Text between current and total when `indicatorStyle="counter"`; default `/` (set `of`) |
| `loop` | Circular navigation: `true` (default) wraps; `false` stops at the ends |
| `keyboard` | Arrow keys move between slides while focused: `true` or `false` |
| `pause` | Pause autoplay while the pointer or focus is inside: `true` or `false` |
| `effect` | `slide` or `fade` |
| `contentMode` | Image content mode: `scaleToFill` (default), `aspectFit`, or `aspectFill` |
| `start` | Zero-based index of the initially active slide |

`slide` parameters (all optional):

| Name | Description |
| --- | --- |
| `image` | Page resource, global resource, or URL |
| `alt` | Image alt text; set `alt=""` for a decorative image |
| `link` | Make the image a link (overrides the page lightbox) |
| `target`, `rel` | Link attributes; `target="_blank"` defaults `rel` to `noopener noreferrer` |
| `width`, `height` | Image dimension attributes |
| `loading` | `lazy` or `eager`; the initially active slide defaults to `eager` |
| `contentMode` | Per-image content mode, overriding the carousel-level setting |
| `lightbox` | Open the image in the page lightbox: `true` or `false` |
| `class` | Extra classes on the slide |

Set site-wide defaults under `params.carousel`:

```toml
[params.carousel]
    autoplay = false
    interval = 5000
    progressPosition = "top"
    controls = true
    controlsPosition = "below"
    prevAlign = "left"
    indicatorStyle = "dots"
    indicatorAlign = "center"
    nextAlign = "right"
    autoplayAlign = "right"
    perView = 1
    counterSeparator = "/"
    loop = true
    keyboard = true
    pause = false
    effect = "slide"
    contentMode = "scaleToFill"
    vAlign = "center"
    label = "Carousel"

    [params.carousel.icons]
        prev = "svg/ui-oval/chevron-left.svg"
        next = "svg/ui-oval/chevron-right.svg"
        play = "svg/ui-oval/play.svg"
        pause = "svg/ui-oval/stop.svg"
```
