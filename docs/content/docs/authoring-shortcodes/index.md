---
title: "Authoring Shortcodes"
description: "Attachments, admonitions, sidenotes, shell output, math, diagrams, and more."
date: 2024-10-04T00:09:24+08:00
lastmod: 2024-10-20T12:28:15+08:00
type: docs
weight: 40
aliases: ["/posts/authoring-shortcodes/"]
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
toc:
    show: true
    snake: true
codeblock:
    highlight: true
    cursed: true
lightbox: false
tex:
    engine: mathjax
    math: true
    algorithm: true
    tikz: true
mermaid: true
---


## Attachment

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

{{< details title="This is a title" marker=`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 18L9 12L15 6" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>` markerRotation="counterclockwise" open="yes" >}}
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
Another freaking sidenote with pythagorean theorem \(a^2 + b^2 = c^2\)
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

Three independent features, each off until you enable it. Set them site-wide in `params.tex`, or per page in front matter:

```yaml
tex:
  math: true       # formulas
  algorithm: true  # algorithm blocks
  tikz: true       # tikz diagrams
```

Page front matter wins over the site value, so a site-wide `math: true` can still be turned off on a single page.

Math and algorithms share one engine, chosen with `params.tex.engine`:

| `engine` | Renders | Good for |
|---|---|---|
| `mathjax` (default) | in the browser | the widest LaTeX coverage |
| `katex` | in the browser | faster startup |
| `hugo` | at build time | pages that should ship no math JavaScript |

The `hugo` engine renders with the KaTeX built into Hugo, so the page loads no math script.

### Inline Math

Inline math goes in `\(...\)`:

```md
Inline math sits in a sentence: \(a^2 + b^2 = c^2\).
```

Rendered: inline math sits in a sentence, \(a^2 + b^2 = c^2\).

`$...$` is off by default so a price like $5 stays text; set `params.tex.inlineBeginDelimiter` and `inlineEndDelimiter` to `$` to use it. The default `\(...\)` needs Hugo's passthrough extension, which the example site enables in `docs/config.toml`.

### Block Math

Display math goes in `\[...\]`:

```md
\[
A = \begin{pmatrix}
a_{11} & a_{12} \\
a_{21} & a_{22}
\end{pmatrix},
\qquad
f(x) = \begin{cases}
x^2 & x \ge 0, \\
-x  & x < 0.
\end{cases}
\]
```

Which renders as:

\[
A = \begin{pmatrix}
a_{11} & a_{12} \\
a_{21} & a_{22}
\end{pmatrix},
\qquad
f(x) = \begin{cases}
x^2 & x \ge 0, \\
-x  & x < 0.
\end{cases}
\]

A `math` fence keeps long expressions readable in the source:

````md
```math
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
```
````

Which renders as:

```math
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
```

Aligned equations, with summation and fractions:

```md
\[
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0}, \\
\nabla \times \mathbf{B} &= \mu_0 \mathbf{J}
    + \mu_0 \varepsilon_0 \frac{\partial \mathbf{E}}{\partial t}, \\
\sum_{k=1}^{n} k &= \frac{n(n+1)}{2}.
\end{aligned}
\]
```

Which renders as:

\[
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0}, \\
\nabla \times \mathbf{B} &= \mu_0 \mathbf{J}
    + \mu_0 \varepsilon_0 \frac{\partial \mathbf{E}}{\partial t}, \\
\sum_{k=1}^{n} k &= \frac{n(n+1)}{2}.
\end{aligned}
\]

`math` is the only math fence name: a fence tagged `katex` or `mathjax` is shown as code. All three engines cover `aligned`, `pmatrix`, and `cases`.

`$$...$$` is off by default; set `params.tex.blockBeginDelimiter` and `blockEndDelimiter` to `$$` to use it. KaTeX (the `katex` and `hugo` engines) has no CJK glyphs, so use `mathjax` for formulas containing Chinese. With `engine = 'hugo'`, `params.tex.hugo.output` picks `mathml` (the default), `html`, or `htmlAndMathml`; page front matter can override it.

### Algorithms

Wrap `algorithmic` markup in the `algorithm` shortcode. Math inside is typeset for you: pseudocode.js has its own `$...$` syntax, independent of `params.tex.*Delimiter`.

```
{{</* algorithm */>}}
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
{{</* /algorithm */>}}
```

Which renders as:

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

The grammar is [pseudocode.js](https://saswat.padhi.me/pseudocode.js)': `\STATE`, `\IF`/`\ENDIF`, `\FOR`/`\ENDFOR`, `\WHILE`/`\ENDWHILE`, `\PROCEDURE`, `\CALL`, `\RETURN`, and `$...$` for math.

Appearance is configured under `params.tex.pseudocode`, and a page can override it:

```yaml
tex:
  pseudocode:
    lineNumber: true
    titlePrefix: "Algo"
```

| Key | Default | Meaning |
|---|---|---|
| `indentSize` | `1.6em` | Indent inside a control block. Must carry an `em` unit. |
| `commentDelimiter` | `//` | Line comment marker. Only whole-line comments work. |
| `lineNumber` | `true` | Show line numbers. |
| `lineNumberPunc` | `''` | Punctuation after a line number. |
| `noEnd` | `true` | Hide `end if`, `end procedure`, and friends. |
| `scopeLines` | `false` | Draw vertical lines for nested block scopes. |
| `titlePrefix` | `Algorithm` | Prefix before the caption number. |
| `captionCount` | unset | Restart the caption counter at this number. |

Omit a key to keep the library default.

### TikZ

Wrap TikZ markup in the `tikz` shortcode. A fence tagged `tikz` is treated as an ordinary code block (handy for showing the source), so the shortcode is the only way to render a diagram. A shaded circle with a labelled radius:

```
{{</* tikz */>}}
\begin{tikzpicture}[scale=1.2]
\draw[thick, fill=blue!12] (0,0) circle (1.5cm);
\draw[->, thick] (0,0) -- (1.5,0) node[midway, below] {$r$};
\fill (0,0) circle (2pt) node[below left] {$O$};
\draw[dashed] (-1.5,0) -- (1.5,0);
\end{tikzpicture}
{{</* /tikz */>}}
```

Which renders as:

{{< tikz >}}
\begin{tikzpicture}[scale=1.2]
\draw[thick, fill=blue!12] (0,0) circle (1.5cm);
\draw[->, thick] (0,0) -- (1.5,0) node[midway, below] {$r$};
\fill (0,0) circle (2pt) node[below left] {$O$};
\draw[dashed] (-1.5,0) -- (1.5,0);
\end{tikzpicture}
{{< /tikz >}}

A commutative square, where TikZ beats a picture:

```
{{</* tikz */>}}
\begin{tikzpicture}[scale=1]
\node (A) at (0,1.4) {$A$};
\node (B) at (3,1.4) {$B$};
\node (C) at (0,0) {$C$};
\node (D) at (3,0) {$D$};
\draw[->] (A) -- node[above] {$f$} (B);
\draw[->] (A) -- node[left] {$g$} (C);
\draw[->] (B) -- node[right] {$h$} (D);
\draw[->] (C) -- node[below] {$k$} (D);
\draw[->, dashed] (A) to[bend right=20] node[above left] {$\exists!$} (D);
\end{tikzpicture}
{{</* /tikz */>}}
```

Which renders as:

{{< tikz >}}
\begin{tikzpicture}[scale=1]
\node (A) at (0,1.4) {$A$};
\node (B) at (3,1.4) {$B$};
\node (C) at (0,0) {$C$};
\node (D) at (3,0) {$D$};
\draw[->] (A) -- node[above] {$f$} (B);
\draw[->] (A) -- node[left] {$g$} (C);
\draw[->] (B) -- node[right] {$h$} (D);
\draw[->] (C) -- node[below] {$k$} (D);
\draw[->, dashed] (A) to[bend right=20] node[above left] {$\exists!$} (D);
\end{tikzpicture}
{{< /tikz >}}

Only TikZ's base colour set is available (`red`, `blue`, `black`, `gray`, and mixtures like `blue!12`). Names from the extended xcolor sets, such as `AliceBlue`, are not defined unless a site preloads them.

TikZ is pre-rendered to static SVG by `npm run build:tikz` (`scripts/build-tikz.js`), which runs `node-tikzjax` — a Node + WebAssembly build of [TikZJax](https://tikzjax.com) — writes `assets/tikz/<hash>.svg` plus the Computer Modern fonts the diagrams use, and lets the theme inline the result. A built site then needs neither network access nor a client-side renderer. Both `npm run build` and `npm run build:docs` run the step before `hugo`. Without it — or inside `hugo server`, which keeps editing fast — the block falls back to the TikZJax CDN renderer. Everything else on this page ships with the theme.

## Diargams

### GoAT

https://gohugo.io/content-management/diagrams/#goat-diagrams-ascii

### Mermaid

https://gohugo.io/content-management/diagrams/#mermaid-diagrams

````md
```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```
````

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```

## Lorem Ipsum

https://en.wikipedia.org/wiki/Lorem_ipsum

You can use `{{</* loremipsum */>}}` to generate placeholder text.

{{< loremipsum >}}

You can also specify the number of parapraghs (n) generated by `{{</* loremipsum paragraphs=n */>}}`,
by default n equals to 1.

{{< loremipsum paragraphs=2 >}}
