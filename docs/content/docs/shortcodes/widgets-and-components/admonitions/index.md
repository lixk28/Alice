---
title: "Admonitions"
description: "Note, tip, info, help, alert, and custom admonition boxes."
type: docs
aliases: ["/docs/shortcodes/ui-components/admonitions/", "/docs/shortcodes/widgets-components/admonitions/"]
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
weight: 65
toc:
    show: false
codeblock:
    highlight: true
    cursed: true
---

{{< admonition type="note" collapsible="yes" >}}
This is a note admonition
{{< /admonition >}}

{{< admonition type="info" collapsible="yes" >}}
This is an info admonition
{{< /admonition >}}

{{< admonition type="tip" collapsible="yes" >}}
This is a tip admonition
{{< /admonition >}}

{{< admonition type="help" collapsible="yes" >}}
This is a help admonition
{{< /admonition >}}

{{< admonition type="alert" collapsible="yes" >}}
This is an alert admonition
{{< /admonition >}}


You can customize admonition title:
{{< admonition type="info" title="Your nice title :D" >}}
This is a collapsible info, with custom title
{{< /admonition >}}

You can make it collapsible:
{{< admonition type="info" title="Your nice title :D" collapsible="yes" >}}
This is a collapsible info, with custom title, collaspsible and closed by default
{{< /admonition >}}

You can also specify whether it should be opened by default:
{{< admonition type="info" title="Your nice title :D" collapsible="yes" open="yes" >}}
This is a collapsible info, with custom title, collaspsible and open by default
{{< /admonition >}}


Note that you can use the shortcode `{{</* note */>}}` to replace `{{</* admonition type="note" */>}}`, it's less verbose:
{{< note collapsible="yes" >}}
This is a note admonition
{{< /admonition >}}

{{< info collapsible="yes" >}}
This is an info admonition
{{< /admonition >}}

{{< tip collapsible="yes" >}}
This is a tip admonition
{{< /admonition >}}

{{< help collapsible="yes" >}}
This is a help admonition
{{< /admonition >}}

{{< alert collapsible="yes" >}}
This is an alert admonition
{{< /admonition >}}


You can have nested admonitions:
{{< note collapsible="yes" open="yes" >}}
This is a note admonition
{{< info collapsible="yes" >}}
And this is an info admonition, inside a note
{{< tip collapsible="yes" >}}
And this is a tip admonition, inside an info inside a note
{{< /admonition >}}
{{< /admonition >}}
{{< /admonition >}}
