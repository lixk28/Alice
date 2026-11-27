---
title: "Card"
description: "Cover, title, description, link, and tags for books, films, repositories, and friend links."
date: 2024-10-04T00:09:24+08:00
lastmod: 2024-10-04T00:09:24+08:00
type: docs
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
weight: 53
toc:
    show: true
    snake: true
codeblock:
    highlight: true
    cursed: true
---

`card` renders a cover, title, description, link, and tag chips in one block.
It is general enough for a book, a film, a repository, a friend link, or any
other hand-written entry, and heavier than an inline `label` while staying more
flexible than a `figure`.

The card is static: every field comes from the shortcode arguments, and nothing
is fetched from the network during the build. A cover may be a page resource, a
file under `static/`, an asset, or an absolute URL. The card reuses the friend
card skin from `static/css/friend.css`, so it has the same border, offset
shadow, hover lift, and overlay link; `static/css/card.css` adds the cover
sizing, layout variants, and tag chips. Data-driven friend grids still use the
[Friends shortcodes](../../miscellaneous-shortcodes/friends/).

## Book

{{< card
    title="The Classic Web"
    description="A short, opinionated tour of the ideas that make a page feel at home on the web."
    cover="img/DSC_1662.webp"
    coverAlt="A landscape photograph used as a stand-in book cover"
    coverRatio="2/3"
    link="https://gohugo.io/"
    tags="Book, Design, Web"
/>}}

```markdown
{{</* card
    title="The Classic Web"
    description="A short, opinionated tour of the ideas that make a page feel at home on the web."
    cover="img/cover.webp"
    coverAlt="A landscape photograph used as a stand-in book cover"
    coverRatio="2/3"
    link="https://example.com/book"
    tags="Book, Design, Web"
/*/>}}
```

## Repository

{{< card
    title="Hugo"
    description="The world's fastest framework for building websites."
    cover="img/HugoAliceLogo.webp"
    coverAlt="The Hugo logo"
    link="https://gohugo.io"
    tags="Repository, Static site"
/>}}

A repository card is the same component with different words. Give `coverRatio`
a fixed value when covers have different shapes and the cards should line up:

{{< card
    title="Alice"
    description="A classic and elegant Hugo theme."
    cover="img/IMG_0183.webp"
    coverAlt="A landscape photograph used as a stand-in cover"
    coverRatio="16/9"
    coverWidth="12em"
    coverPos="right"
    link="https://lixk28.github.io/Alice/"
    tags="Theme, Hugo"
/>}}

## Film

A `column` layout puts the cover on top, which suits posters and grids. The
description may also come from the inner content instead of the `description`
argument:

{{< card
    title="A Film"
    cover="img/DSC_1662.webp"
    coverAlt="A landscape photograph used as a stand-in poster"
    coverRatio="2/3"
    layout="column"
    link="https://example.com/film"
    tags="Film, 2026"
>}}
A one-line description with **Markdown**, rendered from the inner content.
{{< /card >}}

## Tags only

The cover, description, and link are optional. A card without a link keeps its
text selectable and does not lift on hover:

{{< card
    title="A read-only card"
    description="Useful for an entry you want to present without linking anywhere."
    tags="Static, No link"
/>}}

## Usage

```markdown
{{</* card title="Hugo" description="The world's fastest framework." cover="img/logo.webp" link="https://gohugo.io" tags="Repository, Static site" /*/>}}

{{</* card title="A Film" layout="column" cover="img/poster.webp" coverRatio="2/3" */>}}
A description with **Markdown**.
{{</* /card */>}}
```

Because the card reads the inner content for its description, a card without
inner content must be self-closed: `{{</* card title="Hugo" /*/>}}`.

Tags are a comma-separated list. Each becomes a plain chip; tags are not links,
so they can describe a book, a film, or a repository without a matching
taxonomy page.

## Parameters

| Name | Description |
| --- | --- |
| `title` | Card title, inline Markdown. Also the fallback cover alt; the link label falls back to the description when the title is empty. |
| `description` | Card body, Markdown. The inner content wins when present; `desc` is an alias. |
| `cover` | Cover image: page resource, static path, asset, or absolute URL. `image` and `src` are aliases. |
| `coverAlt` | Cover alt text. Defaults to the plain-text title; `alt` is an alias. |
| `coverWidth` | CSS length for the cover; in the row layout it sizes the cover column. Default: `params.card.coverWidth` or `8em`. A bare number means pixels. |
| `coverRatio` | CSS `aspect-ratio` for the cover, e.g. `2/3` or `16/9`. Empty keeps the image's natural ratio. |
| `link` | URL the whole card links to. `href` and `url` are aliases. |
| `target` | Link target. Empty opens external `http(s)` links in a new tab and keeps internal links in the current tab. |
| `rel` | Link `rel`. Defaults to `noopener noreferrer` when `target` is `_blank`; `noopener` is kept if you supply other tokens. |
| `tags` | Comma-separated tags, rendered as plain chips; `tag` is an alias. |
| `layout` | `row` (default) or `column`. `horizontal`/`h` and `vertical`/`v` work too. |
| `coverPos` | `left` (default) or `right` in the row layout. |
| `loading` | Cover loading attribute: `lazy` (default) or `eager`. |
| `ariaLabel` | Accessible name for the overlay card link. Defaults to the plain-text title, then the description. |
| `id`, `class` | Element id and extra class(es) on the card. |

The cover is resolved through `layouts/_partials/image-url.html`: a page bundle
resource first, then a file under `static/`, then an asset, and finally a URL
relative to the site root. Nothing is downloaded while Hugo builds the page.

## Site-wide defaults and theming

```toml
[params.card]
    layout = "row"
    # Empty uses the stylesheet's 8em.
    coverWidth = ""
    coverRatio = ""
    coverPos = "left"
    target = ""
    rel = ""
    loading = "lazy"
    class = ""
```

`static/css/card.css` exposes `--card-cover-width` for the cover; the
`coverWidth` argument or `params.card.coverWidth` overrides it. The rest of the
look comes from the friend card rules, so the global color, font, and shadow
tokens still apply. A custom stylesheet can target `.card`, `.card-body`,
`.card-title`, `.card-description`, `.card-tags`, and `.card-tag`.

The `friend` shortcode uses the same renderer with `variant="friend"`, which
keeps the original friend card markup and skips the card defaults above. The
`frienmily` grid keeps its own loop and original markup.
