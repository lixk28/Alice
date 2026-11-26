---
title: "Ruby"
description: "Phonetic annotations with HTML ruby."
type: docs
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
weight: 52
toc:
    show: true
    snake: true
codeblock:
    highlight: true
    cursed: true
---

## Usage

Pass the base text and its reading as positional arguments. The reading is
placed above the base text, with parentheses as the fallback for browsers that
do not support ruby:

The word {{< ruby "漢字" "かんじ" >}} means "Chinese characters".

The shortcode emits:

```html
<ruby>漢字<rp>(</rp><rt>かんじ</rt><rp>)</rp></ruby>
```

## Named form

Use named arguments when you need `lang` or `class`:

{{< ruby base="東京" rt="とうきょう" lang="ja" >}}

```md
{{</* ruby base="東京" rt="とうきょう" lang="ja" */>}}
```

Hugo does not allow mixing named and positional parameters. In positional
form, the third argument is the optional reading language:

```md
{{</* ruby "東京" "とうきょう" "ja" */>}}
```

## Parameters

| Name | Description |
| --- | --- |
| positional `base` | Text to annotate. |
| positional `rt` | Reading or annotation. |
| positional `lang` | Optional BCP 47 language tag for the reading. |
| `base` | Named form of the base text. |
| `rt` | Named form of the reading. |
| `lang` | Named form of the reading language. |
| `class` | Extra class on the `<ruby>` element. |

If `rt` is omitted, only the base text is rendered inside `<ruby>`.

## Theming

`static/css/ruby.css` keeps the reading small and muted:

```css
ruby {
    ruby-position: over;
}

rt {
    font-size: .6em;
    line-height: 1.2;
    color: SlateGray;
}
```

Override `rt` to change the reading size or color.
