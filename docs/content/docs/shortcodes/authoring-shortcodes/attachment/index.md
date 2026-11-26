---
title: "Attachment"
description: "Link page, global, or remote resources with an icon and size."
type: docs
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
weight: 41
toc:
    show: false
codeblock:
    highlight: true
    cursed: true
lightbox: false
---

The `attachment` shortcode links to a page, global, or remote resource. Page and global resources show their file size (B, KB, MB, or GB) next to the name:

{{< attachment path="attachment-example.txt" type="file" >}}

Use `name` to change the link text, or `icon=false` to hide the icon:

{{< attachment path="attachment-example.txt" type="file" name="Attachment example" icon=false >}}

Use `size=false` to hide the size:

{{< attachment path="attachment-example.txt" type="file" size=false >}}

Set `params.attachment.showIcon = false` or `params.attachment.showSize = false` to hide icons or sizes site-wide.

Other `type` values:

- `code`: {{< attachment path="attachment-example.cpp" type="code" >}}
- `image`: {{< attachment path="attachment-example.jpg" type="image" >}}
- `tarball`: {{< attachment path="attachment-example.tar.gz" type="tarball" >}}

Icons come from `params.attachment.iconmap`; `default` is the fallback for `file`, an unset type, or an unknown type.

Page resources use `location="page"` (default), files under `assets/` use `location="global"`, and URLs use `location="remote"`. Remote files are linked directly instead of being fetched during the build, so they show no size:

{{< attachment path="https://raw.githubusercontent.com/lixk28/Alice/main/README.md" location="remote" type="file" >}}
