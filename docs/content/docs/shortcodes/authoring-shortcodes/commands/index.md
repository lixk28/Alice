---
title: "Commands"
description: "Terminal commands and command output blocks."
type: docs
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
weight: 44
toc:
    show: true
    snake: true
codeblock:
    highlight: true
    cursed: true
---

## Single Command

Display commands and their outputs.

Line layout (default):
{{< cmd layout="line" >}}
ls -al
{{< /cmd >}}

Block layout:
{{< cmd layout="block" showinfo="yes" >}}
ls -al
{{< /cmd >}}

Multi-line commands:

Line layout:
{{< cmd layout="line" >}}
ls -al \
qwd \
qdwwqd
{{< /cmd >}}

Block layout:
{{< cmd layout="block" >}}
ls -al \
qwd \
qdwwqd
{{< /cmd >}}

## Command Outputs

Command with outputs:
{{< cmd layout="line" >}}
ls -al ls -al ls -al ls -al ls -al
{{< cmdout >}}
total 240
drwx------. 34 xack xack  4096 Jun  3 02:43 .
drwxr-xr-x.  4 root root  4096 May  4 02:02 ..
drwxr-xr-x.  9 xack xack  4096 May 29 00:54 Alice
{{< /cmdout >}}
{{< /cmd >}}

{{< cmd layout="block" >}}
ls -al
{{< cmdout >}}
total 240
drwx------. 34 xack xack  4096 Jun  3 02:43 .
drwxr-xr-x.  4 root root  4096 May  4 02:02 ..
drwxr-xr-x.  9 xack xack  4096 May 29 00:54 Alice
{{< /cmdout >}}
{{< /cmd >}}

## Mutiple Commands in a Shell

{{< shell >}}
{{< cmd layout="line" >}}
mkdir hello && cd hello && touch hello.c
{{< /cmd >}}

{{< cmd layout="line" workdir="~/hello" >}}
cat >> hello.c << EOF
#include <stdio.h>
int main()
{
    printf("hello world\n");
    return 0;
}
{{< /cmd >}}

{{< cmd layout="line" workdir="~/hello" >}}
cat hello.c
{{< cmdout >}}
#include <stdio.h>
int main()
{
    printf("hello world\n");
    return 0;
}
{{< /cmdout >}}
{{< /cmd >}}

{{< cmd layout="line" workdir="~/hello" >}}
gcc hello.c
{{< /cmd >}}

{{< cmd layout="line" workdir="~/hello" >}}
ls -al
{{< cmdout >}}
total 32
drwxr-xr-x.  2 root root  4096 Jun  3 11:40 .
drwx------. 35 root root  4096 Jun  3 11:40 ..
-rwxr-xr-x.  1 root root 12568 Jun  3 11:40 a.out
-rw-r--r--.  1 root root    78 Jun  3 11:40 hello.c
{{< /cmdout >}}
{{< /cmd >}}

{{< cmd layout="line" workdir="~/hello" >}}
./a.out
{{< cmdout >}}
hello world
{{< /cmdout >}}
{{< /cmd >}}

{{< /shell >}}

