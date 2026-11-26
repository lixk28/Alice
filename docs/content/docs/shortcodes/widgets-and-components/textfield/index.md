---
title: "TextField"
description: "A themed multi-line textarea."
date: 2024-10-04T00:09:24+08:00
lastmod: 2024-10-04T00:09:24+08:00
type: docs
aliases: ["/docs/interactive-shortcodes/textfield/", "/docs/ui-components/textfield/", "/docs/shortcodes/ui-components/textfield/", "/docs/shortcodes/widgets-components/textfield/"]
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
weight: 62
toc:
    show: true
    snake: true
codeblock:
    highlight: true
    cursed: true
---

`textfield` renders a themed multi-line block text field: a native `<textarea>` in a white box with a thin SlateGray border, a small inset shadow, and a short focus ring. It is the taller sibling of [TextLine](../textline/), intended for longer text. The `label` and `tip` accept inline Markdown, and the field keeps the browser's native resize handle, selection, and keyboard behavior.

## Usage

The shortcode reads its inner content, so initial text is written naturally between the opening and closing tags. A field with no initial text must be self-closed with `/>` (or written as an empty pair):

```
{{</* textfield label="Bio" rows=5 placeholder="Tell us about yourself." /*/>}}

{{</* textfield label="Note" */>}}
First line
Second line
{{</* /textfield */>}}
```

A filled field and an empty one with a placeholder and a tip:

{{< textfield label="Bio" rows=5 tip="Plain text only; Markdown is not rendered here." >}}
Alice writes Hugo themes.
She likes classic editorial layouts.
{{< /textfield >}}

{{< textfield label="Message" rows=4 placeholder="Tell us about yourself." tip="Shown below the field." />}}

## Icon at the top

`icon` takes a sprite path under `static/`, or a bare icon name such as `message-smile-square` (looked up in `iconSet`, default `ui-oval`). `iconPos` places it at the `start` (left, the default) or `end` (right); `left`/`right` and `before`/`after` are accepted as aliases. The icon aligns with the first line of the block, not the middle.

{{< textfield icon="message-smile-square" rows=3 placeholder="Leave a comment" tip="The icon is decorative; give the field an ariaLabel when it has no label." />}}

{{< textfield icon="svg/ui-oval/help-circle.svg" iconPos="right" rows=3 placeholder="Ask a question" ariaLabel="Your question" />}}

## Rows, width, and resize

`rows` sets the initial height; the default is `4`. The block is full-width, and `width` constrains it to any CSS length or percentage. `resize` selects the native handle: `vertical` (default), `none`, `horizontal`, or `both`.

{{< textfield rows=2 placeholder="Two rows" />}}

{{< textfield rows=6 placeholder="Six rows" />}}

{{< textfield rows=4 resize="none" placeholder="Fixed height" tip="resize=none removes the native handle." />}}

{{< textfield rows=3 width="24em" placeholder="24em wide" />}}

## Sizes

`size` accepts `small`/`s`, `medium`/`m` (default), or `large`/`l`:

{{< textfield size="small" rows=2 placeholder="Small" />}}

{{< textfield size="large" rows=3 placeholder="Large" />}}

## States

`disabled=true` disables the field, `readonly=true` keeps it focusable but not editable, and `required=true`, `maxlength`, and `autocomplete` map to the matching native attributes. `value` is the initial text for a self-closing field; inner content wins when both are present.

{{< textfield label="Disabled" rows=2 value="Read only for now" disabled=true tip="Editing is turned off." />}}

{{< textfield label="Read-only" rows=2 readonly=true >}}Alice{{< /textfield >}}

{{< textfield label="Limited" rows=2 maxlength=80 placeholder="Up to 80 characters" tip="maxlength stops input at 80 characters." />}}

## JavaScript

`js` accepts a single-token URL/path; it loads once per page with `<script src>` (page-bundle and `assets/` resources are published and loaded directly), while anything else is inline source. Inline source runs on the textarea's `input` event by default, where `this` and `el` are the textarea and `el.value` is the current text. Use `jsEvent="change"` for change-only callbacks, `jsEvent="load"` to run it once after `DOMContentLoaded`, or `jsMode="src"` / `jsMode="inline"` to force how `js` is read.

{{< textfield label="Log every keystroke" rows=3 placeholder="Type here" js="console.log(el.id, el.value)" />}}

A live character count uses the same callback:

{{< textfield label="Bio" maxlength=120 rows=3 tip="0 / 120 characters" js="el.closest('.textfield').querySelector('.textfield-tip').textContent = el.value.length + ' / 120 characters';" />}}

```
{{</* textfield id="my-textfield" label="Run" js="/js/demo.js" /*/>}}
```

A script loaded this way can find the field through its `id` (`textfield-<ordinal>` when omitted) and attach its own listeners. The inline callback receives the event as its argument.

## Parameters

| Name | Description |
| --- | --- |
| `value` | Initial text when the shortcode is self-closing. Inner content wins when both are present. |
| inner content | Initial text written between `{{</* textfield */>}}` and `{{</* /textfield */>}}`; outer whitespace is trimmed. |
| `placeholder` | Hint shown while the field is empty. Default: `params.textfield.placeholder` or `""`. |
| `label` | Visible text above the field; inline Markdown. |
| `tip` | Short hint below the field; inline Markdown. Linked with `aria-describedby`. |
| `rows` | Initial height in text rows. Default: `params.textfield.rows` or `4`. |
| `icon` | Icon path under `static/`, or a bare icon name such as `message-smile-square`; resolved by `icon.html`. |
| `iconSet` | Icon set directory under `static/svg` for a bare icon name. Default: `ui-oval`. |
| `iconPos` | `start`/`left` (default) or `end`/`right`; `before`/`after` are aliases. |
| `size` | `small`/`s`, `medium`/`m` (default), or `large`/`l`. Default: `params.textfield.size` or `medium`. |
| `resize` | Native resize handle: `none`, `vertical` (default), `horizontal`, or `both`. |
| `width` | CSS width of the whole control. Default: `params.textfield.width` or `100%`. |
| `disabled` | Disabled state. |
| `readonly` | Read-only state. |
| `required` | Mark the field as required by a form. |
| `maxlength` | Maximum number of characters. |
| `autocomplete` | Native autocomplete token, e.g. `off`. |
| `name` | Form field name. |
| `ariaLabel` | Accessible name when there is no visible label. Default: `Text field` for an unlabelled field. |
| `title` | Native tooltip. |
| `id` | Textarea id. Default: `textfield-<ordinal>`. |
| `class` | Extra classes on the wrapper. |
| `js` | Script URL/path (loaded once per page, including page bundle and `assets/` resources), or inline JavaScript source. |
| `jsMode` | `auto` (default), `src`, or `inline`; forces how `js` is read. |
| `jsEvent` | Event for inline `js`; default `input`. `load` runs it after `DOMContentLoaded`. |

Because the shortcode reads inner content, a self-closing field needs the slash: `{{</* textfield ... /*/>}}`. The code examples above use the escaped form so they display instead of rendering.

## TextField defaults and theming

Set defaults under `params.textfield`; any shortcode argument overrides them. Geometry, colors, sizes, and motion are `--textfield-*` CSS variables in `static/css/textfield.css`, so a custom stylesheet (see `params.customCSS`) can retheme every text field.

```toml
[params.textfield]
    placeholder = ""
    rows = 4
    size = "medium"
    iconPos = "start"
    resize = "vertical"
    width = ""
    class = ""
```
