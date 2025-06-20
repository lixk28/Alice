---
title: "Alice (3): Authoring Shortcodes"
description: ""
keywords: []
date: 2024-10-04T00:09:24+08:00
lastmod: 2024-10-20T12:28:15+08:00
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
tex:
    engine: mathjax
    math: true
    algorithm: true
    tikz: true
lightbox: false
mermaid: true
toc:
    show: true
    cursed: false
    snake: true
tab:
    cursed: true
codeblock:
    highlight: true
    cursed: true
---

## Tabs

### Single Tab

Single tab:
{{< tab "An orphan tab" >}}
So lonely
{{< /tab >}}

### Tab Panels

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

### Grouping Tabs

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

## Details

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

{{< details title="This is a title" marker=`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 18L9 12L15 6" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>` markerRotation="counter-clockwise" open="yes" >}}
This is a detail, with custom summary marker
{{< /details >}}

{{< details title="This is a title" open="yes" icon=`<svg iewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16.1111 3C19.6333 3 22 6.3525 22 9.48C22 15.8138 12.1778 21 12 21C11.8222 21 2 15.8138 2 9.48C2 6.3525 4.36667 3 7.88889 3C9.91111 3 11.2333 4.02375 12 4.92375C12.7667 4.02375 14.0889 3 16.1111 3Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>` >}}
This is a detail, with a heart icon
{{< /details >}}

## Admonitions

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

## Sidenotes

{{< sidenote label="It's a... sidenote" index="0" >}}
Look at me! I'm a side note! Look at this freaking sidenote!
{{< /sidenote >}}
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
{{< sidenote label="another sidenote..." index="1" >}}
Another freaking sidenote with pythagorean theorem $a^2 + b^2 = c^2$
{{< /sidenote >}}
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Commands

### Single Command

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

### Command Outputs

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

### Mutiple Commands in a Shell

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


## $\LaTeX$ Support

### Pseudocode and Algorithms

https://saswat.padhi.me/pseudocode.js

This quicksort algorithm is extracted from Chapter 7, Introduction to Algorithms (3rd edition)

{{< algorithm >}}
\begin{algorithm}
\caption{Quicksort}
\begin{algorithmic}
\PROCEDURE{Quicksort}{$A, p, r$}
    \IF{$p < r$}
        \STATE $q = $ \CALL{Partition}{$A, p, r$}
        \STATE \CALL{Quicksort}{$A, p, q - 1$}
        \STATE \CALL{Quicksort}{$A, q + 1, r$}
    \ENDIF
\ENDPROCEDURE
\PROCEDURE{Partition}{$A, p, r$}
    \STATE $x = A[r]$
    \STATE $i = p - 1$
    \FOR{$j = p$ \TO $r - 1$}
        \IF{$A[j] < x$}
            \STATE $i = i + 1$
            \STATE exchange
            $A[i]$ with     $A[j]$
        \ENDIF
        \STATE exchange $A[i]$ with $A[r]$
    \ENDFOR
\ENDPROCEDURE
\end{algorithmic}
\end{algorithm}
{{< /algorithm >}}

### TikZ Graphics

https://tikzjax.com

## Diargams

### GoAT

https://gohugo.io/content-management/diagrams/#goat-diagrams-ascii

### Mermaid

https://gohugo.io/content-management/diagrams/#mermaid-diagrams

## Marks

If this <mark>word</mark> has yellow background color and black font color on your screen,
that's because {{< sidenote label="most browsers have the following preset css rules for `<mark>`" >}} https://html.spec.whatwg.org/multipage/rendering.html#phrasing-content-3 {{< /sidenote >}}:
```css
mark {
    background: yellow;
    color: black;
}
```

Alice also uses `<mark>` to highlight and mark text,
but you can also specify

Here are {{< mark >}} some marked text {{< /mark >}}

Here are {{< mark >}} some marked text with `some code` {{< /mark >}}

Here are {{< mark >}} some marked text with [some link](https://github.com/lixk28/Alice) {{< /mark >}}

Here are {{< mark >}} some marked text with some equation $a^2 + b^2 = c^2$ {{< /mark >}}

Here are {{< mark >}} some marked text with some {{< sidenote label="sidenote" >}} Amazing {{< /sidenote >}} {{< /mark >}}

Here are {{< mark >}} some marked text with some {{< secret >}} secret {{< /secret >}} {{< /mark >}}

You can also customize some attributes of mark:
- {{< mark color="Red" >}} color {{< /mark >}}
- {{< mark backgroundColor="Pink" >}} background color {{< /mark >}}
- {{< mark scale=1.6 >}} font scale {{< /mark >}}
- {{< mark weight="bold" >}} font weight {{< /mark >}}

## Lorem Ipsum

https://en.wikipedia.org/wiki/Lorem_ipsum

You can use `{{</* loremipsum */>}}` to generate placeholder text.

{{< loremipsum >}}

You can also specify the number of parapraghs (n) generated by `{{</* loremipsum paragraphs=n */>}}`,
by default n equals to 1.

{{< loremipsum paragraphs=2 >}}
