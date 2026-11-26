---
title: "Friends"
description: "Display one friend or the whole frienmily."
type: docs
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
weight: 10
toc:
    show: true
    snake: true
codeblock:
    highlight: true
    cursed: true
tab:
    cursed: true
---

The `friend` and `frienmily` shortcodes render cards from data files in
`data/friends`. The live grid is on the [Friends](/friends/) page.

## Display one friend

Pass the friend's `id` to `friend`:

{{< friend id="alice" >}}

```md
{{</* friend id="alice" */>}}
```

The `id` must match an `id` in a data file under `data/friends`.

## Display all friends

`frienmily` takes no arguments and renders every friend, sorted by `koukando`
from highest to lowest:

```md
{{</* frienmily */>}}
```

If there are no friend data files, it renders nothing.

## Data file

Friend data can be written in JSON, YAML, TOML, or XML. Put each file in
`data/friends/`; the file name does not have to match the `id`.

{{< tabpanel >}}

{{< tab title="json" >}}
```json
{
    "id": "friend-id",
    "name": "Friend name",
    "tagline": "Your cool tagline",
    "avatar": {
        "kind": "url",
        "content": "https://your.cool/avatar.webp"
    },
    "website": "https://your.cool.site",
    "koukando": 99,
    "dead": false
}
```
{{< /tab >}}

{{< tab title="yaml" >}}
```yaml
id: friend-id
name: Friend name
tagline: Your cool tagline
avatar:
  kind: url
  content: https://your.cool/avatar.webp
website: https://your.cool.site
koukando: 99
dead: false
```
{{< /tab >}}

{{< tab title="toml" >}}
```toml
id = "friend-id"
name = "Friend name"
tagline = "Your cool tagline"
[avatar]
    kind = "url"
    content = "https://your.cool/avatar.webp"
website = "https://your.cool.site"
koukando = 99
dead = false
```
{{< /tab >}}

{{< tab title="xml" >}}
```xml
<id>friend-id</id>
<name>Friend name</name>
<tagline>Your cool tagline</tagline>
<avatar>
  <kind>url</kind>
  <content>https://your.cool/avatar.webp</content>
</avatar>
<website>https://your.cool.site</website>
<koukando>99</koukando>
<dead>false</dead>
```
{{< /tab >}}

{{< /tabpanel >}}

## Fields

{{< info title="About the fields" >}}
`avatar` supports `url`, `svg`, and `text` content. For SVG, set `kind` to `svg`
and put the raw SVG markup in `content`.

`koukando` is the weight used by `frienmily` for sorting. It is the romaji of
"好感度" and means "favorability".

`dead` marks a friend or their website as gone. The card still renders, but the
dead style turns it black and gray and converts the avatar to grayscale.

The other fields are self-explanatory.
{{< /info >}}

## Adding a friend

1. Create a data file in `data/friends/` using one of the formats above.
2. Keep the `id` unique and use the same value in `{{</* friend id="..." */>}}`.
3. Use `{{</* frienmily */>}}` to show every friend, or `friend` to show one.

The Friends page is the demo; this page is the reference.
