---
title: "LaTeX"
description: "Inline and block math, algorithms, and TikZ diagrams."
type: docs
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
weight: 45
toc:
    show: true
    snake: true
codeblock:
    highlight: true
    cursed: true
tex:
    engine: mathjax
    math: true
    algorithm: true
    tikz: true
---

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

## Inline Math

Inline math goes in `\(...\)`:

```md
Inline math sits in a sentence: \(a^2 + b^2 = c^2\).
```

Rendered: inline math sits in a sentence, \(a^2 + b^2 = c^2\).

`$...$` is off by default so a price like $5 stays text; set `params.tex.inlineBeginDelimiter` and `inlineEndDelimiter` to `$` to use it. The default `\(...\)` needs Hugo's passthrough extension, which the example site enables in `docs/config.toml`.

## Block Math

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

## Algorithms

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

## TikZ

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
