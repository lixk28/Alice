---
title: "Button Group"
description: "Group buttons, radios, or checkboxes under one legend."
date: 2024-10-04T00:09:24+08:00
lastmod: 2024-10-04T00:09:24+08:00
type: docs
aliases: ["/docs/interactive-shortcodes/button-group/", "/docs/ui-components/button-group/", "/docs/shortcodes/ui-components/button-group/", "/docs/shortcodes/widgets-components/button-group/"]
categories: ["Documentation"]
tags: ["Alice", "Shortcode"]
weight: 59
toc:
    show: true
    snake: true
codeblock:
    highlight: true
    cursed: true
---

`buttongroup` wraps one or more `button`, `radio`, or `checkbox` shortcodes in a native `<fieldset>` with an optional `<legend>`. `name` is the visible group title (inline Markdown), rendered as the legend; it is not a DOM id or form name. The fieldset id defaults to `buttongroup-<ordinal>` and seeds the default child ids of button/radio/checkbox children plus the default native name of radio/checkbox children, so a group of radios is mutually exclusive without setting `name` on each one. The group is a thin Silver-bordered panel with a plain bold Navy title. `orientation` chooses a vertical stack (default) or a wrapping horizontal row.

The group passes `size` to its children (a child's own `size` wins) and `disabled=true` disables every child. Colors stay with each component: use a button `type`/`tintColor`, a radio `tintColor`/`dotColor`, or a checkbox `tintColor`/`checkColor`. There is no group-level `js`; attach `js` to the individual control that needs behavior.

## Usage

```
{{</* buttongroup name="Actions" orientation="horizontal" */>}}
  {{</* button label="Save" type="primary" */>}}
  {{</* button label="Preview" */>}}
  {{</* button label="Cancel" */>}}
{{</* /buttongroup */>}}
```

A horizontal group of buttons:

{{< buttongroup name="Actions" orientation="horizontal" >}}
  {{< button label="Save" type="primary" >}}
  {{< button label="Preview" >}}
  {{< button label="Cancel" >}}
{{< /buttongroup >}}

A group of radios (`name` on each child is optional; the group id is the default native name):

{{< buttongroup name="Drink" >}}
  {{< radio label="Coffee" checked=true >}}
  {{< radio label="Tea" >}}
  {{< radio label="Water" >}}
{{< /buttongroup >}}

A horizontal group of checkboxes:

{{< buttongroup name="Toppings" orientation="horizontal" >}}
  {{< checkbox label="Cheese" checked=true >}}
  {{< checkbox label="Olives" >}}
  {{< checkbox label="Mushrooms" >}}
{{< /buttongroup >}}

## Shared size and disabled state

`size` (or `s` / `m` / `l`) is a fallback for every child; a child's own size wins. `disabled=true` disables all buttons, radios, and checkboxes in the group.

{{< buttongroup name="Plan" orientation="horizontal" size="large" >}}
  {{< radio label="Basic" checked=true >}}
  {{< radio label="Pro" size="small" >}}
  {{< button label="Choose" type="primary" >}}
{{< /buttongroup >}}

A disabled group:

{{< buttongroup name="Unavailable" orientation="horizontal" disabled=true >}}
  {{< button label="Action" >}}
  {{< radio name="disabled-radio" label="Option A" checked=true >}}
  {{< checkbox name="disabled-checkbox" label="Option B" >}}
{{< /buttongroup >}}

## Parameters

| Name | Description |
| --- | --- |
| `name` | Visible group title; inline Markdown. Rendered as the fieldset legend. |
| `orientation` | `vertical`/`v` (default) or `horizontal`/`h`. |
| `size` | Fallback size for the children: `small`/`s`, `medium`/`m`, or `large`/`l`. A child's own size wins. |
| `disabled` | Disable every child button, radio, and checkbox. |
| `ariaLabel` | Accessible name when there is no visible title. Default: `Button group`. |
| `id` | Fieldset id. Default: `buttongroup-<ordinal>`. Also the default native name and child-id base for button/radio/checkbox children. |
| `class` | Extra classes on the fieldset. |

## Button group defaults and theming

Set site defaults under `params.buttongroup` for orientation and extra classes; a shortcode argument still wins. Group geometry and the title are `--button-group-*` CSS variables in `static/css/buttongroup.css`; the children keep their own `--button-*`, `--radio-*`, and `--checkbox-*` variables.

```toml
[params.buttongroup]
    orientation = "vertical"
    class = ""
```
