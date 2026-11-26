---
title: "Code Editor"
description: "Turn a block of code into an interactive CodeMirror editor."
type: docs
aliases: ["/docs/shortcodes/authoring-shortcodes/codeeditor/", "/docs/shortcodes/ui-components/codeeditor/", "/docs/shortcodes/widgets-components/codeeditor/"]
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
weight: 66
toc:
    show: true
    snake: true
codeblock:
    highlight: true
    cursed: true
codeeditor:
    vendor: codemirror5
    modes: ["go"]
    addons: []
---

## Usage

The shortcode wraps a block of code and replaces it with a CodeMirror editor.
The inner content is trimmed, so write the code naturally between the tags:

```md
{{</* codeeditor language="go" */>}}
package main

import "fmt"

func main() {
    fmt.Println("Hello, Alice")
}
{{</* /codeeditor */>}}
```

That example renders as an editor here:

{{< codeeditor language="go" >}}
package main

import "fmt"

func main() {
    fmt.Println("Hello, Alice")
}
{{< /codeeditor >}}

## Parameters

| Name | Description |
| --- | --- |
| `language` | Language name used for CodeMirror 5 mode lookup, e.g. `go` or `python`. |

The editor id is generated as `cm5-<ordinal>` (or `cm6-<ordinal>`) and is not
configurable.

## Vendor

The site parameter selects the editor implementation:

```toml
[params.codeeditor]
    vendor = "codemirror5"
```

Accepted values are `codemirror5` / `cm5` and `codemirror6` / `cm6`.
CodeMirror 5 is the default and is recommended. CodeMirror 6 is still under
development: it has less language support, and the `js/codemirror6.min.js`
bundle is not shipped with the theme, so the site must provide it.

The site value takes precedence. A page-level `codeeditor.vendor` is only used
when the site value is absent.

CodeMirror 5 assets come from jsDelivr and are loaded only on pages that use the
shortcode.

## Modes and addons

For CodeMirror 5, load extra modes and addons with page front matter:

```yaml
codeeditor:
    vendor: codemirror5
    modes: ["go"]
    addons: []
```

- `modes` loads `mode/<name>/<name>.js` from CodeMirror 5 and the mode metadata
  used by `language`.
- `addons` loads paths under `addon/`, for example
  `edit/matchbrackets.js`.

The shortcode itself passes `language` to the editor; addons that need an
option still require the site's own setup.

## Theming

The vendor stylesheets live in `static/css/codemirror5.css` and
`static/css/codemirror6.css`. They are linked only when a page uses the
shortcode. The CodeMirror 5 editor is fixed at `600px` high in the default
stylesheet, with `25vh` minimum and `70vh` maximum.
