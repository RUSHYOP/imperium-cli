# Common UIDL Layout Patterns

Reusable patterns for frequently needed layouts. Each pattern shows the UIDL tree
structure with the critical properties needed.

**FLAT ARCHITECTURE RULE:** All standard pages use ONE container-fluid with rows and columns directly inside. No container-inside-container. The only exception is fullscreen split layouts (login with video).

## Table of Contents
1. [Dashboard Page (STANDARD)](#dashboard-page) — **Use this as the default page pattern**
2. [Fullscreen Page (100vh)](#fullscreen-page)
3. [Two-Column Split Layout](#two-column-split) — Special layout (exception to flat rule)
4. [Centered Card Form](#centered-card-form) — Special layout (exception to flat rule)
5. [Multi-Column Form Row](#multi-column-form-row)
6. [Stacked Form Fields](#stacked-form-fields)
7. [Side-by-Side Buttons](#side-by-side-buttons)
8. [Header + Content + Footer](#header-content-footer)
9. [Dark Panel with Centered Content](#dark-panel-centered)
10. [Responsive Breakpoints](#responsive-breakpoints)
11. [Component Showcase / Catalog Page](#component-showcase--catalog-page) — Card-sectioned component catalog
12. [Fragment Integration Patterns](#fragment-integration-patterns) — Sidebar, stepper, dialog fragments

---

## Dashboard Page

**This is the STANDARD layout pattern.** Use this for dashboards, data views, form pages, and any page that doesn't need fullscreen splits.

**Key principle:** ONE container-fluid at root. All content flows through rows and columns directly. No inner containers for card styling — components render with their own SCSS.

```
container-page (fluid, minimal styles)
  ├── row-header (mb-three-s) → col(6)+col(6)
  │    ├── heading + paragraph (left)
  │    └── buttons (right, justify-content-end)
  ├── row-stats (mb-two-s) → 6×col(2)
  │    └── display components directly (no wrapper containers)
  ├── row-section-header (mb-two-s) → col(6)+col(6)
  │    ├── heading + paragraph (left)
  │    └── buttons + actionIcons (right)
  ├── row-search (mb-two-s) → col(4)
  │    └── search component
  └── row-table → col(12)
       └── listview
```

**Container (root — minimal styles):**
```json
{
  "id": "page-name",
  "controlType": "container",
  "containerType": "fluid",
  "styles": "{\"backgroundColor\":\"\"}",
  "className": "",
  "layout": { "colLayout": { "lg": {} } }
}
```

**Header row (title left, actions right):**
```json
{
  "id": "row-header",
  "controlType": "row",
  "styles": {},
  "className": "",
  "margin": "mb-three-s",
  "layout": { "colLayout": { "lg": { "alignItems": "center", "justifyContent": "between" } } }
}
```

**Stats row (6 KPI display components):**
Each `display` component goes directly in a `col(2)` — no wrapper container needed.
```json
// Column for each KPI
{ "className": "", "layout": { "colLayout": { "lg": { "col": 2 }, "md": { "col": 4 }, "sm": { "col": 6 } } } }
// Display component inside
{
  "controlType": "display",
  "displayTitle": "Total Orders",
  "displayValue": "1,234",
  "type": "default",
  "size": "medium",
  "alignment": "left",
  "displayPriority": "top",
  "disabled": false,
  "hideTitle": false,
  "hideValue": false,
  "overflow": false,
  "icon": false,
  "skipPreferences": false
}
```

**Action icons (with REQUIRED badge configs):**
```json
{
  "controlType": "actionIcon",
  "Icon": "FilterFilled",
  "size": "medium",
  "variant": "default",
  "disabled": false,
  "showDotBadge": false,
  "showBorder": false,
  "badgeFieldProps": { "controlType": "badge", "size": "xsmall", "color": "success" },
  "badgeCountConfig": { "controlType": "badge", "size": "xsmall", "color": "success", "content": "", "borderType": "without-border", "customColor": false, "count": true },
  "badgeIconConfig": { "controlType": "badge", "size": "xsmall", "badgeType": "icononly", "iconOnly": "AddfileFilled", "borderType": "without-border", "visibility": true, "customColor": false }
}
```

---

## How Height Works in the UIDL Runtime

> **READ THIS BEFORE WRITING ANY FULLSCREEN LAYOUT**

The swift-runtime renders each component's height as follows:

| Component | Inline style source | What to set |
|---|---|---|
| `container` | `style={{ height: layout.colLayout.lg.height }}` | Set `layout.colLayout.lg.height: "100vh"` |
| `row` | `style={{ height: layout.colLayout.lg.height \|\| "auto" }}` | Set `layout.colLayout.lg.height: "100%"` |
| `column` | `style={{ height: layout.colLayout.lg.height \|\| "" }}` | **Do NOT set** — let flex stretch handle it |

**Row**: if `layout.colLayout.lg.height` is not set, the row gets `style="height: auto"` as inline style. A class like `h-100` alone is not reliable because it fights the inline `height: auto`. Always set the row height explicitly through `layout`.

**Columns**: NEVER put `h-100` on individual columns in a fullscreen split-screen layout. The row's `alignItems: "stretch"` makes all columns fill the row height automatically. Adding `h-100` on a column whose parent row has an unreliable height causes the column to collapse to 0.

**`d-flex` on a column** (from className): turns the column into a flex container for its CHILDREN — use it when you want to control alignment of children (centering a form, stretching a panel). This comes from `className`, NOT from `layout.colLayout.lg.alignItems` (layout alignment classes use responsive Bootstrap utilities, not inline flex).

---

## Fullscreen Page

A page that fills the entire viewport with no scrollbar.

**Key requirements:**
- Container: `layout.colLayout.lg.height: "100vh"` → sets `style="height: 100vh"`
- Row: `layout.colLayout.lg.height: "100%"` → sets `style="height: 100%"` = 100% of 100vh
- Row: `layout.colLayout.lg.alignItems: "stretch"` → columns stretch to fill row height
- Columns: **no h-100** — height comes from flex stretch

```
container (fluid, layout.lg.height:"100vh", p-0, overflow:hidden)
  └── row (no-gutters, layout.lg.height:"100%", layout.lg.alignItems:"stretch")
       └── column (col-12)
            └── [content]
```

**UIDL snippet — outer container:**
```json
{
  "id": "container-page",
  "controlType": "container",
  "containerType": "fluid",
  "styles": "{\"padding\":\"0px\",\"margin\":\"0px\",\"overflow\":\"hidden\"}",
  "className": "p-0",
  "layout": { "colLayout": { "lg": { "height": "100vh" } } }
}
```

**UIDL snippet — main row:**
```json
{
  "id": "row-main",
  "controlType": "row",
  "styles": {},
  "className": "no-gutters",
  "margin": "",
  "layout": { "colLayout": { "lg": { "height": "100%", "alignItems": "stretch" } } }
}
```

---

## Two-Column Split

**NOTE: This is an exception** to the flat architecture rule. Uses nested containers because each panel has a distinct visual purpose (dark video panel vs white form card). Don't use this for standard data/form pages.

Two equal columns side by side (e.g., image left, form right).

```
container (fluid, layout.lg.height:"100vh", p-0, overflow:hidden)
  └── row (no-gutters, layout.lg.height:"100%", layout.lg.alignItems:"stretch")
       ├── column (col-6, p-0)    ← left: just remove padding, row stretch handles height
       │    └── [panel with h-100 w-100]
       └── column (col-6, d-flex align-items-center justify-content-center)  ← right: flex for centering
            └── [form panel with w-100]
```

**Column properties:**
```json
// Left column — edge-to-edge full-height content
// ONLY p-0. Row's align-items:stretch makes it full height. NO d-flex, NO h-100 on the column.
{
  "className": "p-0",
  "layout": { "colLayout": { "lg": { "col": 6 }, "md": { "col": 6 }, "sm": { "col": 12 } } }
}
// Right column — flex container ONLY to center the form panel inside it
// d-flex here is for centering children, NOT for height (height comes from row stretch)
{
  "className": "d-flex align-items-center justify-content-center",
  "layout": { "colLayout": { "lg": { "col": 6 }, "md": { "col": 6 }, "sm": { "col": 12 } } }
}
```

**Bootstrap column rules:**
- A Bootstrap `row` is ALREADY a flex container (`display: flex; flex-wrap: wrap`). Columns are flex items automatically — you NEVER need `d-flex` on a column just to make it fill its height.
- The row's `align-items: stretch` stretches ALL columns to the row's full height. No `h-100` needed on columns.
- Only add `d-flex` to a column when YOU NEED THAT COLUMN TO BE A FLEX CONTAINER FOR ITS OWN CHILDREN (e.g., centering a form card inside the column). This is different from the column filling height — that's handled by the row.
- `h-100` on a child INSIDE a column (e.g., a panel) sets `height: 100%` of the stretched column = 100% of 100vh. This works because `align-self: stretch` gives the column a definite height.

Note: On `sm` (mobile), both columns become `col-12` (stacked vertically).

---

## Split-Screen Login with Panel Hero

**Extension of Two-Column Split** — for login/auth pages that use a `panel` component as the hero (left) side instead of a video/image container. The panel provides built-in theming (`colors: "Blue"`), padding, and shadow.

```
container (fluid, layout.lg.height:"100vh", p-0, overflow:hidden)
  └── row (no-gutters, layout.lg.height:"100%", layout.lg.alignItems:"stretch")
       ├── col-hero (col-7, p-0)  ← row stretch makes it full height; no d-flex needed
       │    └── panel (h-100 w-100, Square, Blue, enablePadding:true, no shadow, no border)
       │         ├── row-brand (mb-4) → col → [icon + brand name]
       │         ├── row-headline (mb-4) → col → [h1 + description]
       │         ├── row-stats (mb-4) → 3×col(4) → panel+display cards
       │         └── row-features (mb-0) → col → panel → [feature rows]
       └── col-form (col-5, d-flex align-items-center justify-content-center p-4)
            └── panel (w-100, Rounded, White, enablePadding:true, enableShadow:true)
                 ├── row-copy (mb-4) → col → [label + h2 + description]
                 ├── row-fields (mb-4) → col → [textbox fields]
                 ├── row-options (mb-4, justifyContent:between) → [checkbox + Hyperlink]
                 ├── row-submit (mb-3) → col → button(wd-100, contained, primary)
                 └── row-footer (justifyContent:center) → col(d-flex flex-row) → [para + Hyperlink]
```

**⚠️ CRITICAL NESTING RULE — most common bug:** Both columns (col-hero AND col-form) must be **direct children of the row** — siblings in `row.children[]`. NEVER put col-form inside col-hero's children.

WRONG (col-form inside col-hero):
```json
"row.children": [
  { "id": "col-hero", "children": [
    { "id": "panel-hero" },
    { "id": "col-form", "children": [...] }  ← WRONG
  ]}
]
```
RIGHT (col-form is sibling of col-hero):
```json
"row.children": [
  { "id": "col-hero", "children": [{ "id": "panel-hero" }] },
  { "id": "col-form", "children": [{ "id": "panel-form" }] }
]
```
Wrong nesting causes col-form to be hidden inside col-hero (clipped by overflow:hidden). Always validate JSON with `node -e "JSON.parse(require('fs').readFileSync(file))"` and then check `row.children.map(c=>c.id)` shows ALL columns.

**Critical UIDL properties for this pattern:**

| Node | Key property | Value |
|---|---|---|
| container | `layout.colLayout.lg.height` | `"100vh"` |
| container | `className` | `"p-0"` |
| container | `styles` | `"{\"padding\":\"0px\",\"margin\":\"0px\",\"overflow\":\"hidden\"}"` |
| row | `layout.colLayout.lg.height` | `"100%"` ← **REQUIRED for full height** |
| row | `layout.colLayout.lg.alignItems` | `"stretch"` |
| row | `className` | `"no-gutters"` |
| col-hero | `className` | `"p-0"` — row stretch handles height, no d-flex needed |
| panel-hero | `className` | `"h-100 w-100"` |
| panel-hero | `variant` | `"Square"` (no rounded corners for full-bleed) |
| panel-hero | `enableShadow` | `false` |
| panel-hero | `enableborder` | `false` |
| panel-hero | `colors` | `"Blue"` |
| col-form | `className` | `"d-flex align-items-center justify-content-center p-4"` |
| panel-form | `className` | `"w-100"` |
| panel-form | `variant` | `"Rounded"` |
| panel-form | `enableShadow` | `true` |

**Form fields:** Use `textbox` with `variant: "outlined"`, `inputFieldType: "text"` (or `"password"`), `enableInheritWidth: true`, `className: "wd-100"`. **Never use `inputgroup` for simple text inputs** — it is a combo container, not a text field.

**Link-style actions** (Forgot password, Request access): Use `Hyperlink` with `content`, `url`, `variant: "primary"` (required!) — NOT a button.

**Column width split:** `col-7` hero + `col-5` form = 12. Adjust to `col-6`+`col-6` for balanced layout.

---

## Centered Card Form

**NOTE: This is an exception** to the flat architecture rule. Use nested containers only when you genuinely need to center a card-like container with `maxWidth` and custom padding (e.g., login page, standalone form). For standard dashboard pages, don't use this pattern.

A card-like container centered both vertically and horizontally.

```
container (fluid, 100vh)
  └── row (h-100, center/center)
       └── column (col-6 or col-4, flex center)
            └── container (fluid, white bg, padding, maxWidth, shadow)
                 └── [form rows inside]
```

**Inner card container:**
```json
{
  "id": "container-card",
  "controlType": "container",
  "containerType": "fluid",
  "styles": "{\"backgroundColor\":\"#ffffff\",\"padding\":\"40px\",\"borderRadius\":\"8px\",\"boxShadow\":\"0 2px 10px rgba(0,0,0,0.1)\",\"width\":\"100%\",\"maxWidth\":\"450px\"}",
  "className": "",
  "layout": { "colLayout": { "lg": {} } }
}
```

**The centering column:**
```json
{
  "className": "d-flex align-items-center justify-content-center",
  "layout": { "colLayout": { "lg": { "col": 12 } } }
}
```

This is valid because the column directly positions a single nested container. If the column
contained Row children instead, it should be breakpoint-only with no flex/alignment classes.

**The centering row:**
```json
{
  "className": "h-100",
  "layout": { "colLayout": { "lg": { "alignItems": "center", "justifyContent": "center" } } }
}
```

---

## Multi-Column Form Row

Two or more fields side by side in one row (e.g., First Name / Last Name).

```
row (mb-two-s)
  ├── column (col-6)
  │    └── textbox-firstname
  └── column (col-6)
       └── textbox-lastname
```

**Row:**
```json
{
  "id": "row-names",
  "controlType": "row",
  "styles": {},
  "margin": "mb-two-s",
  "layout": { "colLayout": { "lg": {} } }
}
```

**Columns:**
```json
// First column
{ "layout": { "colLayout": { "lg": { "col": 6 }, "md": { "col": 6 }, "sm": { "col": 12 } } } }
// Second column
{ "layout": { "colLayout": { "lg": { "col": 6 }, "md": { "col": 6 }, "sm": { "col": 12 } } } }
```

---

## Stacked Form Fields

Vertical stack of labeled input fields with consistent spacing.

```
container-form
  ├── row (mb-two-s) → col-12 → textbox (field 1)
  ├── row (mb-two-s) → col-12 → textbox (field 2)
  ├── row (mb-two-s) → col-12 → textbox (field 3)
  └── row (mb-two-s) → col-12 → button (submit)
```

**Each field row:**
```json
{
  "id": "row-field-N",
  "controlType": "row",
  "styles": {},
  "margin": "mb-two-s",
  "layout": { "colLayout": { "lg": {} } },
  "children": [{
    "controlType": "column",
    "layout": { "colLayout": { "lg": { "col": 12 } } },
    "children": [{
      "controlType": "textbox",
      "caption": "Field Label",
      "placeholder": "Enter value",
      "variant": "outlined",
      "size": "medium",
      "enableInheritWidth": true,
      "className": "wd-100"
    }]
  }]
}
```

Pattern: use `margin: "mb-two-s"` on every row for consistent 16px vertical spacing.
Use `"mb-three-s"` for section dividers (extra spacing).

---

## Side-by-Side Buttons

Two buttons arranged horizontally (e.g., Cancel + Submit).

```
row (mb-two-s, justifyContent: "end")
  ├── column (col: "auto")
  │    └── button (variant: "outlined", Cancel)
  └── column (col: "auto")
       └── button (variant: "contained", Submit)
```

**Row with right-aligned items:**
```json
{
  "controlType": "row",
  "margin": "mb-two-s",
  "layout": { "colLayout": { "lg": { "justifyContent": "end" } } }
}
```

**Auto-width columns:**
```json
{ "layout": { "colLayout": { "lg": { "col": "auto" } } } }
```

---

## Header + Content + Footer

Three-section vertical layout within a fullscreen container.

```
container (fluid, 100vh, p-0)
  └── row (no-gutters h-100, stretch)
       └── column (col-12, h-100, flex-column)
            ├── container-header (fixed height via lg.height)
            │    └── row → col → heading/buttons
            ├── container-content (flex-grow, overflow-auto)
            │    └── row → col → [scrollable content]
            └── container-footer (fixed height via lg.height)
                 └── row → col → buttons/links
```

**Header container:**
```json
{
  "controlType": "container",
  "containerType": "fluid",
  "styles": "{\"backgroundColor\":\"#ffffff\",\"borderBottom\":\"1px solid #e0e0e0\",\"padding\":\"15px 30px\"}",
  "layout": { "colLayout": { "lg": { "height": "60px" } } }
}
```

**Content container (fills remaining space):**
```json
{
  "controlType": "container",
  "containerType": "fluid",
  "styles": "{\"flex\":\"1\",\"overflowY\":\"auto\",\"padding\":\"20px\"}",
  "className": "",
  "layout": { "colLayout": { "lg": {} } }
}
```

**Main column needs flex-column:**
```json
{
  "className": "h-100 d-flex flex-column",
  "layout": { "colLayout": { "lg": { "col": 12 } } }
}
```

This is valid because the column directly contains the header/content/footer containers. A column
whose direct children are Rows should not use these flex classes.

---

## Dark Panel Centered

A dark panel with centered content (used for video/image side panels).

```
container (fluid, dark bg, 100% height via lg.height, flex center)
  └── row (center/center)
       └── column (wd-100, col-12)
            └── [video / image / content]
```

**Container:**
```json
{
  "controlType": "container",
  "containerType": "fluid",
  "styles": "{\"backgroundColor\":\"#1a1a2e\",\"padding\":\"0px\",\"overflow\":\"hidden\",\"width\":\"100%\",\"display\":\"flex\",\"alignItems\":\"center\",\"justifyContent\":\"center\"}",
  "className": "p-0",
  "layout": { "colLayout": { "lg": { "height": "100%" } } }
}
```

**Centering row inside:**
```json
{
  "controlType": "row",
  "layout": { "colLayout": { "lg": { "alignItems": "center", "justifyContent": "center" } } }
}
```

---

## Responsive Breakpoints

The grid supports three breakpoints via `layout.colLayout`:

| Breakpoint | Key | Viewport Width | Usage |
|-----------|-----|---------------|-------|
| Large | `lg` | ≥992px | Desktop |
| Medium | `md` | ≥768px | Tablet |
| Small | `sm` | <768px | Mobile |

**Common responsive patterns:**

```json
// Two columns → stacked on mobile
{ "lg": { "col": 6 }, "md": { "col": 6 }, "sm": { "col": 12 } }

// Three columns → stacked on mobile
{ "lg": { "col": 4 }, "md": { "col": 6 }, "sm": { "col": 12 } }

// Sidebar + main → stacked on mobile
// Sidebar:
{ "lg": { "col": 3 }, "md": { "col": 4 }, "sm": { "col": 12 } }
// Main:
{ "lg": { "col": 9 }, "md": { "col": 8 }, "sm": { "col": 12 } }
```

Only `lg` is strictly required. If `md`/`sm` are omitted, the `lg` value applies at all sizes.

---

## Component Showcase / Catalog Page

A page that displays all component variants, colors, sizes, and states. Uses `card` with hidden header/footer as section wrappers.

**Key principles:**
- ONE container-fluid at root (flat architecture)
- Each section: heading row + card row
- Cards: `enableHeader: false`, `enableFooter: false`, `type: "with-border"` — body-only section wrapper
- Inside each card body: container → rows → columns → leaf components
- Multiple components in one column: `className: "d-flex flex-wrap align-items-center"` on column, `className: "mr-two-s mb-two-s"` on each leaf

```
container-fluid (showcase-page)
  ├── row → col → heading "Component Showcase" + paragraph
  ├── row → col → heading "Buttons" (section heading)
  ├── row → col → card (enableHeader:false, enableFooter:false)
  │   └── body → container →
  │       ├── row-label "Contained" → row → col(d-flex) → 6× button(contained, primary|secondary|success|error|warning|info)
  │       ├── row-label "Outlined" → row → col(d-flex) → 6× button(outlined, ...)
  │       ├── row-label "Text" → row → col(d-flex) → 6× button(text, ...)
  │       ├── row-label "Sizes" → row → col(d-flex) → button(small) + button(medium) + button(large)
  │       └── row-label "Disabled" → row → col(d-flex) → disabled buttons
  ├── row → col → heading "Text Inputs"
  ├── row → col → card → body → textbox variants × sizes + dropdown + numeric + datePicker
  ├── ... (Selection, Display, Typography, Actions sections)
```

**Card as section wrapper:**
```json
{
  "controlType": "card",
  "enableHeader": false,
  "enableFooter": false,
  "enableBody": true,
  "type": "with-border",
  "size": "large",
  "hideCaption": true,
  "EnableCardBorder": true,
  "EnableCardShadow": false,
  "children": {
    "header": [],
    "body": [
      { "controlType": "container", "containerType": "fluid", "children": [
        { "controlType": "row", "children": [
          { "controlType": "column", "className": "d-flex flex-wrap align-items-center", "children": [
            { "controlType": "button", "caption": "Primary", "color": "primary", "className": "mr-two-s mb-two-s" },
            { "controlType": "button", "caption": "Success", "color": "success", "className": "mr-two-s mb-two-s" }
          ]}
        ]}
      ]}
    ],
    "footer": []
  }
}
```

**Reference file:** `samples/07-component-showcase.json` — complete 7985-line showcase with 22 component types across 6 sections (Buttons, Inputs, Selection, Display & Status, Typography, Actions & Progress).

---

## Fragment Integration Patterns

Fragments are reusable UIDL pieces loaded dynamically inside a parent page's container component. Common use cases: sidebars, stepper steps, dialog content, tab panels.

### Sidebar Fragment

The sidebar is a separate UIDL JSON file. The parent page references it via a panel or Div:

**Parent page structure:**
```
container-page (fluid)
  └── row-main (no-gutters, h-100, stretch)
       ├── col-sidebar (col-2, h-100)
       │    └── panel or Div with fragmentId → loads sidebar UIDL
       └── col-content (col-10)
            └── [main page content rows]
```

The sidebar fragment is a separate UIDL file with its own container → rows → columns → navigation components (Hyperlinks, actionIcons, headings, etc).

### Stepper Fragment

Each step in a stepper loads its content from a separate fragment UIDL:

**Parent stepper:**
```json
{
  "controlType": "stepper",
  "id": "stepper-wizard",
  "children": [
    {
      "id": "step-personal",
      "label": "Personal Info",
      "fragment": {
        "fragmentId": "FG001",
        "value": "page-id-personal-info",
        "activityName": ""
      }
    },
    {
      "id": "step-address",
      "label": "Address",
      "fragment": {
        "fragmentId": "FG002",
        "value": "page-id-address",
        "activityName": ""
      }
    }
  ]
}
```

**Each step's fragment UIDL** is a standard page JSON with form fields for that step's content.

### Dialog Fragment

Complex dialog content is loaded as a fragment rather than using the simple `body` string prop:

```json
{
  "controlType": "dialogModal",
  "id": "dialog-edit",
  "fragmentId": "FG010",
  "pageId": "page-id-for-edit-form",
  "fragmentOutParams": {}
}
```

The dialog fragment UIDL is a standard page with form fields for the dialog's content.

### Tab Fragment

Tabs can load fragments when tab IDs use the `FG...` prefix convention. The runtime extracts the fragmentId from the tab ID and namespaces the children:

```json
{
  "controlType": "tab",
  "tabDefinition": [
    { "id": "FG020_tab-overview", "title": "Overview" },
    { "id": "FG021_tab-details", "title": "Details" }
  ],
  "children": {
    "FG020_tab-overview": [ /* fragment content loaded here */ ],
    "FG021_tab-details": [ /* fragment content loaded here */ ]
  }
}
```

### Key Fragment Rules
- Fragment IDs always start with `"FG"` followed by a number
- All component IDs inside a fragment get prefixed with `{fragmentId}_` automatically
- Output parameters are namespaced as `{fragmentId}_{paramName}`
- Each fragment is a separate UIDL JSON file with the same structure as a page
- The runtime fetches fragments via the page API endpoint
- Fragment state (for steppers) is tracked in a Zustand `fragmentStateStore`
