---
title: "Tabs"
description: "Group related content into switchable tab panels."
date: 2024-10-04T00:09:24+08:00
lastmod: 2024-10-04T00:09:24+08:00
type: docs
aliases: ["/docs/interactive-shortcodes/tabs/", "/docs/ui-components/tabs/", "/docs/shortcodes/ui-components/tabs/", "/docs/shortcodes/widgets-components/tabs/"]
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
weight: 53
toc:
    show: true
    snake: true
codeblock:
    highlight: true
    cursed: true
tab:
    cursed: true
---

`tab` and `tabpanel` group related content behind a row of tabs. A
`tabpanel` owns the tab strip, and each `tab` is one selectable panel; the
choice can persist across reloads.

## Single Tab

Single tab:
{{< tab "An orphan tab" >}}
So lonely
{{< /tab >}}

## Tab Panels

Tab panel `{{</* tabpanel */>}}` with tab1 selected `choice=2` by default:
{{< tabpanel choice=2 >}}

{{< tab >}}
1
{{< /tab >}}

{{< tab >}}
22
{{< /tab >}}

{{< tab >}}
333
{{< /tab >}}

{{< tab >}}
4444
{{< /tab >}}

{{< /tabpanel >}}

nested tab panels:
{{< tabpanel >}}

{{< tab >}}
{{< loremipsum paragraphs=1 >}}
{{< /tab >}}

{{< tab "NEST BABY" >}}
{{< tabpanel >}}

{{< tab >}}
Yeah, you like that?
{{< /tab >}}

{{< tab "MORE NEST BABY" >}}
{{< tab "FREAKING NEST BABY" >}}
```C
#include <stdio.h>

int main() {
    printf("WE NEED NEST!!!");
    return 0;
}
```
{{< /tab >}}
{{< /tab >}}
{{< /tabpanel >}}

{{< /tab >}}

{{< /tabpanel >}}

## Grouping Tabs

You can also group several tab panels by specifying the `group` attribute.
It's used for synchronizing tab choices across tab panels in the same group, e.g. a doc on different platforms.

{{< tabpanel group="os" >}}
{{< tab "Linux" >}} Hello {{< /tab >}}
{{< tab "Windows" >}} o_O {{< /tab >}}
{{< tab "macOS" >}} O_O {{< /tab >}}
{{< /tabpanel >}}

{{< tabpanel group="os" >}}
{{< tab "Linux" >}} World {{< /tab >}}
{{< tab "Windows" >}} Win {{< /tab >}}
{{< tab "macOS" >}} Mac {{< /tab >}}
{{< /tabpanel >}}

Tab choices are persistent, try reloading this page.
