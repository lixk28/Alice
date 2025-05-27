---
title: "Friends"
layout: friends
codeblock:
    highlight: true
    cursed: true
tab:
    cursed: true
---


<!-- {{</* friend id="some-friend" */>}} -->

<!-- {{< friend id="apple" >}} -->

<!-- {{< friend id="alice" >}} -->

## Acknowledgements

{{< frienmily >}}


## How to add new friends?

Information of your friend can be give in `json`, `yaml`, `toml` or `xml` format.

Example friend data file:

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

{{< info title="About the fields" >}}
`avatar` also supports SVG, change `kind` to `svg` and fill the `content` with the raw `svg` markup string.

`koukando` is the weight that will be used for sorting your friends in `frienmily` shortcode. It's the romaji of "好感度" in Japanese kanji (it's also of the same meaning and orthography in Chinese), `koukando` basically stands for "favorability" in English.

So human/animal dies... `dead` is `true` if your friend dies, or his/her website dies... The dead friend will still be rendered and displayed, but the card style will be "dead", looking black and gray, the avatar will be converted to grayscale image.

The other data fields are easy to understand.
{{< /info >}}

After filling up your friend information, put your friend data file `some-friend.yaml` in the `data/friends` directory.

Now, you can display your friend!

You could display **all your friends** using the `{{</* frienmily */>}}` shortcode --- just like above.

You could also display **some friend** using the `{{</* friend id="some-friend-id" */>}}` shortcode, with a specific friend ID `some-friend-id`. For example, `{{</* friend id="alice" */>}}` will be rendered like following:

{{< friend id="alice" >}}
