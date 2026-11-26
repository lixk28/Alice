---
title: "Details"
description: "A collapsible details block with an optional title, icon, and marker."
type: docs
aliases: ["/docs/shortcodes/ui-components/details/", "/docs/shortcodes/widgets-components/details/"]
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
weight: 64
toc:
    show: false
codeblock:
    highlight: true
    cursed: true
---

{{< details title="This is a title" >}}
This is a detail
{{< /details >}}

{{< details title="This is a title" open="yes" >}}
This is a detail, open by default
{{< /details >}}

{{< details title="This is a title" collapsible="no" >}}
This is a detail, but not collapsible
{{< /details >}}

{{< details title="This is a title" open="yes" markerPosition="begin" >}}
This is a detail, marker at begin
{{< /details >}}

{{< details title="This is a title" open="yes" markerPosition="middle" >}}
This is a detail, marker at middle
{{< /details >}}

{{< details title="This is a title" marker=`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 18L9 12L15 6" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>` markerRotation="counterclockwise" open="yes" >}}
This is a detail, with custom summary marker
{{< /details >}}

{{< details title="This is a title" open="yes" icon=`<svg iewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16.1111 3C19.6333 3 22 6.3525 22 9.48C22 15.8138 12.1778 21 12 21C11.8222 21 2 15.8138 2 9.48C2 6.3525 4.36667 3 7.88889 3C9.91111 3 11.2333 4.02375 12 4.92375C12.7667 4.02375 14.0889 3 16.1111 3Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>` >}}
This is a detail, with a heart icon
{{< /details >}}
